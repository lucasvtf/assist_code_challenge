import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routers/UserRoutes';
import errorHandler from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());

app.use(morgan('tiny'));

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(userRoutes);

app.use(errorHandler);

export default app;
