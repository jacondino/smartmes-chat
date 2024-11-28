import express, { Application } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

class App {
  private app: Application;
  private http: http.Server;
  private io: Server;
  private users: Map<number, string>;

  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new Server(this.http, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    this.users = new Map();
    this.listenSocket();
    this.setupRoutes();
  }

  listenServer() {
    this.http.listen(3001, () => console.log(`Server is running on http://localhost:3001`));
  }

  listenSocket() {
    this.io.on('connection', (socket: Socket) => {
      console.log('User connected =>', socket.id);

      socket.on('register', (userId: string) => {
        const registeredUser = JSON.parse(userId)
        const registeredUserId = registeredUser.user
      
        this.users.set(registeredUserId as number, socket.id);
      });
      
      socket.on('message', async (data) => {
        console.log('Message received:', data);
        
        const { to, from, content } = JSON.parse(data);;
        console.log(`Attempting to send message to: ${to}`);
      
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
app.listenServer();
