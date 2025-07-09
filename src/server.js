import 'dotenv/config.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import usersRouter from './routers/users.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

const swaggerDocument = JSON.parse(
  readFileSync(new URL('../docs/swagger.json', import.meta.url)),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(cookieParser());

app.use('/contacts', contactsRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
