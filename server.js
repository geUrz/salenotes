const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const app = express();
const server = createServer(app);
const io = new Server(server);

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.get('*', (req, res) => {
    return nextHandler(req, res);
  });

  io.on('connection', (socket) => {
    console.log('Nueva conexión:', socket.id);

    socket.on('sendNotification', (data) => {
      io.emit('receiveNotification', data);
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
