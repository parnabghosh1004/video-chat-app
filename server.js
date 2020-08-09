const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const uuid = require('uuid')
const port = process.env.PORT || 3000

app.set('view engine',"ejs")
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.redirect(`/${uuid.v4()}`)
})

app.get('/:roomId',(req,res)=>{
    res.render('room',{roomId:req.params.roomId})
})

io.on('connection',socket => {
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)
    
        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit('user-disconnected',userId)
        })
    })
})

server.listen(port,()=>{
    console.log(`The server is running on port 3000`)
})
