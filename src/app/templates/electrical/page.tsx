'use client';

import PageLayout from '@/components/page-layout';
import { TemplateCard } from '@/components/template-card';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';

// Scalar preset — key/value format
const electricalPresetCsv = `key,value
stat_vol_line,1500
stat_vol_motor,600
stat_pf,90
stat_eff_gear,97
stat_eff_motor,92
stat_eff_vvvf,98
p_aps,50`;

// Speed-indexed curves:
// Col 0 = Speed (km/h)  — stored as v_xxx_array by the backend
// Col 1 = Value         — stored as xxx_array by the backend

const lineVoltageCsv = `Speed (km/h),Line Voltage (V)
13.5,1178
19.2,1254
26.8,1086
34.6,1432`;

const motorVoltageCsv = `Speed (km/h),Motor Voltage (V)
11.8,733
18.9,1026
24.5,618
30.2,1378`;

const gearEfficiencyCsv = `Speed (km/h),Gearbox Efficiency (ratio)
17.3,0.844
29.1,0.896
33.7,0.812
41.5,0.927`;

const motorEfficiencyCsv = `Speed (km/h),Motor Efficiency (ratio)
11.2,0.831
16.7,0.915
23.5,0.866
28.9,0.944`;

const vvvfEfficiencyCsv = `Speed (km/h),VVVF Efficiency (ratio)
12.6,0.869
18.4,0.911
24.9,0.879
31.7,0.948`;

export default function ElectricalTemplatePage() {
  const t = useTranslations('Templates.electrical');
  return (
    <PageLayout sidebarDefaultOpen={true}>
      <div className='flex flex-col w-full h-full self-start p-8 md:p-12 gap-8 overflow-y-auto custom-scrollbar max-w-4xl mx-auto'>
        <div className='flex flex-col space-y-2'>
          <p className='heading-1 text-foreground'>{t('title')}</p>
          <p className='text-muted-foreground'>
            {t('desc')}
          </p>
        </div>

        <Separator />

        <section className='flex flex-col gap-6'>
          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('generalTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('generalDesc')}
            </p>
            <TemplateCard
              title={t('generalTitle')}
              description={t('generalCardDesc')}
              filename='electrical-preset.csv'
              headers={['key', 'value']}
              sampleData={[
                ['stat_vol_line', '1500'],
                ['stat_vol_motor', '600'],
                ['stat_pf', '90'],
                ['stat_eff_gear', '97'],
                ['stat_eff_motor', '92'],
                ['stat_eff_vvvf', '98'],
                ['p_aps', '50'],
              ]}
              csvContent={electricalPresetCsv}
            />
          </div>

          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('lineTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('lineDesc')}
            </p>
            <TemplateCard
              title={t('lineTitle')}
              description={t('lineCardDesc')}
              filename='stat_vol_line.csv'
              headers={['Speed (km/h)', 'Line Voltage (V)']}
              sampleData={[
                ['13.5', '1178'],
                ['19.2', '1254'],
                ['26.8', '1086'],
                ['34.6', '1432'],
              ]}
              csvContent={lineVoltageCsv}
            />
          </div>

          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('motorTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('motorDesc')}
            </p>
            <TemplateCard
              title={t('motorTitle')}
              description={t('motorCardDesc')}
              filename='stat_vol_motor.csv'
              headers={['Speed (km/h)', 'Motor Voltage (V)']}
              sampleData={[
                ['11.8', '733'],
                ['18.9', '1026'],
                ['24.5', '618'],
                ['30.2', '1378'],
              ]}
              csvContent={motorVoltageCsv}
            />
          </div>

          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('gearTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('gearDesc')}
            </p>
            <TemplateCard
              title={t('gearTitle')}
              description={t('gearCardDesc')}
              filename='stat_eff_gear.csv'
              headers={['Speed (km/h)', 'Efficiency (ratio)']}
              sampleData={[
                ['17.3', '0.844'],
                ['29.1', '0.896'],
                ['33.7', '0.812'],
                ['41.5', '0.927'],
              ]}
              csvContent={gearEfficiencyCsv}
            />
          </div>

          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('effMotorTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('effMotorDesc')}
            </p>
            <TemplateCard
              title={t('effMotorTitle')}
              description={t('effMotorCardDesc')}
              filename='stat_eff_motor.csv'
              headers={['Speed (km/h)', 'Efficiency (ratio)']}
              sampleData={[
                ['11.2', '0.831'],
                ['16.7', '0.915'],
                ['23.5', '0.866'],
                ['28.9', '0.944'],
              ]}
              csvContent={motorEfficiencyCsv}
            />
          </div>

          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('vvvfTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('vvvfDesc')}
            </p>
            <TemplateCard
              title={t('vvvfTitle')}
              description={t('vvvfCardDesc')}
              filename='stat_eff_vvvf.csv'
              headers={['Speed (km/h)', 'VVVF Efficiency (ratio)']}
              sampleData={[
                ['12.6', '0.869'],
                ['18.4', '0.911'],
                ['24.9', '0.879'],
                ['31.7', '0.948'],
              ]}
              csvContent={vvvfEfficiencyCsv}
            />
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
