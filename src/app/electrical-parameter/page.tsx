'use client';

import { InputWidget } from '@/components/inputs/input-widget';
import PageLayout from '@/components/page-layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ElectricalParams } from '@/types/input-params';
import z from 'zod';
import { constantFormRows, ElectricalFormSchema } from './form.constants';
import { Form } from '@/components/ui/form';
import { api } from '@/services/api';
import { initializeBackendOnce } from '@/lib/backendInit';
import { useFormPersistence } from '@/contexts/FormPersistenceContext';
import { useTranslations } from 'next-intl';
import { csvExportPresetHandler } from '@/lib/csv-handler';
import { FormActionButtons } from '@/components/buttons/form-action-buttons';

export default function ElectricalParameterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvData, setCsvData] = useState<Record<string, number[][]>>({});
  const { saveFormData, loadFormData, clearFormData } = useFormPersistence();

  const trans = useTranslations('ElectricalParams');
  const tCsv = useTranslations('CsvUpload');
  const tGuide = useTranslations('Guide.electricalGuidePage');

  const defaultValues = {
    stat_vol_line: 1500,
    stat_vol_motor: 1200,
    stat_pf: 0,
    stat_eff_gear: 98,
    stat_eff_motor: 89,
    stat_eff_vvvf: 96,
    p_aps: 30,
  };

  const constantForm = useForm<z.infer<typeof ElectricalFormSchema>>({
    resolver: zodResolver(ElectricalFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const savedData = loadFormData('electrical-params');
    const hasSavedData = savedData && Object.keys(savedData).length > 0;
    const loadDefaults = async () => {
      try {
        await initializeBackendOnce();
        if (hasSavedData) {
          constantForm.reset({
            ...defaultValues,
            ...(savedData as z.infer<typeof ElectricalFormSchema>),
          });
          return;
        }
        const data = await api.getElectricalParameters();
        constantForm.reset({
          ...defaultValues,
          ...data.electricalParameters,
        });
      } catch (err) {
        console.error('Failed to load electrical parameters:', err);
        toast.error(trans('uploadCsvFailed'));
        constantForm.reset(defaultValues);
      }
    };
    loadDefaults();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const subscription = constantForm.watch((data) => {
      saveFormData('electrical-params', data as Record<string, unknown>);
    });
    return () => subscription.unsubscribe();
  }, [constantForm, saveFormData]);

  const handleFileLoad = (name: string, data: number[][]) => {
    setCsvData((prev) => ({
      ...prev,
      [name]: data,
    }));
    console.log(`File loaded for ${name}:`, data);
  };

  async function onSubmit(data: z.infer<typeof ElectricalFormSchema>) {
    setIsSubmitting(true);
    try {
      console.log('Form Data:', data);
      console.log('CSV Data:', csvData);

      const electricalParams: ElectricalParams = {
        stat_vol_line: data.stat_vol_line,
        stat_vol_motor: data.stat_vol_motor,
        stat_pf: data.stat_pf,
        stat_eff_gear: data.stat_eff_gear,
        stat_eff_motor: data.stat_eff_motor,
        stat_eff_vvvf: data.stat_eff_vvvf,
        p_aps: data.p_aps,
      };

      // Helper: extract col 0 (speed thresholds) and col 1 (values) from uploaded CSV
      const addCurve = (
        fieldName: string,
        speedKey: keyof ElectricalParams,
        valueKey: keyof ElectricalParams,
      ) => {
        const rows = csvData[fieldName];
        if (rows && rows.length > 0 && rows[0].length >= 2) {
          (electricalParams[speedKey] as number[]) = rows.map((r) => r[0]);
          (electricalParams[valueKey] as number[]) = rows.map((r) => r[1]);
        }
      };

      addCurve('stat_vol_line', 'v_vol_line_array', 'vol_line_array');
      addCurve('stat_vol_motor', 'v_vol_motor_array', 'vol_motor_array');
      addCurve('stat_eff_gear', 'v_eff_gear_array', 'eff_gear_array');
      addCurve('stat_eff_motor', 'v_eff_motor_array', 'eff_motor_array');
      addCurve('stat_eff_vvvf', 'v_eff_vvvf_array', 'eff_vvvf_array');

      const result = await api.updateElectricalParameters(electricalParams);
      console.log('Backend response:', result);
      toast.success(trans('toast.success'), {
        description: trans('toast.successDescription'),
      });
      window.dispatchEvent(new Event('show-topbar-guide'));
    } catch (error) {
      console.error('Error updating parameters:', error);
      toast.error(trans('toast.error'), {
        description: trans('toast.errorDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleReset = () => {
    constantForm.reset(defaultValues);
    clearFormData('electrical-params');
    setCsvData({});
    toast(trans('toast.reset'));
  };

  const processCsvData = (data: Record<string, number>) => {
    const validKeys = Object.keys(ElectricalFormSchema.shape);
    let successCount = 0;
    let errorCount = 0;
    for (const [key, value] of Object.entries(data)) {
      if (validKeys.includes(key)) {
        constantForm.setValue(
          key as keyof z.infer<typeof ElectricalFormSchema>,
          value,
          { shouldDirty: true, shouldValidate: true }
        );
        successCount++;
      } else {
        errorCount++;
      }
    }
    if (successCount > 0)
      toast.success(tCsv('updatedFields', { count: successCount }));
    if (errorCount > 0)
      toast.warning(tCsv('skippedUnrecognised', { count: errorCount }));
  };

  return (
    <PageLayout
      pageId="electrical"
      guideSteps={[
        {
          element: '#page-form',
          title: tGuide('inputFieldsTitle'),
          description: tGuide('inputFieldsDesc'),
        },
        {
          element: '#upload-stat_vol_line_file',
          title: tGuide('inputUploadTitle'),
          description: tGuide('inputUploadDesc'),
        },
        {
          element: '#electrical-save-btn',
          title: tGuide('btnSave'),
          description: tGuide('btnSaveDesc'),
        },
        {
          element: '#electrical-reset-btn',
          title: tGuide('btnReset'),
          description: tGuide('btnResetDesc'),
        },
        {
          element: '#electrical-upload-btn',
          title: tGuide('btnUpload'),
          description: tGuide('btnUploadDesc'),
        },
        {
          element: '#electrical-export-btn',
          title: tGuide('btnExport'),
          description: tGuide('btnExportDesc'),
        },
        {
          element: '#electrical-template-btn',
          title: tGuide('csvTemplateTitle'),
          description: tGuide('csvTemplateDesc'),
        },
      ]}
    >
      <Card className="px-6 py-8 min-h-[40rem] h-fit w-full max-w-2xl rounded-3xl justify-center overflow-auto custom-scrollbar">
        <CardHeader className="text-center" id="page-title">
          <CardTitle className="text-2xl">{trans('title')}</CardTitle>
          <CardDescription>{trans('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...constantForm}>
            <form
              onSubmit={constantForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div id="page-form" className="flex flex-col gap-6">
                {constantFormRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-2 gap-4">
                    {row.map((inputType) => (
                      <InputWidget
                        key={inputType.name}
                        inputType={inputType}
                        control={constantForm.control}
                        onFileLoad={handleFileLoad}
                      />
                    ))}
                    {row.length < 2 &&
                      Array.from({ length: 2 - row.length }).map(
                        (_, emptyIndex) => (
                          <div key={`empty-${rowIndex}-${emptyIndex}`} />
                        )
                      )}
                  </div>
                ))}
              </div>

              <div id="form-actions">
                <FormActionButtons
                  isSubmitting={isSubmitting}
                  onProcessCsvData={processCsvData}
                  onReset={handleReset}
                  onExport={() =>
                    csvExportPresetHandler(
                      constantForm.getValues() as Record<string, unknown>,
                      'electrical-parameters.csv',
                      trans('exportSuccess')
                    )
                  }
                  dialogTitle="Select Electrical Parameters CSV File"
                  idPrefix="electrical"
                  templateHref="/templates/electrical"
                  labels={{
                    save: trans('save'),
                    saving: trans('saving'),
                    uploadCsv: trans('uploadCsv'),
                    uploading: trans('uploading'),
                    reset: trans('reset'),
                    exportCsv: trans('exportCsv'),
                    useTemplate: tGuide('csvTemplateTitle'),
                  }}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
