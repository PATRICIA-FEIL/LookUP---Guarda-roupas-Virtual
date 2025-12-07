import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Navigation } from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LookUp - Guarda-Roupas Digital',
  description: 'Crie looks personalizados e organize seu estilo com inteligência artificial',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
            <Navigation />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}