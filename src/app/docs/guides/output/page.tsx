'use client';

import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import { DocsPager } from '@/components/docs/pager';
import { useTranslations } from 'next-intl';

export default function OutputGuidePage() {
  const t = useTranslations('Guide.outputGuidePage');

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

          {/* ── SECTION 2: EMPTY STATE ──────────────────────────────── */}
          <section className='space-y-6'>
            <p className='heading-5 text-foreground'>{t('emptyStateTitle')}</p>
            <p className='text-muted-foreground leading-7'>
              {t('emptyStateDesc')}
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='bg-muted/30 border rounded-lg p-4 space-y-2'>
                <p className='body-small-bold text-foreground'>{t('runStaticTitle')}</p>
                <p className='body-small-regular text-muted-foreground leading-6'>{t('runStaticDesc')}</p>
              </div>
              <div className='bg-muted/30 border rounded-lg p-4 space-y-2'>
                <p className='body-small-bold text-foreground'>{t('runDynamicTitle')}</p>
                <p className='body-small-regular text-muted-foreground leading-6'>{t('runDynamicDesc')}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* ── SECTION 3: RESULTS STATE ────────────────────────────── */}
          <section className='space-y-6'>
            {/* Summary */}
            <div className='space-y-4'>
              <p className='heading-5 text-foreground'>{t('summaryTitle')}</p>
              <p className='text-muted-foreground leading-7'>
                {t('summaryDesc')}
              </p>
            </div>

            {/* Tabs */}
            <div className='space-y-4'>
              <p className='heading-5 text-foreground'>{t('tabsTitle')}</p>
              <p className='text-muted-foreground leading-7'>
                {t('tabsDesc')}
              </p>
            </div>

            {/* Distance Tab specific */}
            <div className='space-y-4'>
              <p className='heading-5 text-foreground'>{t('distanceTabTitle')}</p>
              <p className='text-muted-foreground leading-7'>
                {t('distanceTabDesc')}
              </p>
            </div>

            {/* Action buttons (chart) */}
            <div className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {[
                  { label: t('saveChartTitle'), desc: t('saveChartDesc') },
                  { label: t('saveChartCsvTitle'), desc: t('saveChartCsvDesc') },
                  { label: t('saveChartExcelTitle'), desc: t('saveChartExcelDesc') },
                ].map(({ label, desc }) => (
                  <div key={label} className='bg-muted/30 border rounded-lg p-4 space-y-2'>
                    <p className='body-small-bold text-foreground'>{label}</p>
                    <p className='body-small-regular text-muted-foreground leading-6'>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Export All Data */}
            <div className='space-y-4'>
              <p className='heading-5 text-foreground'>{t('exportAllTitle')}</p>
              <p className='text-muted-foreground leading-7'>
                {t('exportAllDesc')}
              </p>
            </div>
          </section>

          <DocsPager />
        </article>
      </div>
    </PageLayout>
  );
}
