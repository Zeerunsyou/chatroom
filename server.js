const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

// Create the app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Path to store the messages
const messagesFilePath = path.join(__dirname, 'messages.json');

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Load messages from the file (or an empty array if the file doesn't exist)
function loadMessages() {
  if (fs.existsSync(messagesFilePath)) {
    const data = fs.readFileSync(messagesFilePath);
    return JSON.parse(data);
  }
  return [];
}

// Save messages to the file
function saveMessages(messages) {
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
}

// When a new client connects
io.on('connection', (socket) => {
  // Send the existing messages when a new user connects
  const messages = loadMessages();
  socket.emit('load messages', messages);

  // Listen for new messages
  socket.on('chat message', (msg) => {
    // Load existing messages, add the new message, and save it
    const messages = loadMessages();
    messages.push(msg);
    saveMessages(messages);

    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
