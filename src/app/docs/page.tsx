'use client';

import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import { DocsPager } from '@/components/docs/pager';
import { useTranslations } from 'next-intl';

export default function DocsIntroductionPage() {
  const t = useTranslations('DocsIntro');

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
              {t('whatIsTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>
              {t('whatIsDesc1')}
            </p>
            <p className='text-muted-foreground leading-7'>
              {t('whatIsDesc2')}
            </p>
          </section>

          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('featuresTitle')}
            </p>
            <ul className='space-y-4 list-none pl-0 text-muted-foreground'>
              <li className='flex items-start'>
                <span className='mr-3 mt-1 flex h-2 w-2 rounded-full bg-primary flex-shrink-0'></span>
                <div>
                  <strong className='text-foreground block'>
                    {t('featPhysicsTitle')}
                  </strong>
                  {t('featPhysicsDesc')}
                </div>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 mt-1 flex h-2 w-2 rounded-full bg-primary flex-shrink-0'></span>
                <div>
                  <strong className='text-foreground block'>
                    {t('featFuzzyTitle')}
                  </strong>
                  {t('featFuzzyDesc')}
                </div>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 mt-1 flex h-2 w-2 rounded-full bg-primary flex-shrink-0'></span>
                <div>
                  <strong className='text-foreground block'>
                    {t('featAnalyticsTitle')}
                  </strong>
                  {t('featAnalyticsDesc')}
                </div>
              </li>
            </ul>
          </section>

          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('workflowTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>
              {t('workflowDesc')}
            </p>
            <ol className='space-y-4 list-decimal pl-6 text-muted-foreground marker:text-primary marker:font-bold'>
              <li className='pl-2'>
                <strong className='text-foreground block'>
                  {t('wf1Title')}
                </strong>
                {t('wf1Desc')}
              </li>
              <li className='pl-2'>
                <strong className='text-foreground block'>
                  {t('wf2Title')}
                </strong>
                {t('wf2Desc')}
              </li>
              <li className='pl-2'>
                <strong className='text-foreground block'>
                  {t('wf3Title')}
                </strong>
                {t('wf3Desc')}
              </li>
              <li className='pl-2'>
                <strong className='text-foreground block'>
                  {t('wf4Title')}
                </strong>
                {t('wf4Desc')}
              </li>
              <li className='pl-2'>
                <strong className='text-foreground block'>
                  {t('wf5Title')}
                </strong>
                {t('wf5Desc')}
              </li>
            </ol>
          </section>

          <section className='space-y-4'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('navTitle')}
            </p>
            <p className='text-muted-foreground leading-7'>{t('navDesc')}</p>
            <ul className='list-disc pl-6 text-muted-foreground space-y-2 marker:text-primary'>
              <li>
                <span className='font-bold'>{t('navArchLabel')}</span>{' '}
                {t('navArch')}
              </li>
              <li>
                <span className='font-bold'>{t('navFuzzyLabel')}</span>{' '}
                {t('navFuzzy')}
              </li>
            </ul>
          </section>

          <DocsPager />
        </article>
      </div>
    </PageLayout>
  );
}
