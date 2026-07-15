'use client';
import {
  Activity,
  BarChart3,
  Rocket,
  TrainFront,
  Waypoints,
  Zap,
  HelpCircle,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function AppSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const tSidebar = useTranslations('Sidebar');

  const configItems = [
    {
      title: 'Train Parameter',
      url: '/train-parameter',
      icon: TrainFront,
    },
    {
      title: 'Running Parameter',
      url: '/running-parameter',
      icon: Activity,
    },
    {
      title: 'Track Parameter',
      url: '/track-parameter',
      icon: Waypoints,
    },
    {
      title: 'Electrical Parameter',
      url: '/electrical-parameter',
      icon: Zap,
    },
  ];

  const templateItems = [
    {
      title: tSidebar('templates.train'),
      url: '/templates/train',
      icon: TrainFront,
    },
    {
      title: tSidebar('templates.running'),
      url: '/templates/running',
      icon: Activity,
    },
    {
      title: tSidebar('templates.track'),
      url: '/templates/track',
      icon: Waypoints,
    },
    {
      title: tSidebar('templates.electrical'),
      url: '/templates/electrical',
      icon: Zap,
    },
  ];

  const analysisItems = [
    {
      title: 'Output',
      url: '/output',
      icon: BarChart3,
    },
    {
      title: 'Optimization',
      url: '/optimization',
      icon: Rocket,
    },
  ];

  return (
    <Sidebar variant='floating' collapsible='icon' className='z-[100]'>
      <SidebarTrigger
        size={'lg'}
        className={cn(
          'absolute',
          'bg-sidebar text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          open ? 'top-6 left-6' : 'top-4 left-4',
        )}
      />
      <SidebarHeader
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          open
            ? 'px-4 pt-4 block opacity-100'
            : 'px-2 pt-4 flex items-center justify-center opacity-100',
        )}>
        {open ? (
          <div className='flex flex-row gap-2 items-center w-full mt-10 mb-3'>
            <Image src='/logo.png' alt='Logo' width={50} height={50} />
            <div className='flex flex-col'>
              <p className='font-bold text-lg text-primary leading-none'>
                Train Simulation App
              </p>
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center w-full mt-11'>
            <Image src='/logo.png' alt='Logo' width={16} height={16} />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className='flex flex-col gap-4 transition-all duration-500 ease-in-out'>
        <SidebarGroup className={cn(open ? '' : 'mt-6')}>
          <SidebarGroupContent>
            <SidebarGroupLabel>Input Menus</SidebarGroupLabel>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarHeader key={item.title}>
                  <SidebarMenuButton
                    asChild
                    key={item.title}
                    isActive={pathname === item.url}
                    tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarHeader>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Output Menus</SidebarGroupLabel>
            <SidebarMenu>
              {analysisItems.map((item) => (
                <SidebarHeader key={item.title}>
                  <SidebarMenuButton
                    asChild
                    key={item.title}
                    isActive={pathname === item.url}
                    tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarHeader>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>{tSidebar('help.title')}</SidebarGroupLabel>
            <SidebarMenu>
              <Collapsible
                key='help'
                asChild
                defaultOpen={pathname.startsWith('/docs')}
                className='group/collapsible'>
                <SidebarHeader>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={tSidebar('help.tooltip')}>
                      <HelpCircle />
                      <span>{tSidebar('help.tooltip')}</span>
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === '/docs'}>
                          <Link href='/docs'>
                            <span>{tSidebar('help.intro')}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === '/docs/architecture'}>
                          <Link href='/docs/architecture'>
                            <span>{tSidebar('help.architecture')}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === '/docs/fuzzy-logic'}>
                          <Link href='/docs/fuzzy-logic'>
                            <span>{tSidebar('help.fuzzy')}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {/* ── Guides ───────────────────────────── */}
                      <SidebarMenuSubItem className='pt-2'>
                        <span className='px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                          {tSidebar('guides.header')}
                        </span>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            pathname === '/docs/guides/train-parameter'
                          }>
                          <Link href='/docs/guides/train-parameter'>
                            <span>{tSidebar('guides.train')}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            pathname === '/docs/guides/running-parameter'
                          }>
                          <Link href='/docs/guides/running-parameter'>
                            <span>{tSidebar('guides.running')}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            pathname === '/docs/guides/track-parameter'
                          }>
                          <Link href='/docs/guides/track-parameter'>
                            <span>{tSidebar('guides.track')}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            pathname === '/docs/guides/electrical-parameter'
                          }>
                          <Link href='/docs/guides/electrical-parameter'>
                            <span>{tSidebar('guides.electrical')}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            pathname === '/docs/guides/output'
                          }>
                          <Link href='/docs/guides/output'>
                            <span>{tSidebar('guides.output')}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            pathname === '/docs/guides/optimization'
                          }>
                          <Link href='/docs/guides/optimization'>
                            <span>{tSidebar('guides.optimization')}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarHeader>
              </Collapsible>
            </SidebarMenu>
            <SidebarMenu>
              <Collapsible
                key='templates'
                asChild
                defaultOpen={pathname.startsWith('/templates')}
                className='group/collapsible'>
                <SidebarHeader>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={tSidebar('templates.tooltip')}>
                      <FileSpreadsheet />
                      <span>{tSidebar('templates.title')}</span>
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {templateItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === item.url}>
                            <Link href={item.url}>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarHeader>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter
        className={cn(
          'w-full bg-sidebar-accent backdrop-blur supports-[backdrop-filter]:bg-sidebar-accent transition-all duration-300 rounded-b-lg',
          open ? 'p-4' : 'p-2',
        )}>
        {open ? (
          <p className='body-small-bold text-center'>
            Made with ❤️ by{' '}
            <Link href={'https://github.com/illufoxKusanagi'}>
              <span className='hover:underline text-primary-600 dark:text-primary-300'>
                illufoxKusanagi
              </span>
            </Link>
          </p>
        ) : (
          <div className='flex items-center justify-center h-6'>
            <Link href={'https://github.com/illufoxKusanagi'}>
              <span className='text-xl'>❤️</span>
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
