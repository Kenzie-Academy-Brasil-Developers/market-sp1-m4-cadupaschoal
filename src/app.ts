import express, { Application } from 'express';
import {
  verifyIfNameExist,
  VerifyIfIdExists,
  updateVerifyIfIdeExists,
  updateVerifyIfNameExists,
  verifyUpdateBody,
} from './middlewares';
import { create, retrieve, retireveById, update, erase } from './logics';

const app: Application = express();
app.use(express.json());

const PORT: number = 3000;
const runningMsg: string = 'Server is running';
app.listen(PORT, () => console.log(runningMsg));

app.post('/products', verifyIfNameExist, create);

app.get('/products', retrieve);

app.get('/products/:id', VerifyIfIdExists, retireveById);

app.patch(
  '/products/:id',
  updateVerifyIfIdeExists,
  verifyUpdateBody,
  updateVerifyIfNameExists,
  update
);

app.delete('/products/:id', VerifyIfIdExists, erase);
