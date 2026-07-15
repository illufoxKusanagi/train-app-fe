'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { api, ApiError } from '@/services/api';
import {
  Play,
  Loader2,
  Trophy,
  Activity,
  Download,
  TriangleAlert,
} from 'lucide-react';
import PageLayout from '@/components/page-layout';
import { Input } from '@/components/ui/input';
import { InputWidget } from '@/components/inputs/input-widget';
import {
  accelerationFormDatas,
  weakeningFormDatas,
  constraintFormDatas,
  OptimizationFormSchema,
} from './form.constants';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormPersistence } from '@/contexts/FormPersistenceContext';
import { useSystemStatus } from '@/contexts/SystemStatusContext';
import { useTranslations } from 'next-intl';
import { exportTableToCsv } from '@/lib/csv-export';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WinnerTab } from './winner-tab';
import { FuzzyMemberTab } from './fuzzy-member-tab';

interface OptResult {
  acc_start_si: number; // m/s²
  v_p1: number; // km/h
  peakMotorPower: number; // kW/motor
  travelTime: number; // seconds
  fuzzyScore: number; // 0–100
  energyConsumption: number; // kWh
  isPassed: boolean;
}

function scoreColor(score: number): string {
  if (score >= 75) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  if (score >= 25) return 'text-orange-500';
  return 'text-red-500';
}

function scoreLabel(score: number, t: (key: string) => string): string {
  if (score >= 75) return t('excellent');
  if (score >= 50) return t('good');
  if (score >= 25) return t('fair');
  return t('poor');
}

function scoreBadgeClass(score: number): string {
  if (score >= 75)
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (score >= 50)
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  if (score >= 25)
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
}

function sameOptResult(a: OptResult, b: OptResult): boolean {
  return (
    Math.abs(a.acc_start_si - b.acc_start_si) < 1e-6 &&
    Math.abs(a.v_p1 - b.v_p1) < 1e-6
  );
}

export default function OptimizationPage() {
  const tGuide = useTranslations('Guide.optimizationGuidePage');
  const [isRunning, setIsRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [results, setResults] = useState<OptResult[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('optimization-results');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });
  const [best, setBest] = useState<OptResult | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('optimization-best');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return null;
  });
  const [completed, setCompleted] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('optimization-completed')) || 0;
    }
    return 0;
  });
  const [total, setTotal] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('optimization-total')) || 20;
    }
    return 20;
  });
  const [activeTab, setActiveTab] = useState<string>('winners');
  const { saveFormData, loadFormData } = useFormPersistence();
  const t = useTranslations('Optimization');
  const { isSimulationRunning, isSystemBusy, triggerCooldown } =
    useSystemStatus();

  type OptimizationFormInput = z.input<typeof OptimizationFormSchema>;
  type OptimizationFormOutput = z.output<typeof OptimizationFormSchema>;

  const constantForm = useForm<OptimizationFormInput, undefined, OptimizationFormOutput>({
    resolver: zodResolver(OptimizationFormSchema),
    defaultValues: {
      accelMin: 0.6,
      accelMax: 1.2,
      weakeningMin: 35,
      weakeningMax: 70,
      maxTravelTime: undefined,
      maxPeakPower: undefined,
      maxEnergy: undefined,
    },
  });

  // Restore persisted fuzzy range values on mount
  useEffect(() => {
    const saved = loadFormData('optimization-params');
    if (saved) {
      constantForm.reset(saved as z.infer<typeof OptimizationFormSchema>);
    }

    // Restore active tab
    const savedTab = localStorage.getItem('optimization-active-tab');
    if (savedTab) {
      setActiveTab(savedTab);
    }

    // Set hasStarted if we restored results
    if (results.length > 0) {
      setHasStarted(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist results to localStorage whenever they change
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem('optimization-results', JSON.stringify(results));
      localStorage.setItem('optimization-completed', String(completed));
      localStorage.setItem('optimization-total', String(total));
    }
    if (best) {
      localStorage.setItem('optimization-best', JSON.stringify(best));
    }
  }, [results, best, completed, total]);

  // Persist whenever the user edits a value
  useEffect(() => {
    const subscription = constantForm.watch((data) => {
      saveFormData('optimization-params', data as Record<string, unknown>);
    });
    return () => subscription.unsubscribe();
  }, [constantForm, saveFormData]);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };
  const startPolling = () => {
    stopPolling();
    let inFlight = false;
    pollingRef.current = setInterval(async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const status = await api.getOptimizationStatus();
        setIsRunning(status.isRunning);
        setResults(status.results);
        setCompleted(status.completedCombinations);
        setTotal(status.totalCombinations);

        const hasBest =
          status.best &&
          typeof status.best === 'object' &&
          'fuzzyScore' in status.best;
        setBest(hasBest ? (status.best as OptResult) : null);

        if (!status.isRunning) {
          stopPolling();
          if (status.completedCombinations > 0) {
            toast.success(
              t('toast.complete', {
                count: String(status.completedCombinations),
              }),
            );
          } else {
            toast.error(t('toast.failed'));
            setIsRunning(false);
            setHasStarted(false);
          }
        }
      } catch (error) {
        console.error('Polling error', error);
        stopPolling();
        setIsRunning(false);
        toast.error(t('toast.pollingFailed'));
      } finally {
        inFlight = false;
      }
    }, 1500);
  };

  // On mount: restore previous results from backend (survives page navigation).
  // Backend OptimizationHandler keeps m_results in memory as long as the
  // Qt process is alive, so switching pages and coming back restores state.
  useEffect(() => {
    api
      .getOptimizationStatus()
      .then((status) => {
        if (status.completedCombinations > 0 || status.isRunning) {
          setResults(status.results);
          setCompleted(status.completedCombinations);
          setTotal(status.totalCombinations);
          setHasStarted(true);
          setIsRunning(status.isRunning);
          const hasBest =
            status.best &&
            typeof status.best === 'object' &&
            'fuzzyScore' in status.best;
          setBest(hasBest ? (status.best as OptResult) : null);
          if (status.isRunning) startPolling();
        }
      })
      .catch(() => {
        /* backend not ready yet — ignore */
      });
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = async () => {
    if (isRunning || isStarting || isSystemBusy) return;
    setIsStarting(true);
    triggerCooldown();
    try {
      setResults([]);
      setBest(null);
      setCompleted(0);
      setHasStarted(true);
      const vals = constantForm.getValues();
      const nAcc = Math.round((vals.accelMax - vals.accelMin) / 0.05) + 1;
      const nVp1 = Math.round((vals.weakeningMax - vals.weakeningMin) / 5) + 1;
      await api.startOptimization(vals);
      toast.success(t('toast.started', { combinations: String(nAcc * nVp1) }));
      setIsRunning(true);
      startPolling();
    } catch (error) {
      console.error(error);
      if (error instanceof ApiError && error.busy) {
        toast.error(t('toast.busyTitle'), {
          description: t('toast.busyDescription'),
        });
      } else {
        toast.error(
          error instanceof Error ? error.message : t('toast.startFailed'),
        );
      }
      setIsRunning(false);
      setHasStarted(false);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSave: SubmitHandler<OptimizationFormOutput> = (values) => {
    saveFormData('optimization-params', values as Record<string, unknown>);
    toast.success(t('toast.saved'));
  };

  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const passedResults = results.filter((r) => r.isPassed);
  const hasPassed = passedResults.length > 0;
  const displayResults = hasPassed ? passedResults : results;

  const guideSteps =
    results.length > 0
      ? [
          {
            element: '#opt-tabs',
            title: tGuide('tabsTitle'),
            description: tGuide('tabsDesc'),
          },
          {
            element: '#opt-top-bottom',
            title: tGuide('topBottomTitle'),
            description: tGuide('topBottomDesc'),
          },
          {
            element: '#opt-extremes',
            title: tGuide('extremesTitle'),
            description: tGuide('extremesDesc'),
          },
          {
            element: '#opt-metric-time',
            title: tGuide('metricTimeTitle'),
            description: tGuide('metricTimeDesc'),
          },
          {
            element: '#opt-metric-power',
            title: tGuide('metricPowerTitle'),
            description: tGuide('metricPowerDesc'),
          },
          {
            element: '#opt-metric-energy',
            title: tGuide('metricEnergyTitle'),
            description: tGuide('metricEnergyDesc'),
          },
          {
            element: '[value="fuzzy-membership-chart"]',
            title: tGuide('fuzzyTabTitle'),
            description: tGuide('fuzzyTabDesc'),
            onHighlightStarted: () => {
              setActiveTab('fuzzy-membership-chart');
            },
          },
          {
            element: '#opt-fuzzy-time',
            title: tGuide('fuzzyTimeTitle'),
            description: tGuide('fuzzyTimeDesc'),
          },
          {
            element: '#opt-fuzzy-power',
            title: tGuide('fuzzyPowerTitle'),
            description: tGuide('fuzzyPowerDesc'),
          },
          {
            element: '#opt-fuzzy-energy',
            title: tGuide('fuzzyEnergyTitle'),
            description: tGuide('fuzzyEnergyDesc'),
          },
          {
            element: '#opt-fuzzy-score',
            title: tGuide('fuzzyScoreTitle'),
            description: tGuide('fuzzyScoreDesc'),
          },
          {
            element: '#opt-save-btn',
            title: tGuide('exportCsvTitle'),
            description: tGuide('exportCsvDesc'),
            onHighlightStarted: () => {
              setActiveTab('winners');
            },
          },
        ]
      : [
          {
            element: '#opt-search-space',
            title: tGuide('searchSpaceTitle'),
            description: tGuide('searchSpaceDesc'),
          },
          {
            element: '#opt-start-btn',
            title: tGuide('startTitle'),
            description: tGuide('startDesc'),
          },
        ];

  return (
    <PageLayout guideSteps={guideSteps}>
      <div className='flex flex-col w-full h-full self-start p-6 gap-4'>
        {/* Header */}
        <div className='flex justify-between w-full'>
          <div className='w-full'>
            <div className='flex flex-row justify-between w-full'>
              <div className='flex flex-col'>
                <p className='heading-2 tracking-tight'>{t('title')}</p>
                <p className='text-muted-foreground mt-1'>{t('description')}</p>
              </div>
              <div className='flex gap-2'>
                <Button
                  id='opt-start-btn'
                  onClick={handleStart}
                  disabled={isRunning || isStarting || isSystemBusy}
                  className='bg-primary disabled:opacity-60'>
                  {isRunning ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
                      {t('running')}
                    </>
                  ) : (
                    <>
                      <Play className='mr-2 h-4 w-4' /> {t('startOptimization')}
                    </>
                  )}
                </Button>
                <Button
                  id='opt-save-btn'
                  variant='outline'
                  disabled={results.length === 0}
                  onClick={() =>
                    exportTableToCsv(
                      displayResults,
                      [
                        { key: 'acc_start_si', header: 'acc_start_si (m/s²)' },
                        { key: 'v_p1', header: 'v_p1 (km/h)' },
                        {
                          key: 'peakMotorPower',
                          header: 'Peak Power/Motor (kW)',
                        },
                        { key: 'travelTime', header: 'Travel Time (s)' },
                        {
                          key: 'energyConsumption',
                          header: 'Energy Consumption (kWh)',
                        },
                        { key: 'fuzzyScore', header: 'Fuzzy Score' },
                      ],
                      'optimization-results.csv',
                      t('toast.exportSuccess'),
                    )
                  }>
                  <Download className='mr-2 h-4 w-4' /> {t('saveResultsCsv')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 1: Compact Sticky Header (Takes 0 height in flow, sticks to top) */}
        <div className='w-full sticky top-16 z-30 h-0 overflow-visible'>
          <div className='flex gap-4 w-full px-4 my-4 py-3 bg-card/95 border border-primary/20 shadow-lg rounded-xl backdrop-blur supports-[backdrop-filter]:bg-card/80 items-center justify-between'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-row items-center gap-4 text-sm'>
                <div className='flex items-center gap-4'>
                  <span className='body-small-bold text-foreground'>
                    {t('acceleration')}:
                  </span>
                  <div className='flex items-center gap-2'>
                    <Input
                      type='number'
                      step='0.05'
                      className='font-mono text-xs'
                      {...constantForm.register('accelMin', {
                        valueAsNumber: true,
                      })}
                    />
                    <span className='text-muted-foreground font-bold'>-</span>
                    <Input
                      type='number'
                      step='0.05'
                      className='font-mono text-xs'
                      {...constantForm.register('accelMax', {
                        valueAsNumber: true,
                      })}
                    />
                    <span className='text-muted-foreground text-xs font-mono'>
                      m/s²
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='body-small-bold text-foreground'>
                    {t('weakeningPoint')}:
                  </span>
                  <div className='flex items-center gap-2'>
                    <Input
                      type='number'
                      step='5'
                      className='font-mono text-xs'
                      {...constantForm.register('weakeningMin', {
                        valueAsNumber: true,
                      })}
                    />
                    <span className='text-muted-foreground font-bold'>-</span>
                    <Input
                      type='number'
                      step='5'
                      className=' font-mono text-xs'
                      {...constantForm.register('weakeningMax', {
                        valueAsNumber: true,
                      })}
                    />
                    <span className='text-muted-foreground text-xs font-mono'>
                      km/h
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <span className='subtitle-medium-bold text-foreground'>
                  {t('constraintsShort')}
                </span>
                <div className='flex items-center gap-4'>
                  <Input
                    type='number'
                    step='1'
                    placeholder='Time (s)'
                    className='font-mono text-xs'
                    {...constantForm.register('maxTravelTime', {
                      setValueAs: (v) =>
                        v === '' || isNaN(Number(v)) ? undefined : Number(v),
                    })}
                  />
                  <Input
                    type='number'
                    step='1'
                    placeholder='Power (kW)'
                    className='font-mono text-xs'
                    {...constantForm.register('maxPeakPower', {
                      setValueAs: (v) =>
                        v === '' || isNaN(Number(v)) ? undefined : Number(v),
                    })}
                  />
                  <Input
                    type='number'
                    step='0.1'
                    placeholder='Energy (kWh)'
                    className='font-mono text-xs'
                    {...constantForm.register('maxEnergy', {
                      setValueAs: (v) =>
                        v === '' || isNaN(Number(v)) ? undefined : Number(v),
                    })}
                  />
                  <div className='flex gap-2 self-end'>
                    <Button
                      onClick={constantForm.handleSubmit(handleSave)}
                      disabled={isRunning || isStarting || isSystemBusy}
                      size='sm'
                      variant='secondary'
                      className='shadow-sm'>
                      {t('save')}
                    </Button>
                    <Button
                      onClick={handleStart}
                      disabled={isRunning || isStarting || isSystemBusy}
                      size='sm'
                      className='bg-primary shadow-md'>
                      {isRunning ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
                          {t('running')}
                        </>
                      ) : (
                        <>
                          <Play className='mr-2 h-4 w-4' />{' '}
                          {t('startOptimization')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 2: Full Card */}
        <div className='w-full relative z-40 bg-background pb-4'>
          <Card
            id='opt-search-space'
            className='w-full shadow-lg border-2 border-primary/10 bg-card'>
            <CardHeader>
              <p className='heading-3'>{t('searchSpaceTitle')}</p>
              <p className='text-muted-foreground'>
                {t('searchSpaceDescription')}
              </p>
            </CardHeader>
            <CardContent className='space-y-6'>
              <Form {...constantForm}>
                <form onSubmit={constantForm.handleSubmit(handleSave)}>
                  {/* Acceleration */}
                  <div className='space-y-2'>
                    <p className='body-small-bold'>{t('acceleration')}</p>
                    <div className='grid grid-cols-2 gap-4'>
                      {accelerationFormDatas.map((formData) => (
                        <InputWidget
                          key={formData.name}
                          inputType={formData}
                          control={constantForm.control}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Weakening */}
                  <div className='space-y-2'>
                    <p className='body-small-bold'>{t('weakeningPoint')}</p>
                    <div className='grid grid-cols-2 gap-4'>
                      {weakeningFormDatas.map((formData) => (
                        <InputWidget
                          key={formData.name}
                          inputType={formData}
                          control={constantForm.control}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Constraints */}
                  <div className='space-y-2 pt-4'>
                    <p className='body-small-bold'>
                      {t('constraintsOptional')}
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      {constraintFormDatas.map((formData) => (
                        <InputWidget
                          key={formData.name}
                          inputType={formData}
                          control={constantForm.control}
                        />
                      ))}
                    </div>
                  </div>

                  <div className='flex justify-end pt-4'>
                    <Button
                      type='submit'
                      disabled={isRunning || isStarting}
                      variant={'secondary'}>
                      {isRunning ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
                          {t('running')}
                        </>
                      ) : (
                        t('save')
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Progress bar */}
        {hasStarted && (
          <div className='space-y-1'>
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>{t('progress')}</span>
              <span>
                {completed} / {total} {t('combinations')}
              </span>
            </div>
            <div
              className='w-full bg-secondary rounded-full h-2'
              role='progressbar'
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={completed}
              aria-label='Optimization progress'>
              <div
                className='bg-primary h-2 rounded-full transition-all duration-500'
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Warning if no combination passed */}
        {best && results.length > 0 && !best.isPassed && (
          <div className='bg-destructive/15 border-l-4 border-destructive p-4 my-4 rounded-md flex items-start gap-3'>
            <TriangleAlert className='h-5 w-5 text-destructive mt-0.5 shrink-0' />
            <div className='flex flex-col'>
              <p className='text-destructive body-small-bold'>
                {t('noWinnerFound')}
              </p>
              <p className='text-destructive/90 text-sm mt-1'>
                {t('constraintsWarning')}
              </p>
            </div>
          </div>
        )}

        {/* Optimization Results Tabs */}
        {best && results.length > 0 && (
          <Tabs
            id='opt-tabs'
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              localStorage.setItem('optimization-active-tab', val);
            }}
            className='w-full mt-4 relative'>
            <TabsList className='grid w-full grid-cols-2 sticky z-30 top-52 bg-primary-100 dark:bg-secondary-500'>
              <TabsTrigger value='winners'>
                {t('bestCombinationTab')}
              </TabsTrigger>
              <TabsTrigger value='fuzzy-membership-chart'>
                {t('fuzzyMembershipTab')}
              </TabsTrigger>
            </TabsList>
            <div className='relative w-full'>
              <TabsContent
                value='winners'
                forceMount
                className='data-[state=inactive]:absolute data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none data-[state=inactive]:z-[-1] w-full top-0 left-0 mt-0'>
                {best.isPassed && <WinnerTab best={best} t={t} />}

                {/* Top 5 and Bottom 5 + Metric Extremes inside Best Combination tab */}
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4'>
                  {/* Top 5 and Bottom 5 */}
                  <Card id='opt-top-bottom'>
                    <CardHeader>
                      <CardTitle>{t('topAndBottom5')}</CardTitle>
                    </CardHeader>
                    <CardContent className='overflow-x-auto'>
                      <table className='w-full text-sm'>
                        <thead>
                          <tr className='border-b text-muted-foreground'>
                            <th className='text-left py-2 body-small-bold'>
                              {t('rank')}
                            </th>
                            <th className='text-right py-2 pr-2 body-small-bold'>
                              acc (m/s²)
                            </th>
                            <th className='text-right py-2 pr-2 body-small-bold'>
                              v_p1 (km/h)
                            </th>
                            <th className='text-right py-2 body-small-bold'>
                              {t('grade')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const sorted = [...displayResults].sort(
                              (a, b) => b.fuzzyScore - a.fuzzyScore,
                            );
                            const top5 = sorted.slice(0, 5);
                            const bottom5 = sorted.slice(-5).reverse();

                            return (
                              <>
                                <tr>
                                  <td
                                    colSpan={4}
                                    className={`py-2 body-small-bold ${
                                      hasPassed
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-blue-600 dark:text-blue-400'
                                    }`}>
                                    {hasPassed ? 'Top 5 (Passed)' : 'Top 5 (Overall)'}
                                  </td>
                                </tr>
                                {top5.map((r, i) => (
                                  <tr
                                    key={`top-${i}`}
                                    className={`border-b hover:bg-muted/30 ${
                                      !r.isPassed ? 'opacity-60' : ''
                                    }`}>
                                    <td className='py-1'>
                                      #{i + 1}{' '}
                                      {!r.isPassed && (
                                        <span className='text-destructive ml-1 text-[10px]'>
                                          {t('failedResult')}
                                        </span>
                                      )}
                                    </td>
                                    <td className='text-right py-1 pr-2 font-mono'>
                                      {r.acc_start_si.toFixed(2)}
                                    </td>
                                    <td className='text-right py-1 pr-2 font-mono'>
                                      {r.v_p1.toFixed(1)}
                                    </td>
                                    <td className='text-right py-1'>
                                      <span
                                        className={`subtitle-medium-bold px-2 py-0.5 rounded-full ${scoreBadgeClass(
                                          r.fuzzyScore,
                                        )}`}>
                                        {scoreLabel(r.fuzzyScore, t)}
                                      </span>
                                    </td>
                                  </tr>
                                ))}

                                <tr>
                                  <td
                                    colSpan={4}
                                    className='py-2 pt-4 body-small-bold text-red-600 dark:text-red-400'>
                                    {t('worst5')}
                                  </td>
                                </tr>
                                {bottom5.map((r, i) => (
                                  <tr
                                    key={`bottom-${i}`}
                                    className={`border-b hover:bg-muted/30 ${
                                      !r.isPassed ? 'opacity-60' : ''
                                    }`}>
                                    <td className='py-1'>
                                      #{displayResults.length - i}{' '}
                                      {!r.isPassed && (
                                        <span className='text-destructive ml-1 text-[10px]'>
                                          {t('failedResult')}
                                        </span>
                                      )}
                                    </td>
                                    <td className='text-right py-1 pr-2 font-mono'>
                                      {r.acc_start_si.toFixed(2)}
                                    </td>
                                    <td className='text-right py-1 pr-2 font-mono'>
                                      {r.v_p1.toFixed(1)}
                                    </td>
                                    <td className='text-right py-1'>
                                      <span
                                        className={`subtitle-medium-bold px-2 py-0.5 rounded-full ${scoreBadgeClass(
                                          r.fuzzyScore,
                                        )}`}>
                                        {scoreLabel(r.fuzzyScore, t)}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>

                  {/* Individual Extremes */}
                  <Card id='opt-extremes'>
                    <CardHeader>
                      <CardTitle>{t('metricExtremes')}</CardTitle>
                    </CardHeader>
                    <CardContent className='overflow-x-auto'>
                      <table className='w-full text-sm'>
                        <thead>
                          <tr className='border-b text-muted-foreground'>
                            <th className='text-left py-2 body-small-bold'>
                              {t('metric')}
                            </th>
                            <th className='text-right py-2 pr-4 body-small-bold'>
                              {t('highestLongest')}
                            </th>
                            <th className='text-right py-2 body-small-bold'>
                              {t('lowestShortest')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const maxTime = [...displayResults].reduce(
                              (max, r) =>
                                r.travelTime > max.travelTime ? r : max,
                              displayResults[0],
                            );
                            const minTime = [...displayResults].reduce(
                              (min, r) =>
                                r.travelTime < min.travelTime ? r : min,
                              displayResults[0],
                            );
                            const maxPower = [...displayResults].reduce(
                              (max, r) =>
                                r.peakMotorPower > max.peakMotorPower ? r : max,
                              displayResults[0],
                            );
                            const minPower = [...displayResults].reduce(
                              (min, r) =>
                                r.peakMotorPower < min.peakMotorPower ? r : min,
                              displayResults[0],
                            );
                            const maxEnergy = [...displayResults].reduce(
                              (max, r) =>
                                r.energyConsumption > max.energyConsumption
                                  ? r
                                  : max,
                              displayResults[0],
                            );
                            const minEnergy = [...displayResults].reduce(
                              (min, r) =>
                                r.energyConsumption < min.energyConsumption
                                  ? r
                                  : min,
                              displayResults[0],
                            );
                            return (
                              <>
                                <tr
                                  id='opt-metric-time'
                                  className='border-b hover:bg-muted/30'>
                                  <td className='py-3 font-medium'>
                                    {t('travelTimeS')}
                                  </td>
                                  <td className='text-right py-3 pr-4'>
                                    <div className='font-mono font-bold text-red-500'>
                                      {maxTime.travelTime.toFixed(0)}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                      ({maxTime.acc_start_si.toFixed(2)},{' '}
                                      {maxTime.v_p1.toFixed(1)})
                                    </div>
                                  </td>
                                  <td className='text-right py-3'>
                                    <div className='font-mono font-bold text-green-500'>
                                      {minTime.travelTime.toFixed(0)}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                      ({minTime.acc_start_si.toFixed(2)},{' '}
                                      {minTime.v_p1.toFixed(1)})
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  id='opt-metric-power'
                                  className='border-b hover:bg-muted/30'>
                                  <td className='py-3 font-medium'>
                                    {t('peakMotorPowerKw')}
                                  </td>
                                  <td className='text-right py-3 pr-4'>
                                    <div className='font-mono font-bold text-red-500'>
                                      {maxPower.peakMotorPower.toFixed(1)}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                      ({maxPower.acc_start_si.toFixed(2)},{' '}
                                      {maxPower.v_p1.toFixed(1)})
                                    </div>
                                  </td>
                                  <td className='text-right py-3'>
                                    <div className='font-mono font-bold text-green-500'>
                                      {minPower.peakMotorPower.toFixed(1)}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                      ({minPower.acc_start_si.toFixed(2)},{' '}
                                      {minPower.v_p1.toFixed(1)})
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  id='opt-metric-energy'
                                  className='border-b hover:bg-muted/30'>
                                  <td className='py-3 font-medium'>
                                    {t('energyConsumptionKwh')}
                                  </td>
                                  <td className='text-right py-3 pr-4'>
                                    <div className='font-mono font-bold text-red-500'>
                                      {maxEnergy.energyConsumption.toFixed(2)}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                      ({maxEnergy.acc_start_si.toFixed(2)},{' '}
                                      {maxEnergy.v_p1.toFixed(1)})
                                    </div>
                                  </td>
                                  <td className='text-right py-3'>
                                    <div className='font-mono font-bold text-green-500'>
                                      {minEnergy.energyConsumption.toFixed(2)}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                      ({minEnergy.acc_start_si.toFixed(2)},{' '}
                                      {minEnergy.v_p1.toFixed(1)})
                                    </div>
                                  </td>
                                </tr>
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent
                value='fuzzy-membership-chart'
                forceMount
                className='data-[state=inactive]:absolute data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none data-[state=inactive]:z-[-1] w-full top-0 left-0 mt-0'>
                {best.isPassed ? (
                  <FuzzyMemberTab results={results} best={best} />
                ) : (
                  <Card className='border-dashed mt-4'>
                    <CardContent className='flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground'>
                      <TriangleAlert className='h-12 w-12 opacity-30' />
                      <p className='body-big-bold'>
                        No valid winner to analyze
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {t('allCombinations')} ({displayResults.length} / {total})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className='w-full text-sm relative'>
                <thead className='sticky z-30 bg-secondary/95 backdrop-blur shadow-sm top-52'>
                  <tr className='border-b border-border text-foreground'>
                    <th className='text-left py-3 pl-4 pr-4 body-small-bold rounded-tl-md'>
                      #
                    </th>
                    <th className='text-right py-2 pr-4 body-small-bold'>
                      Acceleration Start (m/s²)
                    </th>
                    <th className='text-right py-2 pr-4 body-small-bold'>
                      Weakening Point 1 (km/h)
                    </th>
                    <th className='text-right py-2 pr-4 body-small-bold'>
                      Peak Power/Motor (kW)
                    </th>
                    <th className='text-right py-2 pr-4 body-small-bold'>
                      Travel Time (s)
                    </th>
                    <th className='text-right py-2 pr-4 body-small-bold'>
                      Energy (kWh)
                    </th>
                    <th className='text-right py-2 body-small-bold'>
                      {t('fuzzyScore')}
                    </th>
                    <th className='text-center py-2 pl-4 body-small-bold'>
                      {t('grade')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {results.map((r, i) => {
                    const isBest =
                      best &&
                      r.acc_start_si === best.acc_start_si &&
                      r.v_p1 === best.v_p1; */}
                  {displayResults.map((r, i) => {
                    const isBest = best && sameOptResult(r, best);
                    return (
                      <tr
                        key={i}
                        className={`border-b transition-colors ${
                          isBest
                            ? 'bg-yellow-50 dark:bg-yellow-950 body-small-bold'
                            : 'hover:bg-muted/30'
                        } ${!r.isPassed ? 'opacity-60' : ''}`}>
                        <td className='py-2 pr-4'>
                          {isBest ? (
                            <span className='flex items-center gap-1'>
                              <Trophy className='h-3 w-3 text-yellow-500' />
                              {i + 1}
                            </span>
                          ) : (
                            <>
                              {i + 1}{' '}
                              {!r.isPassed && (
                                <span className='text-destructive ml-1 text-[10px]'>
                                  {t('failedResult')}
                                </span>
                              )}
                            </>
                          )}
                        </td>
                        <td className='text-right py-2 pr-4 font-mono'>
                          {r.acc_start_si.toFixed(2)}
                        </td>
                        <td className='text-right py-2 pr-4 font-mono'>
                          {r.v_p1.toFixed(1)}
                        </td>
                        <td className='text-right py-2 pr-4 font-mono'>
                          {r.peakMotorPower.toFixed(1)}
                        </td>
                        <td className='text-right py-2 pr-4 font-mono'>
                          {r.travelTime.toFixed(0)}
                        </td>
                        <td className='text-right py-2 pr-4 font-mono'>
                          {r.energyConsumption.toFixed(2)}
                        </td>
                        <td
                          className={`text-right py-2 pr-2 font-mono font-bold ${scoreColor(
                            r.fuzzyScore,
                          )}`}>
                          {r.fuzzyScore.toFixed(2)}
                        </td>
                        <td className='text-center py-2 pl-4'>
                          <span
                            className={`subtitle-medium-bold px-2 py-0.5 rounded-full ${scoreBadgeClass(
                              r.fuzzyScore,
                            )}`}>
                            {scoreLabel(r.fuzzyScore, t)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!hasStarted && (
          <Card className='border-dashed'>
            <CardContent className='flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground'>
              <Activity className='h-12 w-12 opacity-30' />
              <p className='body-big-bold'>{t('noResults')}</p>
              <p className='text-sm'>{t('noResultsDescription')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
