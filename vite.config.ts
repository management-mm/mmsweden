import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@router': '/src/router',
      '@store': '/src/store',
      '@utils': '/src/utils',
      '@enums': '/src/enums',
      '@hooks': '/src/hooks',
      '@constants': '/src/constants',
      '@i18n': '/src/i18n',
    },
  },
});
