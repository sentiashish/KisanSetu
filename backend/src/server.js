import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'node:url';

export const app = express();
const port = Number(process.env.PORT || 3000);
const currentFilePath = fileURLToPath(import.meta.url);

app.use(express.json());

app.get('/', (_request, response) => {
  response.json({
    name: 'KisanSetu API',
    status: 'running'
  });
});

if (process.argv[1] === currentFilePath) {
  app.listen(port, () => {
    console.log(`KisanSetu API listening on port ${port}`);
  });
}
