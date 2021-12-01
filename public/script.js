// const { Socket } = require("socket.io");

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
var myVideoStream;




navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream)=>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call' , (call)=>{
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream' , (userVideoStream)=>{
            addVideoStream(video , userVideoStream);
        });
    
        call.on('error' , (err)=>{
            console.log(err);
        })
    
    });
    
    peer.on('error',(err)=>{
        console.log(err);
    });
    

}).catch((err)=>{
    console.log(err);
});




socket.on('user-connected',(userID)=>{
    connectToNewUser(userID,stream);
});


var peer = new Peer(undefined , {
    path:'/peerjs',
    host: '/',
    port: '3030'
}); 


peer.on('open',(id)=>{
    socket.emit('join-room' , roomID , id);
});

peer.on('error' , (err)=>{
    console.log(err);
});

 

const connectToNewUser = (userID,stream)=>{
    console.log(`new user connected userID: ${userID}`);
    const call = peer.call(userID , stream);        // we are calling people here
    const video = document.createElement('video');
    call.on('stream' , (userVideoStream)=>{
        addVideoStream(video , userVideoStream);
    });

    call.on('error',(err)=>{
        console.log(err);
    });

}

//function that adds video
const addVideoStream = (video , stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    });
    videoGrid.append(video);
}


