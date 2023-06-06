const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const {addUser , deleteUser , getUser , getUserById, getUserInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');
const app = express();
app.use(cors()); // Configure CORS here

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: '*',
    },
  });
  

io.on('connection', (socket) => {
  socket.on('join' , ({name , room} , callback)=>{
    const data = addUser({id:socket.id , name:name , room:room});
    
    const user = data.user;
    const error = data.error;

    if(error) {
      return callback(error);
    }

    socket.join(user.room);
    
    socket.emit('message' , {user: 'admin' , text : `${user.name}, Welcome to ${user.room}`});
    socket.broadcast.to(user.room).emit('message' , {user: 'admin' , text : `${user.name} has joined`});

    io.to(user.room).emit('roomData' , {room:user.room , users: getUserInRoom(user.room)});
    
    callback();
  })

  socket.on('sendMessage' , (message , callback)=>{
    const user = getUser(socket.id);

    io.to(user.room).emit('message' , {user : user.name , text: message});
    io.to(user.room).emit('roomData' , {room : user.room , text: message});


    callback();
  });

  socket.on('disconnect' , () =>{
    const user = deleteUser(socket.id);
    if(user){
      io.to(user.room).emit('message' , {user : 'admin' , text: `${user.name} has left.`});
    }
  })
});

app.use(router);

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
