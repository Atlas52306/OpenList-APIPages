import {serveStatic} from 'hono/cloudflare-workers' // @ts-ignore
import manifest from '__STATIC_CONTENT_MANIFEST'
import * as index from './index'

// Handle event.js specifically
index.app.get('/static/event.js', async (c) => {
  // Read the original event.js content
  const originalEventJs = await c.env.__STATIC_CONTENT.get('static/event.js');

  if (!originalEventJs) {
    return c.notFound();
  }

  // Replace the hardcoded URL with the dynamic MAIN_URLS
  const modifiedEventJs = originalEventJs.replace(
    'https://api.oplist.org',
    `https://${c.env.MAIN_URLS}`
  );

  return c.text(modifiedEventJs, 200, {
    'Content-Type': 'application/javascript',
  });
});

index.app.use("*", serveStatic({manifest: manifest, root: "./"}));


export default index.app
