import 'reflect-metadata';

import * as express from 'express';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello');
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap().catch(console.error);
