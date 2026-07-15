'use client';

import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import { DocsPager } from '@/components/docs/pager';
import { useTranslations } from 'next-intl';

export default function OptimizationGuidePage() {
  const t = useTranslations('Guide.optimizationGuidePage');

  return (
    <PageLayout sidebarDefaultOpen={true}>
      <div className='flex flex-col w-full h-full self-start p-8 md:p-12 gap-8 overflow-y-auto custom-scrollbar max-w-4xl mx-auto'>
        <header className='flex flex-col space-y-4'>
          <p className='heading-1 text-foreground'>
            {t('pageTitle')}
          </p>
          <p className='body-big-regular text-muted-foreground'>
            {t('pageDesc')}
          </p>
        </header>

        <Separator />

        <article className='prose prose-slate dark:prose-invert max-w-none space-y-12'>
          {/* ── SECTION 1: OVERVIEW ─────────────────────────────────── */}
          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('overview')}
            </p>
            <p
              className='text-muted-foreground leading-7'
              dangerouslySetInnerHTML={{ __html: t('overviewDesc') }}
            />
          </section>

          <Separator />

          {/* ── SECTION 2: EMPTY STATE (SETTING UP) ────────────────── */}
          <section className='space-y-6'>
            <p className='heading-5 text-foreground'>{t('emptyStateTitle')}</p>
            <p className='text-muted-foreground leading-7'>
              {t('emptyStateDesc')}
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='bg-muted/30 border rounded-lg p-4 space-y-2'>
                <p className='body-small-bold text-foreground'>{t('searchSpaceTitle')}</p>
                <p className='body-small-regular text-muted-foreground leading-6'>{t('searchSpaceDesc')}</p>
              </div>
              <div className='bg-muted/30 border rounded-lg p-4 space-y-2'>
                <p className='body-small-bold text-foreground'>{t('startTitle')}</p>
                <p className='body-small-regular text-muted-foreground leading-6'>{t('startDesc')}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* ── SECTION 3: RESULTS STATE ────────────────────────────── */}
          <section className='space-y-6'>
            <p className='heading-5 text-foreground'>{t('resultsStateTitle')}</p>
            <p className='text-muted-foreground leading-7'>
              {t('resultsStateDesc')}
            </p>

            {/* Tabs */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>{t('tabsTitle')}</p>
              <p className='text-muted-foreground leading-7'>
                {t('tabsDesc')}
              </p>
            </div>

            {/* Top & Bottom */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>{t('topBottomTitle')}</p>
              <p className='text-muted-foreground leading-7'>
                {t('topBottomDesc')}
              </p>
            </div>

            {/* Metric Definitions */}
            <div className='space-y-4 pt-4'>
              <p className='body-big-bold text-foreground'>{t('metricDefsTitle')}</p>
              <ul className='list-disc list-inside space-y-2 text-muted-foreground leading-7 marker:text-primary'>
                <li>
                  <strong className='text-foreground'>{t('metricTimeTitle')}:</strong> {t('metricTimeDesc')}
                </li>
                <li>
                  <strong className='text-foreground'>{t('metricPowerTitle')}:</strong> {t('metricPowerDesc')}
                </li>
                <li>
                  <strong className='text-foreground'>{t('metricEnergyTitle')}:</strong> {t('metricEnergyDesc')}
                </li>
                <li>
                  <strong className='text-foreground'>{t('metricScoreTitle')}:</strong> {t('metricScoreDesc')}
                </li>
              </ul>
            </div>

            {/* Extremes */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>{t('extremesTitle')}</p>
              <p className='text-muted-foreground leading-7'>
                {t('extremesDesc')}
              </p>
            </div>

            {/* Fuzzy Chart Tab */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>{t('fuzzyTabTitle')}</p>
              <p className='text-muted-foreground leading-7'>
                {t('fuzzyTabDesc')}
              </p>
              <ul className='list-disc list-inside space-y-2 text-muted-foreground leading-7 marker:text-primary mt-4'>
                <li>
                  <strong className='text-foreground'>{t('fuzzyTimeTitle')}:</strong> {t('fuzzyTimeDesc')}
                </li>
                <li>
                  <strong className='text-foreground'>{t('fuzzyPowerTitle')}:</strong> {t('fuzzyPowerDesc')}
                </li>
                <li>
                  <strong className='text-foreground'>{t('fuzzyEnergyTitle')}:</strong> {t('fuzzyEnergyDesc')}
                </li>
                <li>
                  <strong className='text-foreground'>{t('fuzzyScoreTitle')}:</strong> {t('fuzzyScoreDesc')}
                </li>
              </ul>
            </div>

            {/* Export */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>{t('exportCsvTitle')}</p>
              <p className='text-muted-foreground leading-7'>
                {t('exportCsvDesc')}
              </p>
            </div>
          </section>

          <DocsPager />
        </article>
      </div>
    </PageLayout>
  );
}
