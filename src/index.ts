import { Hono } from 'hono';
import clothesRoutes from './routes/clothesRoutes';
import { config } from 'dotenv';
import { serve } from 'bun';

config(); // Import dotenv module

const app = new Hono();

app.route('/clothes', clothesRoutes);

app.get('/', (c) => c.text('Sagara Tech Test Interview'));

serve({
  fetch: app.fetch,
  port: 8787,
})