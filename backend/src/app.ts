import http from 'http';
import express from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { WebSocket, Server as WebSocketServer } from 'ws';
import errorHandler from './middlewares/errorMiddleware';
import userRoutes from './routers/UserRoutes';
import { setupWebSocketServer } from './websockets/websocketHandler';

const app = express();
const server = http.createServer(app);

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

setupWebSocketServer(server);

export { app, server };
