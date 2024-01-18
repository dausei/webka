const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3700;

app.use(express.static('mychat'));

app.get('/', (req, res) => {
  res.send('hi');
});

app.get('/json', (req, res) => {
  res.json({ text: 'hi', numbers: [1, 2, 3] });
});

app.get('/echo', (req, res) => {
  const input = req.query.input || '';
  const normal = `Normal: ${input}`;
  const shouty = `Shouty: ${input.toUpperCase()}`;
  const charCount = `Character Count: ${input.length}`;
  const backwards = `Backwards: ${input.split('').reverse().join('')}`;

  res.json({ normal, shouty, charCount, backwards });
});

app.get('/chat', (req, res) => {
  const message = req.query.message || '';
  io.emit('message', message);
  res.send('Message sent successfully');
});

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  const sendMessage = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  io.on('connection', (socket) => {
    socket.on('message', (data) => {
      sendMessage('message', data);
    });
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
