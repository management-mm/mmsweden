/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '15px',
      screens: {
        sm: '360px',
        md: '768px',
        lg: '1178px',
      },
    },
    screens: {
      sm: '360px',
      md: '768px',
      lg: '1178px',
    },
    extend: {
      screens: {
        'retina-mobile': {
          raw: '(min-device-pixel-ratio: 2) and (max-width: 767px)',
        },
        'retina-tablet': {
          raw: '(min-device-pixel-ratio: 2) and (min-width: 768px)',
        },
        'retina-desktop': {
          raw: '(min-device-pixel-ratio: 2) and (min-width: 1200px)',
        },
      },
      backgroundImage: {
        'check-icon': "url('@assets/images/check.svg')",
        'hero-mobile-1x':
          "linear-gradient(90deg,rgba(0, 32, 59, 0.88) 0%,rgba(0, 87, 161, 0.3872) 100%), url('@assets/images/heros/mobile-home-bg.webp')",
        'hero-tablet-1x':
          "linear-gradient(90deg,rgba(0, 32, 59, 0.88) 0%,rgba(0, 87, 161, 0.3872) 100%), url('@assets/images/heros/tablet-home-bg.webp')",
        'hero-desktop-1x':
          "linear-gradient(90deg,rgba(0, 32, 59, 0.88) 0%,rgba(0, 87, 161, 0.3872) 100%), url('@assets/images/heros/desktop-home-bg.webp')",
        'hero-mobile-2x':
          "linear-gradient(90deg,rgba(0, 32, 59, 0.88) 0%,rgba(0, 87, 161, 0.3872) 100%), url('@assets/images/heros/mobile-home-bg@2x.webp')",
        'hero-tablet-2x':
          "linear-gradient(90deg,rgba(0, 32, 59, 0.88) 0%,rgba(0, 87, 161, 0.3872) 100%), url('@assets/images/heros/tablet-home-bg@2x.webp')",
        'hero-desktop-2x':
          "linear-gradient(90deg,rgba(0, 32, 59, 0.88) 0%,rgba(0, 87, 161, 0.3872) 100%), url('@assets/images/heros/desktop-home-bg@2x.webp')",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
      },
      backgroundColor: {
        primary: 'rgba(0, 32, 59, 1)',
        accent: 'rgb(253, 198, 47)',
        // secondaryAccent: '#00203B',
        secondaryAccent: 'rgba(0, 75, 135, 1)',
        secondary: 'rgb(234, 241, 248)',
        main: 'rgba(252,252,252,1)',
      },
      colors: {
        accent: 'rgb(253, 198, 47)',
        secondaryAccent: 'rgba(0, 75, 135, 1)',
        primary: 'rgba(0, 32, 59, 1)',
        title: 'rgba(34, 34, 34, 1)',
        secondary: 'rgba(246,246,246,1)',
        desc: 'rgba(102, 102, 102, 1)',
        secondaryDesc: 'rgba(252,252,252,0.6)',
        longDesc: '#222222',
      },
      boxShadow: {
        openMobileMenuShadow: '0px 0px 0px 100vw rgba(0, 36, 66, 0.48)',
        closeMobileMenuShadow: '0px 0px 0px 100vw rgba(0, 36, 66, 0)',
        accent: '4px 4px 14px 0px rgba(253, 198, 47, 0.64)',
        card: '4px 4px 16px 0px rgba(52, 109, 155, 0.12)',
      },
      transitionProperty: {
        right: 'right',
        boxShadow: 'box-shadow',
        height: 'height',
      },
      content: {},
      borderColor: {
        accent: 'rgb(253, 198, 47)',
        primary: 'rgba(0, 32, 59, 1)',
        secondary: 'rgba(0, 0, 0, 0.06)',
        neutral: 'rgba(102, 102, 102, 0.2)',
        line: 'rgba(0, 32, 59, 0.2)',
        footerLine: 'rgba(246, 246, 246, 0.2)',
      },
    },
  },
  plugins: [],
};
