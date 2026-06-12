"use client";

import { usePathname } from "next/navigation";

// Iconografia do brand: monoline 1.6, cantos suaves, nunca preenchidos.
function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
      <path d="M17 6.5a3 3 0 0 1 0 5M21 20c0-2.6-1.4-4.2-3.5-4.8" />
    </svg>
  );
}

function BoardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="6" height="16" rx="1.5" />
      <rect x="14" y="4" width="6" height="10" rx="1.5" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l8-8 9 1 1 9-8 8z" />
      <circle cx="15.5" cy="8.5" r="1.4" />
    </svg>
  );
}

const TABS = [
  { href: "/", label: "Início", Icon: HomeIcon },
  { href: "/clientes", label: "Clientes", Icon: UsersIcon },
  { href: "/pedidos", label: "Pedidos", Icon: BoardIcon },
  { href: "/catalogo", label: "Catálogo", Icon: TagIcon },
];

export function AppShell({
  title,
  action,
  avatarLetter = "G",
  children,
}: {
  title: string;
  action?: React.ReactNode;
  avatarLetter?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="sticky top-0 z-20 border-b border-[#1c2a21] bg-bar">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-serif text-[22px] font-bold leading-none text-gold">
              GMF
            </span>
            <h1 className="text-[17px] font-bold leading-none tracking-tight text-ink">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {action}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-[#08130c]">
              {avatarLetter}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-5 sm:px-6">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#1c2a21] bg-bar">
        <div className="mx-auto flex max-w-3xl items-stretch justify-around">
          {TABS.map(({ href, label, Icon }) => {
            const ativo =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <a
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 px-4 pb-3 pt-2.5 text-[10px] transition ${
                  ativo
                    ? "font-semibold text-brand"
                    : "font-medium text-[#6c756b] hover:opacity-75"
                }`}
              >
                <Icon />
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
