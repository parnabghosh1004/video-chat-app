const socket = io('/')
const peer = new Peer(undefined,{
  host:"/",
  port:3002
}); 

const peers = {}
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true


peer.on('open',id=>{
  socket.emit('join-room',roomId,id)
})

navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true
}).then(stream => {
    
  addVideoStream(myVideo,stream)
  socket.on('user-connected',userId=>{
    console.log("user connected",userId)
    connectToNewUser(userId,stream)
  })

  peer.on('call',call=>{
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream',newUserVideoStream=>{
      addVideoStream(video,newUserVideoStream)
  })
  })

})

socket.on('user-disconnected',userId => {
    if(peers[userId]) peers[userId].close()
})


function connectToNewUser(userId,stream){
  const call = peer.call(userId,stream)
  const newVideo = document.createElement('video')
  call.on('stream',newUserVideoStream=>{
    addVideoStream(newVideo,newUserVideoStream)
  })
  call.on('close',()=>{
    newVideo.remove()
  })

  peers[userId] = call
}

function addVideoStream(video,stream){
  video.srcObject = stream
  video.addEventListener('loadedmetadata',()=>{
    video.play()
  })
  videoGrid.append(video)
}