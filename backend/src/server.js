import 'dotenv/config';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/', (_request, response) => {
  response.json({
    name: 'KisanSetu API',
    status: 'running'
  });
});

app.listen(port, () => {
  console.log(`KisanSetu API listening on port ${port}`);
});
