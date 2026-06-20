import { createApp } from './app';

const port = Number(process.env.PORT ?? 3001);

createApp({ dataDir: process.env.SUVID_DATA_DIR }).listen(port, '0.0.0.0', () => {
  console.log(`SuVid is running on http://localhost:${port}`);
});
