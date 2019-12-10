const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const users = require('./routers/api/user');
const profiles = require('./routers/api/profiles');
const reqsubmit = require('./routers/api/reqsubmit');
const homeflow = require('./routers/api/Homeflow/homeflow');
const develop = require('./routers/api/develop');
const test = require('./routers/api/test');

//DB config
const db = require("./config/keys").mongoURL;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//连接数据库
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('数据库连接成功')
}).catch(err => {
    console.log(err)
})
//passport 初始化
app.use(passport.initialize());
require("./config/passport")(passport);






app.get('/document/*', function (req, res) {
    //console.log(req.url)
    res.sendFile(`D:${req.url}`);

})

//中间件 加载 user路由
app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/reqsubmit", reqsubmit);
app.use("/api/home", homeflow);
app.use("/api/develop", develop);
// app.use("/api/test", test);
let sum = [];
io.on('connection', (socket) => {
    console.log('一个用户连接了')
    let UserSocketID = socket.id;
    socket.on('users', data => {
        sum.push({
            indexId: UserSocketID,
            name: data
        });
        io.emit('users', sum);
    })
    //disconnnect断开,自带函数方法
    socket.on('disconnect', data => {
        // console.log(data)
        console.log('用户断开了');
            sum = sum.filter(v=>{
            return v.indexId!=UserSocketID
        });
        io.emit('users', sum); //将消息发送给所有人。
    })
    socket.on('logout', data => {
        console.log(data)
        console.log('用户断开了');
            sum = sum.filter(v=>{
            return v.indexId!=UserSocketID
        });
        io.emit('users', sum); //将消息发送给所有人。
    })
    // let UserSocketID = socket.id;
    // socket.on('users', (data) => {
    //     sum.push({
    //         indexId:UserSocketID,
    //         name:data
    //     });
    //     io.emit('users', sum);

    // })
    // socket.on('disconnect', data => {
    //     console.log('用户断开了');
    //     console.log(sum)
    //     sum = sum.filter(v=>{
    //         return v.indexId!=UserSocketID
    //     });
    //     io.emit('users', sum); //将消息发送给所有人。
    // })

});
//端口
server.listen('3001', "10.1.6.14", () => {
    console.log('服务器已启动在3001端口')
})