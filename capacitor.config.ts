import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.edublo.calendapp',
  appName: 'calendApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
