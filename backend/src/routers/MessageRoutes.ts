import { Router } from 'express';
import MessageController from '../controllers/MessageController';

const messageRoutes = Router();

messageRoutes.get('/messages/:userId', (req, res, next) =>
  new MessageController(req, res, next).getAllMessagesById(),
);

export default messageRoutes;
