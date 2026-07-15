'use client';

import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import { DocsPager } from '@/components/docs/pager';
import { useTranslations } from 'next-intl';

export default function RunningParameterGuidePage() {
  const t = useTranslations('Guide.runningGuidePage');

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
            <p className='text-muted-foreground leading-7' dangerouslySetInnerHTML={{ __html: t('overviewDesc') }} />
          </section>

          <Separator />

          {/* ── SECTION 2: RUNNING PARAMETERS ──────────────────────── */}
          <section className='space-y-6'>
            {/* Input fields */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>{t('inputFieldsTitle')}</p>
              <p className='text-muted-foreground leading-7'>
                {t('inputFieldsDesc')}
              </p>
            </div>

            {/* Action buttons */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>{t('actionTitle')}</p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {[
                  { label: t('btnSave'), desc: t('btnSaveDesc') },
                  { label: t('btnReset'), desc: t('btnResetDesc') },
                  { label: t('btnExport'), desc: t('btnExportDesc') },
                  { label: t('btnUpload'), desc: t('btnUploadDesc') },
                ].map(({ label, desc }) => (
                  <div key={label} className='bg-muted/30 border rounded-lg p-4 space-y-2'>
                    <p className='body-small-bold text-foreground'>{label}</p>
                    <p className='body-small-regular text-muted-foreground leading-6'>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CSV template */}
            <div className='space-y-3'>
              <p className='body-big-bold text-foreground'>{t('csvTemplateTitle')}</p>
              <p className='text-muted-foreground leading-7' dangerouslySetInnerHTML={{ __html: t('csvTemplateDesc') }} />
            </div>
          </section>

          <DocsPager />
        </article>
      </div>
    </PageLayout>
  );
}
