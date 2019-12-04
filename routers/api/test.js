const express = require('express');
const router = express.Router();
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

router.get('/',(req,res)=>{
    io.on('connection', function (socket) {
        console.log('建立链接')
        socket.on('wzsttt', (data) => {
            console.log(data)
            socket.emit('www', 'oooo')
        })
    });
})

module.exports = router

