import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

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
  const { t } = useTranslation();
  return (
    <nav className={cn(navVariants({ intent }))}>
      <ul className={cn(ulVariants({ intent }))}>
        <li>
          <NavLink
            to="all-products"
            className={({ isActive }) =>
              cn(
                isActive
                  ? linkActiveVariants({ intent })
                  : linkVariants({ intent })
              )
            }
          >
            {t('NavBar.AllProducts')}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="sell-to-us"
            className={({ isActive }) =>
              cn(
                isActive
                  ? linkActiveVariants({ intent })
                  : linkVariants({ intent })
              )
            }
          >
            {t('NavBar.SellToUs')}
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              cn(
                isActive
                  ? linkActiveVariants({ intent })
                  : linkVariants({ intent })
              )
            }
            to="about-us"
          >
            {t('NavBar.AboutUs')}
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              cn(
                isActive
                  ? linkActiveVariants({ intent })
                  : linkVariants({ intent })
              )
            }
            to="contact-us"
          >
            {t('NavBar.ContactUs')}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
