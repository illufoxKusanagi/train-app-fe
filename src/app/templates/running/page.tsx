'use client';

import PageLayout from '@/components/page-layout';
import { TemplateCard } from '@/components/template-card';
import { useTranslations } from 'next-intl';

const runningCsvContent = `key,value
startRes,120
v_p1,45
v_p2,80
v_diffCoast,5
v_b1,80
v_b2,45
acc_linear_si,1.0
pow_gear,P4
acc_linear,3.6
decc_linear_si,1.0
brake_gear,B4
decc_linear,3.6
decc_emergency_si,1.2
decc_emergency,4.32`;

const sampleData = [
  ['startRes', '120'],
  ['v_p1', '45'],
  ['v_p2', '80'],
  ['v_diffCoast', '5'],
  ['v_b1', '80'],
  ['v_b2', '45'],
  ['acc_linear_si', '1.0'],
  ['pow_gear', 'P4'],
  ['acc_linear', '3.6'],
  ['decc_linear_si', '1.0'],
  ['brake_gear', 'B4'],
  ['decc_linear', '3.6'],
  ['decc_emergency_si', '1.2'],
  ['decc_emergency', '4.32']
];

export default function RunningTemplatePage() {
  const t = useTranslations('Templates.running');
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
          filename='running-preset-template.csv'
          headers={['key', 'value']}
          sampleData={sampleData}
          csvContent={runningCsvContent}
        />
      </div>
    </PageLayout>
  );
}
