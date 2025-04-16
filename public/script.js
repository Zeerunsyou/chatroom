const socket = io(); // Connect to the server

let username = ''; // Variable to store the username

// Check if a username is already saved in localStorage
window.addEventListener('load', function () {
  const savedUsername = localStorage.getItem('username');
  if (savedUsername) {
    username = savedUsername;

    // Update the UI to reflect the saved username
    document.getElementById('username').value = username;
    document.getElementById('message').disabled = false; // Enable message input
    document.getElementById('send-button').disabled = false; // Enable send button
    document.getElementById('username').disabled = true; // Disable username input after setting
    document.getElementById('set-username').disabled = true; // Disable the set button
    document.getElementById('change-username').disabled = false; // Enable the change username button
  }
});

// Set username when the "Set Username" button is clicked
document.getElementById('set-username').addEventListener('click', function () {
  const usernameInput = document.getElementById('username');
  const enteredUsername = usernameInput.value.trim();

  if (enteredUsername) {
    username = enteredUsername;

    // Save the username to localStorage
    localStorage.setItem('username', username);

    document.getElementById('message').disabled = false; // Enable message input
    document.getElementById('send-button').disabled = false; // Enable send button
    document.getElementById('username').disabled = true; // Disable username input after setting
    document.getElementById('set-username').disabled = true; // Disable the set button
    document.getElementById('change-username').disabled = false; // Enable the change username button
    alert('Username set to: ' + username);
  } else {
    alert('Please enter a valid username.');
  }
});

// Allow the user to change their username
document.getElementById('change-username').addEventListener('click', function () {
  // Reset the saved username in localStorage
  localStorage.removeItem('username');

  // Clear the current username and re-enable input fields
  username = '';
  document.getElementById('username').value = '';
  document.getElementById('username').disabled = false; // Enable username input
  document.getElementById('set-username').disabled = false; // Enable set button
  document.getElementById('message').disabled = true; // Disable message input until username is set
  document.getElementById('send-button').disabled = true; // Disable send button until username is set
  document.getElementById('change-username').disabled = true; // Disable the change username button until set

  alert('Username has been reset. Please enter a new username.');
});

document.getElementById('send-button').addEventListener('click', function () {
  const messageInput = document.getElementById('message');
  const message = messageInput.value.trim();

  if (message && username) {
    // Send the message with the username to the server
    socket.emit('chat message', `${username}: ${message}`);

    // Clear the input field
    messageInput.value = '';
  }
});

document.getElementById('message').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    document.getElementById('send-button').click();
  }
});

// Listen for new messages and add them to the chat
socket.on('chat message', function (msg) {
  const chatBox = document.getElementById('chat-box');
  const newMessage = document.createElement('div');
  newMessage.textContent = msg;
  newMessage.style.padding = '5px';
  newMessage.style.borderRadius = '4px';
  newMessage.style.marginBottom = '5px';
  newMessage.style.backgroundColor = '#d1e7dd';
  chatBox.appendChild(newMessage);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
});

// Load all previous messages when the page loads
socket.on('load messages', function (messages) {
  const chatBox = document.getElementById('chat-box');
  messages.forEach(msg => {
    const newMessage = document.createElement('div');
    newMessage.textContent = msg;
    newMessage.style.padding = '5px';
    newMessage.style.borderRadius = '4px';
    newMessage.style.marginBottom = '5px';
    newMessage.style.backgroundColor = '#d1e7dd';
    chatBox.appendChild(newMessage);
  });
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
});
