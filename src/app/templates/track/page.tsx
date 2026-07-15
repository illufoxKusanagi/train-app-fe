'use client';

import PageLayout from '@/components/page-layout';
import { TemplateCard } from '@/components/template-card';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';

const trackPresetCsv = `key,value
n_station,4
x_station,1500
radius,2000
slope,5
v_limit,80
dwellTime,45`;

const stationDistancesCsv = `Start,End,Value
0,2836,2836
2836,9475,6639
9475,15018,5543
15018,21289,6271`;

const radiusCsv = `Start,End,Value
0,320,650
320,2536,0
2535,2836,909
2836,9475,800`;

const slopeCsv = `Start,End,Value
0,1000,1
1000,2836,3
2836,37306,7
37306,43156,11`;

const vLimitCsv = `Start,End,Value
0,14586,115
14586,15686,105
15686,20986,115
20986,21786,105`;

const dwellTimeCsv = `Distance (m),Dwell Time (s)
2836,120
9475,300
15018,540
21289,240`;

export default function TrackTemplatePage() {
  const t = useTranslations('Templates.track');
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
              filename='track-preset.csv'
              headers={['key', 'value']}
              sampleData={[
                ['n_station', '4'],
                ['x_station', '1500'],
                ['radius', '2000'],
                ['slope', '5'],
                ['v_limit', '80'],
                ['dwellTime', '45'],
              ]}
              csvContent={trackPresetCsv}
            />
          </div>

          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('stationTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('stationDesc')}
            </p>
            <TemplateCard
              title={t('stationTitle')}
              description={t('stationCardDesc')}
              filename='x_station.csv'
              headers={['Start (m)', 'End (m)', 'Station Distance (m)']}
              sampleData={[
                ['0', '2836', '2836'],
                ['2836', '9475', '6639'],
                ['9475', '15018', '5543'],
                ['15018', '21289', '6271'],
              ]}
              csvContent={stationDistancesCsv}
            />
          </div>

          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('radiusTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('radiusDesc')}
            </p>
            <TemplateCard
              title={t('radiusTitle')}
              description={t('radiusCardDesc')}
              filename='radius.csv'
              headers={['Start (m)', 'End (m)', 'Radius (m)']}
              sampleData={[
                ['0', '320', '650'],
                ['320', '2536', '0'],
                ['2535', '2836', '909'],
                ['2836', '9475', '800'],
              ]}
              csvContent={radiusCsv}
            />
          </div>

          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('slopeTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('slopeDesc')}
            </p>
            <TemplateCard
              title={t('slopeTitle')}
              description={t('slopeCardDesc')}
              filename='slope.csv'
              headers={['Start (m)', 'End (m)', 'Gradient (‰)']}
              sampleData={[
                ['0', '1000', '1'],
                ['1000', '2836', '3'],
                ['2836', '37306', '7'],
                ['37306', '43156', '11'],
              ]}
              csvContent={slopeCsv}
            />
          </div>

          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('limitTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('limitDesc')}
            </p>
            <TemplateCard
              title={t('limitTitle')}
              description={t('limitCardDesc')}
              filename='v_limit.csv'
              headers={['Start (m)', 'End (m)', 'Speed Limit (km/h)']}
              sampleData={[
                ['0', '14586', '115'],
                ['14586', '15686', '105'],
                ['15686', '20986', '115'],
                ['20986', '21786', '105'],
              ]}
              csvContent={vLimitCsv}
            />
          </div>

          <div>
            <p className='body-big-bold border-l-4 border-primary pl-3 mb-1'>{t('dwellTitle')}</p>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('dwellDesc')}
            </p>
            <TemplateCard
              title={t('dwellTitle')}
              description={t('dwellCardDesc')}
              filename='dwellTime.csv'
              headers={['Distance (m)', 'Dwell Time (s)']}
              sampleData={[
                ['2836', '120'],
                ['9475', '300'],
                ['15018', '540'],
                ['21289', '240'],
              ]}
              csvContent={dwellTimeCsv}
            />
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
