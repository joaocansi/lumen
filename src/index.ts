import 'dotenv/config';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import { auth } from './auth/better-auth.js';

const app = new Hono();
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
