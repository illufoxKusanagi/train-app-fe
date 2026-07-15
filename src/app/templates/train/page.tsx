'use client';

import PageLayout from '@/components/page-layout';
import { TemplateCard } from '@/components/template-card';
import { useTranslations } from 'next-intl';

const trainCsvContent = `key,value
n_car,10
n_M1,2
n_M2,2
n_Tc,2
n_T1,2
n_T2,1
n_T3,1
n_M1_disabled,0
n_M2_disabled,0
mass_M1,34.5
mass_M2,33.8
mass_Tc,35.2
mass_T1,32.0
mass_T2,32.0
mass_T3,32.0
n_PM1,200
n_PM2,200
n_PTc,150
n_PT1,200
n_PT2,200
n_PT3,200
i_T,0.08
i_M,0.12
n_axle,4
n_tm,4
wheelDiameter,860
mass_P,60
gearRatio,6.5
load,12
carLength,20
loadCondition,AW0`;

const sampleData = [
  ['n_car', '10'],
  ['n_M1', '2'],
  ['n_M2', '2'],
  ['n_Tc', '2'],
  ['n_T1', '2'],
  ['n_T2', '1'],
  ['n_T3', '1'],
  ['n_M1_disabled', '0'],
  ['n_M2_disabled', '0'],
  ['mass_M1', '34.5'],
  ['mass_M2', '33.8'],
  ['mass_Tc', '35.2'],
  ['mass_T1', '32.0'],
  ['mass_T2', '32.0'],
  ['mass_T3', '32.0'],
  ['n_PM1', '200'],
  ['n_PM2', '200'],
  ['n_PTc', '150'],
  ['n_PT1', '200'],
  ['n_PT2', '200'],
  ['n_PT3', '200'],
  ['i_T', '0.08'],
  ['i_M', '0.12'],
  ['n_axle', '4'],
  ['n_tm', '4'],
  ['wheelDiameter', '860'],
  ['mass_P', '60'],
  ['gearRatio', '6.5'],
  ['load', '12'],
  ['carLength', '20'],
  ['loadCondition', 'AW0']
];

export default function TrainTemplatePage() {
  const t = useTranslations('Templates.train');
  return (
    <PageLayout sidebarDefaultOpen={true}>
      <div className='flex flex-col w-full h-full self-start p-8 md:p-12 gap-8 overflow-y-auto custom-scrollbar max-w-4xl mx-auto'>
        <div className='flex flex-col space-y-2'>
          <p className='heading-1 text-foreground'>{t('title')}</p>
          <p className='text-muted-foreground'>
            {t('desc')}
          </p>
        </div>

        <TemplateCard
          title={t('presetTitle')}
          description={t('presetDesc')}
          filename='train-preset-template.csv'
          headers={['key', 'value']}
          sampleData={sampleData}
          csvContent={trainCsvContent}
        />
      </div>
    </PageLayout>
  );
}
