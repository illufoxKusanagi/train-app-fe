'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const flagStyle = "inline-block shrink-0 rounded-[2px] border border-muted-foreground/20 shadow-xs";

function GbFlag() {
  return (
    <svg
      className={flagStyle}
      style={{ width: "20px", height: "10px" }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 30"
    >
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z"/>
      </clipPath>
      <clipPath id="t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
      </clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth={6}/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth={4}/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth={10}/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth={6}/>
      </g>
    </svg>
  );
}

function IdFlag() {
  return (
    <svg
      className={flagStyle}
      style={{ width: "20px", height: "13.33px" }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
    >
      <path fill="#fff" d="M0 0H900V600H0z"/>
      <path fill="#C8102E" d="M0 0H900V300H0z"/>
    </svg>
  );
}

const LOCALE_MAP: Record<string, { flag: React.ReactNode; label: string }> = {
  en: { flag: <GbFlag />, label: 'EN' },
  id: { flag: <IdFlag />, label: 'ID' },
};

export function LocaleSwitcherButton() {
  type Locale = keyof typeof LOCALE_MAP;
  const [current, setCurrent] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('locale');
    if (saved === 'en' || saved === 'id') setCurrent(saved);
  }, []);

  const switchLocale = (locale: Locale) => {
    localStorage.setItem('locale', locale);
    setCurrent(locale);
    // Dispatch a custom event so LocaleProvider hot-swaps messages
    // without a full page reload (which crashes Qt WebEngine in built apps)
    window.dispatchEvent(new CustomEvent('locale-change', { detail: locale }));
  };

  const display = LOCALE_MAP[current] ?? LOCALE_MAP.en;
  return (
    <div className='z-[90]'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button id='locale-switcher-btn' variant={'outline'} size={'default'} className="flex items-center gap-1.5">
            {display.flag}
            <span>{display.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => switchLocale('en')} className="flex items-center gap-2">
            <GbFlag />
            <span>English</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchLocale('id')} className="flex items-center gap-2">
            <IdFlag />
            <span>Bahasa Indonesia</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
