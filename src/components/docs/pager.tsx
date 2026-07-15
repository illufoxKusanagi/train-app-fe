'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

import { useTranslations } from 'next-intl';

export function DocsPager() {
  const pathname = usePathname();
  const t = useTranslations('Sidebar');

  const docsConfig = [
    {
      title: t('help.intro'),
      href: '/docs',
    },
    {
      title: t('help.architecture'),
      href: '/docs/architecture',
    },
    {
      title: t('help.mechanics'),
      href: '/docs/mechanics',
    },
    {
      title: t('help.fuzzy'),
      href: '/docs/fuzzy-logic',
    },
    {
      title: `${t('guides.header')}: ${t('guides.train')}`,
      href: '/docs/guides/train-parameter',
    },
    {
      title: `${t('guides.header')}: ${t('guides.running')}`,
      href: '/docs/guides/running-parameter',
    },
    {
      title: `${t('guides.header')}: ${t('guides.track')}`,
      href: '/docs/guides/track-parameter',
    },
    {
      title: `${t('guides.header')}: ${t('guides.electrical')}`,
      href: '/docs/guides/electrical-parameter',
    },
    {
      title: `${t('guides.header')}: ${t('guides.output')}`,
      href: '/docs/guides/output',
    },
    {
      title: `${t('guides.header')}: ${t('guides.optimization')}`,
      href: '/docs/guides/optimization',
    },
  ];

  const activeIndex = docsConfig.findIndex((item) => item.href === pathname);
  if (activeIndex === -1) return null;

  const prev = activeIndex !== 0 ? docsConfig[activeIndex - 1] : null;
  const next =
    activeIndex !== docsConfig.length - 1 ? docsConfig[activeIndex + 1] : null;

  return (
    <div className='flex flex-row items-center justify-between pt-8 pb-12 mt-12 mb-4 border-t border-border'>
      {prev ? (
        <Link
          href={prev.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'flex flex-row gap-6 max-w-[200px] sm:max-w-none h-fit justify-between',
          )}>
          <ChevronLeft className='w-4 h-4' />
          <div className='flex flex-col gap-2'>
            <span className='body-small-regular'>{t('pager.previous')}</span>
            <span className='body-medium-regular'>{prev.title}</span>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link
          href={next.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'flex flex-row gap-6 max-w-[200px] sm:max-w-none h-fit justify-between',
          )}>
          <div className='flex flex-col gap-2'>
            <span className='body-small-regular'>{t('pager.next')}</span>
            <span className='body-medium-regular'>{next.title}</span>
          </div>
          <ChevronRight className='w-4 h-4' />
        </Link>
      )}
    </div>
  );
}
