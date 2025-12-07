import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, User, Wardrobe, Sparkles } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/profile', label: 'Perfil', icon: User },
    { href: '/wardrobe', label: 'Guarda-Roupas', icon: Wardrobe },
    { href: '/generate', label: 'Gerar Looks', icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:relative md:bottom-auto md:border-t-0 md:border-b md:p-6">
      <div className="flex justify-around md:justify-start md:space-x-8">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Button
              variant={pathname === href ? 'default' : 'ghost'}
              className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2"
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs md:text-sm">{label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}