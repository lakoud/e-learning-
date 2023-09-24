import userRoutes from './routes/userRoutes.js'
import infoRoutes from './routes/infoRoute.js'
import ensgRoute from './routes/ensgRoute.js'
import eleveRoute from './routes/eleveRoute.js'
import formationRoute from './routes/formationRoute.js'
import coursRoute from './routes/coursRoute.js'
import parentRoute from './routes/parentRoute.js'

import categorieRoute from './routes/categorieRoute.js'
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import cors from 'cors';
import { Server } from 'socket.io';

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

const httpServer = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

// Socket.io setup using the http server
const io = new Server(httpServer, {
    cors: {
      origin: "*",

    },

  });




connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Your routes go here...

app.get('/', (req, res) => res.send('Server is ready'));

app.use('/api/users', userRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/ensg', ensgRoute);
app.use('/api/eleve', eleveRoute);
app.use('/api/formation', formationRoute);
app.use('/api/cours', coursRoute);
app.use('/api/categorie', categorieRoute);
app.use('/api/parent', parentRoute);

app.use(notFound);
app.use(errorHandler);
app.set('io', io);
