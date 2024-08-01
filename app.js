import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';  
import { Server } from 'socket.io';  
import connectDB from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js';
import PostRoutes from './routes/PostRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import friendsRouter from './routes/friendsRoutes.js';
import ResourceRoutes from './routes/ResourcesRoutes.js';
import messages from './routes/MessagesRoute.js';
import rateLimit from 'express-rate-limit';  


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);  
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST']
  }
});

const port = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5
});

app.use(limiter);  


app.use(cors());

connectDB(DATABASE_URL);


app.use(express.json());


app.use('/api/user', userRoutes);
app.use('/api/post', PostRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/friends', friendsRouter);
app.use('/api/resources', ResourceRoutes);
app.use('/api/messages', messages);


app.use('/upload', express.static(path.join(__dirname, 'upload'))); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use('/posts', express.static(path.join(__dirname, 'posts'))); 
app.use('/users', express.static(path.join(__dirname, 'upload'))); 
app.use('/Users', express.static(path.join(__dirname, 'upload'))); 


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on('message', ({ room, message }) => {
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});


server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
