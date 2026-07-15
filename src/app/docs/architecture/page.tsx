'use client';

import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import { DocsPager } from '@/components/docs/pager';
import { useTranslations } from 'next-intl';

export default function ArchitectureDocsPage() {
  const t = useTranslations('DocsArch');

  return (
    <PageLayout sidebarDefaultOpen={true}>
      <div className='flex flex-col w-full h-full self-start p-8 md:p-12 gap-8 overflow-y-auto custom-scrollbar max-w-4xl mx-auto'>
        <header className='flex flex-col space-y-4'>
          <p className='heading-1 text-foreground'>{t('title')}</p>
          <p className='body-big-regular text-muted-foreground'>
            {t('subtitle')}
          </p>
        </header>

        <Separator />

        <article className='prose prose-slate dark:prose-invert max-w-none space-y-8'>
          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('hybridTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>
              {t('hybridDesc1')}
            </p>
            <p className='text-muted-foreground leading-7'>
              {t('hybridDesc2')}
            </p>
          </section>

          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('ipcTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('ipcDesc')}</p>

            <div className='bg-muted/30 border p-6 rounded-lg font-mono text-sm shadow-inner overflow-x-auto'>
              <pre>
                {t('ipcDiagram')}
              </pre>
            </div>

            <p className='text-muted-foreground leading-7 mt-4'>
              {t('ipcDetail')}
            </p>
          </section>

          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('fileTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('fileDesc1')}</p>
            <p className='text-muted-foreground leading-7'>{t('fileDesc2')}</p>
          </section>

          <DocsPager />
        </article>
      </div>
    </PageLayout>
  );
}
