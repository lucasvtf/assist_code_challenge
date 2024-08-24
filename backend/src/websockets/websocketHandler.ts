import type http from 'http';
import type { IncomingMessage } from 'http';
import { Types } from 'mongoose';
import type IMessage from 'src/interfaces/IMessage';
import { type WebSocket, WebSocketServer } from 'ws';
import type IMessageModel from '../interfaces/IMessageModel';
import MessageService from '../services/MessageService';
import { verifyToken } from '../utils/jwt';
import { decodeTokens, parseCookieToken } from '../utils/websocketUtils';

declare module 'ws' {
  interface WebSocket {
    userId?: string;
    username?: string;
  }
}

export function setupWebSocketServer(server: http.Server) {
  const wss = new WebSocketServer({ server });
  const messageService = new MessageService();

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    try {
      const token = parseCookieToken(req.headers.cookie || '', 'token');

      if (!token) {
        ws.close();
        console.error('Token não encontrado.');
        return;
      }

      const user = verifyToken(token);

      if (!user) {
        ws.close();
        console.error('Token inválido.');
        return;
      }

      ws.userId = user.id;
      ws.username = user.username;

      ws.on('message', async (message: string) => {
        console.log(`Recebido: ${message}`);

        try {
          const parsedMessage: IMessage = JSON.parse(message);
          const { recipient, text } = parsedMessage;

          if (recipient && text) {
            const messageToDatabase: IMessageModel = {
              sender: new Types.ObjectId(ws.userId),
              recipient: new Types.ObjectId(recipient),
              text,
            };

            const messageDocument =
              await messageService.create(messageToDatabase);

            [...wss.clients]
              .filter(
                (c: WebSocket & { userId?: string }) => c.userId === recipient,
              )
              .forEach((c: WebSocket) => {
                c.send(
                  JSON.stringify({
                    text,
                    sender: ws.userId,
                    recipient,
                    id: messageDocument.id,
                  }),
                );
                console.log(`Você enviou: ${text}`);
              });
          }
        } catch (error) {
          console.error('Erro ao processar a mensagem:', error);
        }
      });

      ws.on('error', (error: Error) => {
        console.error('Erro no WebSocket:', error);
      });

      [...wss.clients].forEach((client: WebSocket) => {
        client.send(
          JSON.stringify({
            online: [...wss.clients].map((c: WebSocket) => ({
              userId: (c as any).userId,
              username: (c as any).username,
            })),
          }),
        );
      });
    } catch (error) {
      console.error('Erro durante a conexão WebSocket:', error);
      ws.close(); // Fecha a conexão em caso de erro
    }
  });
}
