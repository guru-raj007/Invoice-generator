import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eventpro.gstinvoice',
  appName: 'EventPro GST Invoice',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
