import express from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middlewares/errorMiddleware';
import userRoutes from './routers/UserRoutes';

const app = express();

app.use(express.json());

app.use(morgan('tiny'));

app.use(helmet());

app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(userRoutes);

app.use(errorHandler);

export default app;
