import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3001',
  webUrl: process.env.WEB_URL || 'http://localhost:3000',
}));
