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
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      fontFamily: {
        inter: ['inter', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
      },
      backgroundColor: {
        primary: 'rgba(0, 32, 59, 1)',
        accent: 'rgb(253, 198, 47)',
        secondaryAccent: '#00203B',
        secondary: 'rgb(234, 241, 248)',
        main: 'rgba(252,252,252,1)',
      },
      colors: {
        accent: 'rgb(253, 198, 47)',
        secondaryAccent: 'rgba(0, 75, 135, 1)',
        primary: 'rgba(0, 32, 59, 1)',
        title: 'rgba(34, 34, 34, 1)',
        secondaryTitle: 'rgba(0, 75, 135, 1)',
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
      },
      content: {},
      borderColor: {
        accent: 'rgb(253, 198, 47)',
        primary: 'rgba(0, 32, 59, 1)',
        secondary: 'rgba(0, 0, 0, 0.06)',
        line: 'rgba(0, 32, 59, 0.2)',
        footerLine: 'rgba(246, 246, 246, 0.2)',
      },
    },
  },
  plugins: [],
};
