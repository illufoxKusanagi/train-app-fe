'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  constantFormRows,
  slopeFormRows,
  TrackFormSchema,
} from './form.constants';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { initializeBackendOnce } from '@/lib/backendInit';
import { useFormPersistence } from '@/contexts/FormPersistenceContext';
import PageLayout from '@/components/page-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InputWidget } from '@/components/inputs/input-widget';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { csvExportPresetHandler } from '@/lib/csv-handler';
import { FormActionButtons } from '@/components/buttons/form-action-buttons';

const DEFAULT_TRACK_CSV_DATA: Record<string, number[][]> = {
  x_station: [
    [0.0, 3154.0, 3154.0],
    [3154.0, 6485.0, 3331.0],
    [6485.0, 9540.0, 3055.0],
    [9540.0, 11933.0, 2393.0],
    [11933.0, 13316.0, 1383.0],
    [13316.0, 14662.0, 1346.0],
    [14662.0, 17300.0, 2638.0],
    [17270.0, 19652.0, 2352.0],
    [19652.0, 24860.0, 5208.0],
    [24860.0, 27658.0, 2798.0],
    [27658.0, 32505.0, 4847.0],
    [32505.0, 37678.0, 5173.0],
    [37678.0, 41799.0, 4121.0]
  ],
  v_limit: [
    [0.0, 3154.0, 100.0],
    [3154.0, 6485.0, 100.0],
    [6485.0, 9540.0, 100.0],
    [9540.0, 11933.0, 100.0],
    [11933.0, 13316.0, 15.0],
    [13316.0, 14662.0, 100.0],
    [14662.0, 17300.0, 100.0],
    [17270.0, 19652.0, 100.0],
    [19652.0, 24860.0, 100.0],
    [24860.0, 27658.0, 100.0],
    [27658.0, 32505.0, 100.0],
    [32505.0, 37678.0, 100.0],
    [37678.0, 41799.0, 100.0]
  ],
  slope: [
    [0.0, 3154.0, 10.0],
    [3154.0, 6485.0, 10.0],
    [6485.0, 9540.0, 5.3],
    [9540.0, 11933.0, 5.3],
    [11933.0, 13316.0, 8.4],
    [13316.0, 14662.0, 8.4],
    [14662.0, 17300.0, 10.0],
    [17270.0, 19652.0, 10.0],
    [19652.0, 24860.0, 10.0],
    [24860.0, 27658.0, 10.0],
    [27658.0, 32505.0, 10.0],
    [32505.0, 37678.0, 12.0],
    [37678.0, 41799.0, 12.0]
  ],
  radius: [
    [0.0, 6485.0, 550.0],
    [6485.0, 11933.0, 540.0],
    [11933.0, 14662.0, 890.0],
    [14662.0, 17300.0, 1100.0],
    [17300.0, 19652.0, 3100.0],
    [19652.0, 24860.0, 0.0],
    [24860.0, 37678.0, 2500.0],
    [37678.0, 41799.0, 500.0]
  ],
  dwellTime: [
    [3154.0, 60.0],
    [3331.0, 60.0],
    [3055.0, 60.0],
    [2393.0, 60.0],
    [1383.0, 60.0],
    [1346.0, 60.0],
    [2638.0, 60.0],
    [2352.0, 60.0],
    [5208.0, 60.0],
    [2798.0, 60.0],
    [4847.0, 60.0],
    [5173.0, 60.0],
    [4121.0, 60.0]
  ]
};

export default function TrackParameterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvData, setCsvData] = useState<Record<string, number[][]>>({});
  const { saveFormData, loadFormData, clearFormData } = useFormPersistence();
  const trans = useTranslations('TrackParams');
  const tCsv = useTranslations('CsvUpload');
  const tGuide = useTranslations('Guide.trackGuidePage');

  const defaultValues = {
    n_station: 2,
    x_station: 2000,
    radius: 2000,
    slope: 0,
    v_limit: 80,
    dwellTime: 60,
    slope_option1: 0,
    slope_option2: 5,
    slope_option3: 10,
    slope_option4: 25,
    x_station_file: 'station distance-new.csv',
    radius_file: 'radius-new.csv',
    slope_file: 'slope-new.csv',
    v_limit_file: 'max speed-new.csv',
    dwellTime_file: 'dwell time-new.csv',
  };

  const constantForm = useForm<z.infer<typeof TrackFormSchema>>({
    resolver: zodResolver(TrackFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const savedData = loadFormData('track-params');
    const hasSavedData = savedData && Object.keys(savedData).length > 0;
    const loadDefaults = async () => {
      try {
        await initializeBackendOnce();
        if (hasSavedData) {
          constantForm.reset({
            ...defaultValues,
            ...(savedData as z.infer<typeof TrackFormSchema>),
          });
          return;
        }
        const data = await api.getTrackParameters();
        constantForm.reset({
          ...defaultValues,
          ...data.trackParameters,
        });
      } catch (err) {
        console.error('Failed to load track parameters:', err);
        toast.error(trans('uploadCsvFailed'));
        constantForm.reset(defaultValues);
      }
    };
    loadDefaults();

    // Restore uploaded CSV array data or set default demo data
    const savedCsvData = localStorage.getItem('track-csv-data');
    if (savedCsvData) {
      try {
        setCsvData(JSON.parse(savedCsvData));
      } catch (e) {
        console.error('Failed to restore track CSV data:', e);
        setCsvData(DEFAULT_TRACK_CSV_DATA);
      }
    } else {
      setCsvData(DEFAULT_TRACK_CSV_DATA);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist csvData whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('track-csv-data', JSON.stringify(csvData));
    } catch (e) {
      console.error('Failed to save track CSV data:', e);
    }
  }, [csvData]);

  useEffect(() => {
    const subscription = constantForm.watch((data) => {
      saveFormData('track-params', data as Record<string, unknown>);
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

  async function onSubmit(data: z.infer<typeof TrackFormSchema>) {
    setIsSubmitting(true);
    try {
      console.log('Form Data:', data);
      console.log('CSV Data:', csvData);

      // Send using YOUR exact variable names - NO CONVERSION
      const trackParams: Record<string, number | number[]> = {
        n_station: data.n_station,
        x_station: data.x_station,
        radius: data.radius,
        slope: data.slope,
        v_limit: data.v_limit,
        dwellTime: data.dwellTime,
        slope_option1: data.slope_option1,
        slope_option2: data.slope_option2,
        slope_option3: data.slope_option3,
        slope_option4: data.slope_option4,
      };

      // Add CSV array data if available
      if (csvData.x_station && csvData.x_station.length > 0) {
        // Original logic: Col 2 is x_station (Segment), Col 1 is tot_x_station (Cumulative)
        const stationData = csvData.x_station;
        if (stationData[0].length >= 3) {
          trackParams.x_station_array = stationData.map((row) => row[2]);
          trackParams.tot_x_station_array = stationData.map((row) => row[1]);
        } else {
          // Fallback if user uploads single column (unlikely given new constraint but safe)
          trackParams.x_station_array = csvData.x_station.flat();
        }
      }

      // Handle 3-column CSVs for Speed Limit, Slope, Radius
      // Column 0: Start, Column 1: End, Column 2: Value
      if (csvData.v_limit && csvData.v_limit.length > 0) {
        const v_limitData = csvData.v_limit;
        if (v_limitData[0].length >= 3) {
          trackParams.x_v_limitStart_array = v_limitData.map((row) => row[0]);
          trackParams.x_v_limitEnd_array = v_limitData.map((row) => row[1]);
          trackParams.v_limit_array = v_limitData.map((row) => row[2]);
        } else {
          trackParams.v_limit_array = v_limitData.flat();
        }
      }

      if (csvData.slope && csvData.slope.length > 0) {
        const slopeData = csvData.slope;
        if (slopeData[0].length >= 3) {
          trackParams.x_slopeStart_array = slopeData.map((row) => row[0]);
          trackParams.x_slopeEnd_array = slopeData.map((row) => row[1]);
          trackParams.slope_array = slopeData.map((row) => row[2]);
        } else {
          trackParams.slope_array = slopeData.flat();
        }
      }

      if (csvData.radius && csvData.radius.length > 0) {
        const radiusData = csvData.radius;
        if (radiusData[0].length >= 3) {
          trackParams.x_radiusStart_array = radiusData.map((row) => row[0]);
          trackParams.x_radiusEnd_array = radiusData.map((row) => row[1]);
          trackParams.radius_array = radiusData.map((row) => row[2]);
        } else {
          trackParams.radius_array = radiusData.flat();
        }
      }

      if (csvData.dwellTime && csvData.dwellTime.length > 0) {
        const dwellTimeData = csvData.dwellTime;
        if (dwellTimeData[0].length >= 2) {
          trackParams.dwellTime_array = dwellTimeData.map((row) => row[1]);
        } else {
          trackParams.dwellTime_array = dwellTimeData.flat();
        }
      }

      const result = await api.updateTrackParameters(trackParams);
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
    clearFormData('track-params');
    setCsvData({});
    localStorage.removeItem('track-csv-data');
    toast(trans('toast.reset'));
  };

  const processCsvData = (data: Record<string, number>) => {
    const validKeys = Object.keys(TrackFormSchema.shape).filter(
      (key) => !key.endsWith('_file')
    );
    let successCount = 0;
    let errorCount = 0;
    for (const [key, value] of Object.entries(data)) {
      if (validKeys.includes(key)) {
        constantForm.setValue(
          key as keyof z.infer<typeof TrackFormSchema>,
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
      pageId="track"
      guideSteps={[
        {
          element: '#page-form',
          title: tGuide('inputFieldsTitle'),
          description: tGuide('inputFieldsDesc'),
        },
        {
          element: '#upload-x_station_file',
          title: tGuide('inputUploadTitle'),
          description: tGuide('inputUploadDesc'),
        },
        {
          element: '#track-save-btn',
          title: tGuide('btnSave'),
          description: tGuide('btnSaveDesc'),
        },
        {
          element: '#track-reset-btn',
          title: tGuide('btnReset'),
          description: tGuide('btnResetDesc'),
        },
        {
          element: '#track-upload-btn',
          title: tGuide('btnUpload'),
          description: tGuide('btnUploadDesc'),
        },
        {
          element: '#track-export-btn',
          title: tGuide('btnExport'),
          description: tGuide('btnExportDesc'),
        },
        {
          element: '#track-template-btn',
          title: tGuide('csvTemplateTitle'),
          description: tGuide('csvTemplateDesc'),
        },
        {
          element: '#slope-options-container',
          title: tGuide('slopeOptionsTitle'),
          description: tGuide('slopeOptionsDesc'),
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
                      'track-parameters.csv',
                      trans('exportSuccess')
                    )
                  }
                  dialogTitle="Select Track Parameters CSV File"
                  idPrefix="track"
                  templateHref="/templates/track"
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
      <Card className="px-6 py-8 min-h-[40rem] h-fit w-full max-w-2xl rounded-3xl justify-center overflow-auto custom-scrollbar" id="slope-options-container">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{trans('slopeTitle')}</CardTitle>
          <CardDescription>{trans('slopeDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...constantForm}>
            <form
              onSubmit={constantForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="flex flex-col gap-6">
                {slopeFormRows.map((row, rowIndex) => (
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

              <FormActionButtons
                isSubmitting={isSubmitting}
                onProcessCsvData={processCsvData}
                onReset={handleReset}
                onExport={() =>
                  csvExportPresetHandler(
                    constantForm.getValues() as Record<string, unknown>,
                    'track-slope-parameters.csv',
                    trans('exportSuccess')
                  )
                }
                dialogTitle="Select Slope Preset Parameters CSV File"
                idPrefix="slope"
                labels={{
                  save: trans('save'),
                  saving: trans('saving'),
                  uploadCsv: trans('uploadCsv'),
                  uploading: trans('uploading'),
                  reset: trans('reset'),
                  exportCsv: trans('exportCsv'),
                }}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
