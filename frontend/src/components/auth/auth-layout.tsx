import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  reverse?: boolean; 
}

export function AuthLayout({
  children,
  imageUrl = 'https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?auto=format&fit=crop&q=80&w=1000',
  imageAlt = 'Authentication background',
  reverse = false,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="flex w-full max-w-5xl flex-col md:flex-row bg-white rounded-[2rem] shadow-xl border border-gray-100 p-2 md:p-3">
        <div
          className={`flex w-full flex-col justify-center p-6 sm:p-10 md:w-1/2 lg:p-12 ${
            reverse ? 'md:order-last' : 'md:order-first'
          }`}
        >
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-10 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
                W
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-800">WebGlow</span>
            </div>

            {children}
          </div>
        </div>

        <div className="relative hidden w-full md:block md:w-1/2">
          <img
            className="absolute inset-0 h-full w-full rounded-[1.5rem] object-cover shadow-inner"
            src={imageUrl}
            alt={imageAlt}
          />
        </div>
      </div>
    </div>
  );
}
