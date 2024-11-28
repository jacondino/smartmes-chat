import express, { Application } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import 'reflect-metadata';
import { AppDataSource, initializeDataSource } from './datasource'; // Importa o DataSource do banco
import { Message } from './entities/Message';

class App {
  private app: Application;
  private http: http.Server;
  private io: Server;
  private users: Map<number, string>;
  private port: number;

  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new Server(this.http, {
      cors: {
        origin: "http://localhost:3000", // Ajuste conforme sua aplicação frontend
        methods: ["GET", "POST"],
      },
    });
    this.users = new Map();
    this.port = 3001;
    this.listenSocket();
    this.setupRoutes();
  }

  listenServer() {
    this.http.listen(this.port, () => console.log(`Server is running on http://localhost:${this.port}`));
  }

  listenSocket() {
    this.io.on('connection', (socket: Socket) => {
      console.log('User connected =>', socket.id);
      
      socket.on('register', (userId: string) => {
        const registeredUser = JSON.parse(userId);
        this.users.set(Number(registeredUser.user), socket.id);
      });
      
      socket.on('message', async (data) => {
        console.log('Message received:', data);
        
        const { to, from, content, type } = JSON.parse(data);
        console.log(`Attempting to send message to: ${to}`);
        console.log(this.users)
        const recipientSocketId = this.users.get(Number(to));
        console.log(`Recipient Socket ID: ${recipientSocketId}`);
      
        if (recipientSocketId) {
          const message: WebSocketMessage = {
            type: "message",
            to: to as string,
            from: from,
            content,
          };
          this.io.to(recipientSocketId).emit('message', JSON.stringify(message));

          const messageRepository = AppDataSource.getRepository(Message);
          const newMessage = new Message(to, from, content, type);

          try {
            await messageRepository.save(newMessage);
            console.log('Message saved to database:', newMessage);
          } catch (error) {
            console.error('Error saving message to database:', error);
          }

        } else {
          console.log(`User ${to} is not connected`);
        }
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const [userId, socketId] of this.users.entries()) {
          if (socketId === socket.id) {
            this.users.delete(userId);
            console.log(`User ${userId} removed from active connections`);
            break;
          }
        }
      });
    });
  }

  setupRoutes() {
    this.app.get('/', (req, res) => {
      res.send('Socket.io Chat Server');
    });
  }
}

interface WebSocketMessage {
  type: string;
  user?: string;
  to?: string;
  from?: string;
  content?: string;
}

const app = new App();
initializeDataSource().then(() => {
  app.listenServer();
});
