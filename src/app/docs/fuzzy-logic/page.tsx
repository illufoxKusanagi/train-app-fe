'use client';

import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import { DocsPager } from '@/components/docs/pager';
import { useTranslations } from 'next-intl';

export default function FuzzyLogicDocsPage() {
  const t = useTranslations('DocsFuzzy');

  return (
    <PageLayout sidebarDefaultOpen={true}>
      <div className='flex flex-col w-full h-full self-start p-8 md:p-12 gap-8 overflow-y-auto custom-scrollbar max-w-4xl mx-auto'>
        <header className='flex flex-col space-y-4'>
          <p className='heading-1 text-foreground'>
            {t('title')}
          </p>
          <p className='body-big-regular text-muted-foreground'>
            {t('subtitle')}
          </p>
        </header>

        <Separator />

        <article className='prose prose-slate dark:prose-invert max-w-none space-y-10'>

          {/* ── THE CORE PROBLEM ─────────────────────────────────────────── */}
          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('problemTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('problemDesc1')}</p>
            <p className='text-muted-foreground leading-7'>{t('problemDesc2')}</p>
            <div className='bg-muted/30 border rounded-lg p-5 space-y-2 text-sm text-muted-foreground'>
              <p className='body-small-bold text-foreground'>{t('tradeoffTitle')}</p>
              <ul className='list-disc pl-5 space-y-1'>
                <li>{t('tradeoff1')}</li>
                <li>{t('tradeoff2')}</li>
                <li>{t('tradeoff3')}</li>
              </ul>
            </div>
          </section>

          {/* ── HOW THE OPTIMIZER WORKS ──────────────────────────────────── */}
          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('howTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('howDesc')}</p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-muted/30 border rounded-lg p-5 space-y-2'>
                <p className='font-bold text-foreground'>{t('pass1Title')}</p>
                <p className='text-sm text-muted-foreground leading-6'>{t('pass1Desc')}</p>
              </div>
              <div className='bg-muted/30 border rounded-lg p-5 space-y-2'>
                <p className='font-bold text-foreground'>{t('pass2Title')}</p>
                <p className='text-sm text-muted-foreground leading-6'>{t('pass2Desc')}</p>
              </div>
            </div>
            <p className='text-muted-foreground leading-7 text-sm italic'>{t('howNote')}</p>
          </section>

          {/* ── STEP 1: FUZZIFICATION ────────────────────────────────────── */}
          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('fuzzTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('fuzzDesc1')}</p>
            <p className='text-muted-foreground leading-7'>{t('fuzzDesc2')}</p>

            {/* Membership function shapes */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-muted/30 border rounded-lg p-5 space-y-2'>
                <p className='body-small-bold text-foreground'>{t('trapezoidTitle')}</p>
                <p className='text-sm text-muted-foreground leading-6'>{t('trapezoidDesc')}</p>
              </div>
              <div className='bg-muted/30 border rounded-lg p-5 space-y-2'>
                <p className='body-small-bold text-foreground'>{t('triangleTitle')}</p>
                <p className='text-sm text-muted-foreground leading-6'>{t('triangleDesc')}</p>
              </div>
            </div>

            {/* Membership boundaries table */}
            <div className='overflow-x-auto my-4'>
              <p className='body-small-bold text-foreground mb-3'>{t('membershipBoundsTitle')}</p>
              <table className='w-full text-sm text-left border-collapse'>
                <thead className='bg-muted/50 text-foreground'>
                  <tr>
                    <th className='p-3 border'>{t('colTerm')}</th>
                    <th className='p-3 border'>{t('colShape')}</th>
                    <th className='p-3 border'>{t('colBounds')}</th>
                  </tr>
                </thead>
                <tbody className='divide-y border'>
                  <tr className='hover:bg-muted/30'>
                    <td className='p-3 border-r body-small-bold text-emerald-600 dark:text-emerald-400'>Short / Low</td>
                    <td className='p-3 border-r text-muted-foreground'>{t('shapeTrapezoid')}</td>
                    <td className='p-3 font-mono text-xs text-muted-foreground'>(min, min, min+0.25r, min+0.45r)</td>
                  </tr>
                  <tr className='hover:bg-muted/30'>
                    <td className='p-3 border-r body-small-bold text-amber-600 dark:text-amber-400'>Medium</td>
                    <td className='p-3 border-r text-muted-foreground'>{t('shapeTriangle')}</td>
                    <td className='p-3 font-mono text-xs text-muted-foreground'>(min+0.30r, min+0.50r, min+0.70r)</td>
                  </tr>
                  <tr className='hover:bg-muted/30'>
                    <td className='p-3 border-r body-small-bold text-rose-600 dark:text-rose-400'>Long / High</td>
                    <td className='p-3 border-r text-muted-foreground'>{t('shapeTrapezoid')}</td>
                    <td className='p-3 font-mono text-xs text-muted-foreground'>(min+0.55r, min+0.75r, max, max)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className='text-sm text-muted-foreground leading-6 italic'>{t('fuzzOverlapNote')}</p>
          </section>

          {/* ── STEP 2: THREE INDEPENDENT ENGINES ───────────────────────── */}
          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('enginesTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('enginesDesc')}</p>

            <div className='space-y-3'>
              {[
                { key: 'engineTime', color: 'border-blue-500' },
                { key: 'enginePower', color: 'border-amber-500' },
                { key: 'engineEnergy', color: 'border-emerald-500' },
              ].map(({ key, color }) => (
                <div key={key} className={`border-l-4 ${color} pl-4 py-2 space-y-1`}>
                  <p className='body-small-bold text-foreground'>{t(`${key}Title` as Parameters<typeof t>[0])}</p>
                  <p className='text-sm text-muted-foreground leading-6'>{t(`${key}Desc` as Parameters<typeof t>[0])}</p>
                </div>
              ))}
            </div>

            {/* Rules table */}
            <div className='overflow-x-auto mt-4'>
              <p className='body-small-bold text-foreground mb-3'>{t('rulesTitle')}</p>
              <table className='w-full text-sm text-left border-collapse'>
                <thead className='bg-muted/50 text-foreground'>
                  <tr>
                    <th className='p-3 border'>{t('colInput')}</th>
                    <th className='p-3 border'>{t('colInputTerm')}</th>
                    <th className='p-3 border text-primary'>{t('colOutput')}</th>
                  </tr>
                </thead>
                <tbody className='divide-y border text-muted-foreground'>
                  {[
                    { input: t('labelTime'), term: 'Short', termColor: 'text-emerald-600 dark:text-emerald-400', output: 'Excellent', outputColor: 'text-emerald-600 dark:text-emerald-400' },
                    { input: t('labelTime'), term: 'Medium', termColor: 'text-amber-600 dark:text-amber-400', output: 'Good', outputColor: 'text-blue-600 dark:text-blue-400' },
                    { input: t('labelTime'), term: 'Long', termColor: 'text-rose-600 dark:text-rose-400', output: 'Poor', outputColor: 'text-rose-600 dark:text-rose-400' },
                    { input: t('labelPower'), term: 'Low', termColor: 'text-emerald-600 dark:text-emerald-400', output: 'Excellent', outputColor: 'text-emerald-600 dark:text-emerald-400' },
                    { input: t('labelPower'), term: 'Medium', termColor: 'text-amber-600 dark:text-amber-400', output: 'Good', outputColor: 'text-blue-600 dark:text-blue-400' },
                    { input: t('labelPower'), term: 'High', termColor: 'text-rose-600 dark:text-rose-400', output: 'Poor', outputColor: 'text-rose-600 dark:text-rose-400' },
                    { input: t('labelEnergy'), term: 'Low', termColor: 'text-emerald-600 dark:text-emerald-400', output: 'Excellent', outputColor: 'text-emerald-600 dark:text-emerald-400' },
                    { input: t('labelEnergy'), term: 'Medium', termColor: 'text-amber-600 dark:text-amber-400', output: 'Good', outputColor: 'text-blue-600 dark:text-blue-400' },
                    { input: t('labelEnergy'), term: 'High', termColor: 'text-rose-600 dark:text-rose-400', output: 'Poor', outputColor: 'text-rose-600 dark:text-rose-400' },
                  ].map((row, i) => (
                    <tr key={i} className='hover:bg-muted/30'>
                      <td className='p-3 border-r font-medium'>{row.input}</td>
                      <td className={`p-3 border-r ${row.termColor}`}>{row.term}</td>
                      <td className={`p-3 font-bold ${row.outputColor}`}>{row.output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── STEP 3: INFERENCE (MIN-AND) ──────────────────────────────── */}
          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('inferenceTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('inferenceDesc1')}</p>
            <p className='text-muted-foreground leading-7'>{t('inferenceDesc2')}</p>
            <div className='bg-muted/40 border border-primary/20 rounded-lg p-5'>
              <p className='text-sm font-mono text-foreground'>α = min(μ(x₁), μ(x₂), …)</p>
              <p className='text-xs text-muted-foreground mt-2'>{t('inferenceFormula')}</p>
            </div>
          </section>

          {/* ── STEP 4: AGGREGATION (MAX) ────────────────────────────────── */}
          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('aggTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('aggDesc')}</p>
          </section>

          {/* ── STEP 5: DEFUZZIFICATION (CENTROID) ──────────────────────── */}
          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('defuzzTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('defuzzDesc1')}</p>
            <div className='bg-muted/40 border border-primary/20 rounded-lg p-5 flex flex-col items-center gap-2'>
              <code className='text-lg font-mono text-foreground'>y* = Σ(xᵢ · μ(xᵢ)) / Σ(μ(xᵢ))</code>
              <span className='text-xs text-muted-foreground'>{t('defuzzFormula')}</span>
            </div>
            <p className='text-muted-foreground leading-7'>{t('defuzzDesc2')}</p>

            {/* Output score table */}
            <div className='overflow-x-auto mt-2'>
              <p className='body-small-bold text-foreground mb-3'>{t('outputRangeTitle')}</p>
              <table className='w-full text-sm text-left border-collapse'>
                <thead className='bg-muted/50 text-foreground'>
                  <tr>
                    <th className='p-3 border'>{t('colScore')}</th>
                    <th className='p-3 border'>{t('colLabel')}</th>
                    <th className='p-3 border'>{t('colMeaning')}</th>
                  </tr>
                </thead>
                <tbody className='divide-y border text-muted-foreground'>
                  <tr className='hover:bg-muted/30'>
                    <td className='p-3 border-r font-mono'>≥ 75</td>
                    <td className='p-3 border-r font-bold text-emerald-600 dark:text-emerald-400'>Excellent</td>
                    <td className='p-3'>{t('scoreExcellent')}</td>
                  </tr>
                  <tr className='hover:bg-muted/30'>
                    <td className='p-3 border-r font-mono'>≥ 50</td>
                    <td className='p-3 border-r font-bold text-blue-600 dark:text-blue-400'>Good</td>
                    <td className='p-3'>{t('scoreGood')}</td>
                  </tr>
                  <tr className='hover:bg-muted/30'>
                    <td className='p-3 border-r font-mono'>≥ 25</td>
                    <td className='p-3 border-r font-bold text-amber-600 dark:text-amber-400'>Fair</td>
                    <td className='p-3'>{t('scoreFair')}</td>
                  </tr>
                  <tr className='hover:bg-muted/30'>
                    <td className='p-3 border-r font-mono'>&lt; 25</td>
                    <td className='p-3 border-r font-bold text-rose-600 dark:text-rose-400'>Poor</td>
                    <td className='p-3'>{t('scorePoor')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── FINAL SCORE ──────────────────────────────────────────────── */}
          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('finalScoreTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('finalScoreDesc')}</p>
            <div className='bg-muted/40 border border-primary/20 rounded-lg p-5 flex flex-col items-center gap-2'>
              <code className='text-lg font-mono text-foreground'>
                Optimization Score = (TimeScore + PowerScore + EnergyScore) / 3
              </code>
              <span className='text-xs text-muted-foreground'>{t('finalScoreFormula')}</span>
            </div>
            <p className='text-muted-foreground leading-7'>{t('finalScoreNote')}</p>
          </section>

          <DocsPager />
        </article>
      </div>
    </PageLayout>
  );
}
