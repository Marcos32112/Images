'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';

function subscribeToTheme(onChange: () => void) {
    window.addEventListener('imagelite-theme-change', onChange);
    return () => window.removeEventListener('imagelite-theme-change', onChange);
}

function getThemeSnapshot(): 'light' | 'dark' {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

interface TemplateProps {
    children: React.ReactNode
}
export const Template: React.FC<TemplateProps> = ({children}: TemplateProps) => {
    const pathname = usePathname();
    const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => 'light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('imagelite-theme');
        const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
        document.documentElement.dataset.theme = initialTheme;
        window.dispatchEvent(new Event('imagelite-theme-change'));
    }, []);

    function changeTheme(nextTheme: 'light' | 'dark') {
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem('imagelite-theme', nextTheme);
        window.dispatchEvent(new Event('imagelite-theme-change'));
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="site-header">
                <div className="site-header-inner">
                    <Link className="brand-link" href="/" aria-label="ImageLite, início">
                        <span className="brand-mark" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M4 8.2c3.2-4.4 5.7 4.4 8.9 0s5.7 4.4 7.1 0M4 12c3.2-4.4 5.7 4.4 8.9 0s5.7 4.4 7.1 0M4 15.8c3.2-4.4 5.7 4.4 8.9 0s5.7 4.4 7.1 0" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
                            </svg>
                        </span>
                    </Link>

                    <nav className="site-nav" aria-label="Navegação principal">
                        <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>Início</Link>
                        <Link href="/galeria" aria-current={pathname === '/galeria' ? 'page' : undefined}>Galeria</Link>
                    </nav>

                    <div className="header-tools">
                        <div className="theme-toggle" role="group" aria-label="Tema da interface">
                            <button type="button" aria-pressed={theme === 'light'} onClick={() => changeTheme('light')}>Claro</button>
                            <button type="button" aria-pressed={theme === 'dark'} onClick={() => changeTheme('dark')}>Escuro</button>
                        </div>
                    </div>
                </div>
            </header>
            <div key={pathname} className="route-stage flex-1">{children}</div>
            <footer className="site-footer">ImageLite · Arquivo visual pessoal</footer>
        </div>
    )
}