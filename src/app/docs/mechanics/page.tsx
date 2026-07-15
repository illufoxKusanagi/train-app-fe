'use client';

import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import { DocsPager } from '@/components/docs/pager';
import { useTranslations } from 'next-intl';

export default function MechanicsDocsPage() {
  const t = useTranslations('DocsMech');

  return (
    <PageLayout sidebarDefaultOpen={true}>
      <div className="flex flex-col w-full h-full self-start p-8 md:p-12 gap-8 overflow-y-auto custom-scrollbar max-w-4xl mx-auto">
        <header className="flex flex-col space-y-4">
          <p className="heading-1 text-foreground">
            {t('title')}
          </p>
          <p className="body-big-regular text-muted-foreground">
            {t('subtitle')}
          </p>
        </header>

        <Separator />

        <article className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <p className="heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground">
              {t('modesTitle')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-muted/30 p-6 rounded-lg border shadow-sm">
                <p className="font-bold text-foreground text-lg mb-2">
                  {t('staticTitle')}
                </p>
                <p className="text-muted-foreground text-sm leading-6">
                  {t('staticDesc')}
                </p>
              </div>
              <div className="bg-muted/30 p-6 rounded-lg border shadow-sm">
                <p className="font-bold text-foreground text-lg mb-2">
                  {t('dynamicTitle')}
                </p>
                <p className="text-muted-foreground text-sm leading-6">
                  {t('dynamicDesc')}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <p className="heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground">
              {t('resistanceTitle')}
            </p>
            <p className="text-muted-foreground leading-7">
              {t('resistanceDesc')}
            </p>

            <div className="bg-muted/40 p-6 rounded-lg border border-primary/20 flex flex-col items-center justify-center my-6">
              <code className="text-2xl font-mono text-foreground tracking-wider mb-2">
                R<sub className="text-sm">total</sub> = A + Bv + Cv² + R
                <sub className="text-sm">g</sub> + R
                <sub className="text-sm">c</sub>
              </code>
              <span className="text-xs text-muted-foreground mt-2">
                {t('siNote')}
              </span>
            </div>

            <ul className="space-y-3 list-none pl-0 text-muted-foreground">
              {[
                { term: 'A', key: 'termA' },
                { term: 'Bv', key: 'termBv' },
                { term: 'Cv²', key: 'termCv2' },
                { term: 'R_g', key: 'termRg' },
                { term: 'R_c', key: 'termRc' },
              ].map(({ term, key }) => (
                <li key={term} className="flex items-start">
                  <span className="font-mono font-bold text-primary w-12 shrink-0">
                    {term}
                  </span>
                  <span>{t(key as Parameters<typeof t>[0])}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <p className="heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground">
              {t('tractiveTitle')}
            </p>
            <p className="text-muted-foreground leading-7">
              {t('tractiveDesc')}
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground space-y-2 marker:font-bold marker:text-foreground">
              <li>{t('tractiveConstant')}</li>
              <li>{t('tractiveConstantPower')}</li>
            </ol>
            <p className="text-muted-foreground leading-7 mt-4">
              {t('tractiveAdhesion')}
            </p>
          </section>

          <DocsPager />
        </article>
      </div>
    </PageLayout>
  );
}
