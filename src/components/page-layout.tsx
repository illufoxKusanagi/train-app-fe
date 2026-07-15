'use client';

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslations } from 'next-intl';

import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { ModeToggle } from '@/components/toggle-mode-button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SimulationButtons } from './buttons/simulation-buttons';
import { LocaleSwitcherButton } from './buttons/locale-switcher-button';
import { Button } from './ui/button';
import { HelpCircle, SendIcon } from 'lucide-react';
interface PageMoldProps {
  children: ReactNode;
  className?: string;
  sidebarDefaultOpen?: boolean;
  pageId?: string;
  guideSteps?: {
    element: string;
    title: string;
    description: string;
    onHighlightStarted?: (element: Element | undefined) => void;
  }[];
}

export default function PageLayout({
  children,
  className = '',
  sidebarDefaultOpen = false,
  pageId,
  guideSteps,
}: PageMoldProps) {
  const t = useTranslations('Guide');
  const router = useRouter();

  useEffect(() => {
    const handleShowTopbarGuide = () => {
      if (sessionStorage.getItem('hasShownTopbarGuide') === 'true') {
        return;
      }
      sessionStorage.setItem('hasShownTopbarGuide', 'true');

      const steps = [
        {
          element: '#sim-static-btn',
          popover: {
            title: t('topbar.staticBtnTitle'),
            description: t('topbar.staticBtnDesc'),
          },
        },
        {
          element: '#sim-dynamic-btn',
          popover: {
            title: t('topbar.dynamicBtnTitle'),
            description: t('topbar.dynamicBtnDesc'),
          },
        },
        {
          element: '#locale-switcher-btn',
          popover: {
            title: t('topbar.localeBtnTitle'),
            description: t('topbar.localeBtnDesc'),
          },
        },
        {
          element: '#docs-btn',
          popover: {
            title: t('topbar.docsBtnTitle'),
            description: t('topbar.docsBtnDesc'),
          },
        },
        {
          element: '#theme-toggle-btn',
          popover: {
            title: t('topbar.themeBtnTitle'),
            description: t('topbar.themeBtnDesc'),
          },
        },
      ];

      const driverObj = driver({
        showProgress: true,
        steps,
        onHighlightStarted: (element) => {
          if (!element) return;
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
      });
      driverObj.drive();
    };

    window.addEventListener('show-topbar-guide', handleShowTopbarGuide);
    return () => {
      window.removeEventListener('show-topbar-guide', handleShowTopbarGuide);
    };
  }, [t]);

  const handleGuide = () => {
    if (!pageId && !guideSteps) return;

    const steps = guideSteps
      ? guideSteps.map((step) => ({
          element: step.element,
          popover: { title: step.title, description: step.description },
          onHighlightStarted: (element: Element | undefined) => {
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (step.onHighlightStarted) {
              step.onHighlightStarted(element);
            }
          },
        }))
      : [
          {
            element: '#page-title',
            popover: {
              title: t(`${pageId}.title`),
              description: t(`${pageId}.description`),
            },
          },
          {
            element: '#page-form',
            popover: {
              title: t('common.inputsTitle'),
              description: t('common.inputsDesc'),
            },
          },
          {
            element: '#form-actions',
            popover: {
              title: t('common.actionsTitle'),
              description: t('common.actionsDesc'),
            },
          },
        ];

    const driverObj = driver({
      showProgress: true,
      steps,
      onHighlightStarted: (element) => {
        if (!element) return;
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
    });
    driverObj.drive();
  };

  const handleTemplate = () => {
    if (!pageId) return;
    router.push(`/templates/${pageId}`);
  };

  return (
    <SidebarProvider defaultOpen={sidebarDefaultOpen}>
      <div className={`flex flex-col w-full h-full ${className}`}>
        <div className='sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-accent/60 border-b border-border'>
          <AppSidebar />
          <div className='flex items-center justify-between px-4 py-4'>
            <SidebarTrigger size='lg' />
            <div className='flex items-center gap-2'>
              <SimulationButtons />
              <LocaleSwitcherButton />
              <Button id='docs-btn' variant={'outline'} size={'icon'} asChild>
                <Link href='/docs' aria-label={t('docs')}>
                  <HelpCircle />
                </Link>
              </Button>
              {(pageId || guideSteps) && (
                <Button variant={'secondary'} onClick={handleGuide}>
                  <SendIcon className='w-4 h-4 mr-2' />
                  {t('guideMe')}
                </Button>
              )}
              {pageId && (
                <Button variant={'outline'} onClick={handleTemplate}>
                  {t('template')}
                </Button>
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
        <div className='flex flex-col xl:flex-row justify-center items-center gap-4 h-full mx-16 my-4'>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
