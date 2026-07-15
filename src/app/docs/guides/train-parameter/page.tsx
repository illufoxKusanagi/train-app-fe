'use client';

import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import { DocsPager } from '@/components/docs/pager';
import { useTranslations } from 'next-intl';

export default function TrainParameterGuidePage() {
  const t = useTranslations('Guide.trainGuidePage');

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
              dangerouslySetInnerHTML={{ __html: t('overviewDesc1') }}
            />
            <ul className='space-y-2 list-none pl-0 text-muted-foreground'>
              {[
                [t('constantTitle'), t('overviewDesc2')],
                [t('trainsetTitle'), t('overviewDesc3')],
              ].map(([title, desc]) => (
                <li key={title} className='flex items-start gap-3'>
                  <span className='mt-2 flex h-2 w-2 rounded-full bg-primary flex-shrink-0' />
                  <div>
                    <span className='text-foreground block'>{title}</span>
                    {desc}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          {/* ── SECTION 2: CONSTANT PARAMETERS ──────────────────────── */}
          <section className='space-y-6'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('constantTitle')}
            </p>

            {/* Input fields */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>
                {t('inputFieldsTitle')}
              </p>
              <p className='text-muted-foreground leading-7'>
                {t('inputFieldsDesc')}
              </p>
              <div className='bg-muted/30 border rounded-lg overflow-hidden'>
                <table className='w-full text-sm'>
                  <thead className='bg-muted/60'>
                    <tr className='border-b'>
                      <th className='text-left px-4 py-3 body-small-bold text-foreground'>
                        {t('varHeader')}
                      </th>
                      <th className='text-left px-4 py-3 body-small-bold text-foreground'>
                        {t('unitHeader')}
                      </th>
                      <th className='text-left px-4 py-3 body-small-bold text-foreground'>
                        {t('descHeader')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='text-muted-foreground'>
                    {[
                      ['i_T', '—', t('desc_i_T')],
                      ['i_M', '—', t('desc_i_M')],
                      ['n_axle', '—', t('desc_n_axle')],
                      ['n_tm', '—', t('desc_n_tm')],
                      ['wheelDiameter', 'mm', t('desc_wheelDiameter')],
                      ['mass_P', 'kg', t('desc_mass_P')],
                      ['gearRatio', '—', t('desc_gearRatio')],
                      ['load', 'ton', t('desc_load')],
                      ['carLength', 'm', t('desc_carLength')],
                      ['loadCondition', '—', t('desc_loadCondition')],
                    ].map(([v, u, d]) => (
                      <tr
                        key={v}
                        className='border-b last:border-0 hover:bg-muted/20'>
                        <td className='px-4 py-3 font-mono body-small-bold text-foreground'>
                          {v}
                        </td>
                        <td className='px-4 py-3'>{u}</td>
                        <td className='px-4 py-3'>{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action buttons */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>
                {t('actionTitle')}
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {[
                  { label: t('btnSave'), desc: t('btnSaveDesc') },
                  { label: t('btnReset'), desc: t('btnResetDesc') },
                  { label: t('btnExport'), desc: t('btnExportDesc') },
                  { label: t('btnUpload'), desc: t('btnUploadDesc') },
                ].map(({ label, desc }) => (
                  <div
                    key={label}
                    className='bg-muted/30 border rounded-lg p-4 space-y-2'>
                    <p className='body-small-bold text-foreground'>{label}</p>
                    <p className='text-sm text-muted-foreground leading-6'>
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CSV template */}
            <div className='space-y-3'>
              <p className='body-big-bold text-foreground'>
                {t('csvTemplateTitle')}
              </p>
              <p
                className='text-muted-foreground leading-7'
                dangerouslySetInnerHTML={{ __html: t('csvTemplateDesc1') }}
              />
            </div>
          </section>

          <Separator />

          {/* ── SECTION 3: TRAINSET PARAMETERS ──────────────────────── */}
          <section className='space-y-6'>
            <p className='heading-4 tracking-tight border-l-4 border-primary pl-4 text-foreground'>
              {t('trainsetTitle')}
            </p>

            {/* n_car dropdown */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>
                {t('nCarTitle')}
              </p>
              <p
                className='text-muted-foreground leading-7'
                dangerouslySetInnerHTML={{ __html: t('nCarDesc') }}
              />
            </div>

            {/* Car composition fields */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>
                {t('compTitle')}
              </p>
              <p className='text-muted-foreground leading-7'>{t('compDesc')}</p>
              <div className='bg-muted/30 border rounded-lg overflow-hidden'>
                <table className='w-full text-sm'>
                  <thead className='bg-muted/60'>
                    <tr className='border-b'>
                      <th className='text-left px-4 py-3 body-small-bold text-foreground'>
                        {t('subTable')}
                      </th>
                      <th className='text-left px-4 py-3 body-small-bold text-foreground'>
                        {t('vars')}
                      </th>
                      <th className='text-left px-4 py-3 body-small-bold text-foreground'>
                        {t('descHeader')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='text-muted-foreground'>
                    {[
                      [
                        t('carNum'),
                        'n_M1, n_M2, n_Tc, n_T1, n_T2, n_T3, n_M1_disabled, n_M2_disabled',
                        t('desc_carNum'),
                      ],
                      [
                        t('passCap'),
                        'n_PM1, n_PM2, n_PTc, n_PT1, n_PT2, n_PT3',
                        t('desc_passCap'),
                      ],
                      [
                        t('carMass'),
                        'mass_M1, mass_M2, mass_Tc, mass_T1, mass_T2, mass_T3',
                        t('desc_carMass'),
                      ],
                    ].map(([s, v, d]) => (
                      <tr
                        key={s}
                        className='border-b last:border-0 hover:bg-muted/20'>
                        <td className='px-4 py-3 body-small-bold text-foreground'>
                          {s}
                        </td>
                        <td className='px-4 py-3 font-mono text-xs'>{v}</td>
                        <td className='px-4 py-3'>{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculated mass */}
              <div className='bg-muted/20 border border-dashed rounded-lg p-4 space-y-2'>
                <p className='body-small-bold text-foreground'>
                  {t('calcMassTitle')}
                </p>
                <p
                  className='text-sm text-muted-foreground leading-6'
                  dangerouslySetInnerHTML={{ __html: t('calcMassDesc') }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className='space-y-4'>
              <p className='body-big-bold text-foreground'>
                {t('tsActionTitle')}
              </p>
              <p
                className='text-muted-foreground leading-7'
                dangerouslySetInnerHTML={{ __html: t('tsActionDesc') }}
              />
            </div>

            {/* CSV template */}
            <div className='space-y-3'>
              <p className='body-big-bold text-foreground'>
                {t('csvTemplateTitle')}
              </p>
              <p
                className='text-muted-foreground leading-7'
                dangerouslySetInnerHTML={{ __html: t('tsTemplateDesc') }}
              />
            </div>
          </section>

          <DocsPager />
        </article>
      </div>
    </PageLayout>
  );
}
