"use client";

import { usePathname } from "next/navigation";

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" />
      <path d="M16 5.5a3 3 0 1 1 0 5.5" />
      <path d="M18 15c2 .6 3.2 2 3.7 4.5" />
    </svg>
  );
}

function BoardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="5.5" height="16" rx="1.5" />
      <rect x="11" y="4" width="5.5" height="10" rx="1.5" />
      <rect x="19" y="4" width="2" height="7" rx="1" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12V4h8l10 10-8 8L3 12Z" />
      <circle cx="8" cy="9" r="1.5" />
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
      <header className="sticky top-0 z-20 border-b border-edge/60 bg-bar">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-base font-bold tracking-widest text-gold">
              GMF
            </span>
            <h1 className="text-base font-semibold tracking-tight text-ink">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {action}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
              {avatarLetter}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-5 sm:px-6">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-edge/60 bg-bar">
        <div className="mx-auto flex max-w-3xl items-stretch justify-around">
          {TABS.map(({ href, label, Icon }) => {
            const ativo =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <a
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 px-4 py-2.5 text-[11px] transition ${
                  ativo ? "text-brand" : "text-mute hover:text-ink"
                }`}
              >
                <Icon />
                <span>{label}</span>
                <span
                  className={`h-1 w-1 rounded-full ${
                    ativo ? "bg-brand" : "bg-transparent"
                  }`}
                />
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
