'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@utils/cn';

const navVariants = cva('flex', {
  variants: {
    intent: {
      header: 'hidden lg:block',
      mobileMenu: 'flex',
      footer: 'relative flex py-[22px]',
    },
  },
  defaultVariants: {
    intent: 'header',
  },
});

const ulVariants = cva(
  'flex font-inter font-medium uppercase text-[12px] text-primary',
  {
    variants: {
      intent: {
        header: 'gap-[50px] items-center',
        mobileMenu: 'flex-col gap-[50px]',
        footer: 'flex-col text-secondary gap-[44px] md:gap-[22px]',
      },
    },
    defaultVariants: {
      intent: 'header',
    },
  }
);

const linkActiveVariants = cva('', {
  variants: {
    intent: {
      header: 'rounded-[6px] bg-primary p-2 text-secondary',
      mobileMenu: 'rounded-[6px] bg-primary p-2 text-secondary',
      footer: '',
    },
  },
});

const linkVariants = cva('', {
  variants: {
    intent: {
      header: 'bg-transparent text-primary',
      mobileMenu: 'bg-transparent text-primary',
      footer: '',
    },
  },
});

type NavbarProps = VariantProps<typeof navVariants> &
  VariantProps<typeof ulVariants>;

const Navbar = ({ intent }: NavbarProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  const links = [
    { href: '/all-products', label: t('NavBar.AllProducts') },
    { href: '/sell-to-us', label: t('NavBar.SellToUs') },
    { href: '/about-us', label: t('NavBar.AboutUs') },
    { href: '/contact-us', label: t('NavBar.ContactUs') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className={cn(navVariants({ intent }))}>
      <ul className={cn(ulVariants({ intent }))}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                isActive(href)
                  ? linkActiveVariants({ intent })
                  : linkVariants({ intent })
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
