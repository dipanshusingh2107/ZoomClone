const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4:uuidv4} = require('uuid'); // equivalent to uuidv4 =  uuid.v4 ES6 destructuring assignment
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server , {debug: true});   //Creating Peer Server
PORT = 3030 || global.env.PORT;


// app.listen(PORT, ()=> {
//     console.log(`Server is listing at ${PORT}`);
//   });

app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/peerjs' , peerServer);

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room' ,(req,res)=>{
    res.render('room',{roomID: req.params.room});
});


io.on('connection' , (socket)=>{
    socket.on('join-room',(roomID , userID)=>{
        console.log(`Room Joined roomID ${roomID}`);
        socket.join(roomID);
        socket.to(roomID).emit('user-connected',userID);
    });
});

server.listen(PORT , ()=>{
    console.log(`Server is listing at ${PORT}`);
});