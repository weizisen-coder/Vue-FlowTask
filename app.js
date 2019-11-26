const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

const users = require('./routers/api/user');
const profiles = require('./routers/api/profiles');
const reqsubmit = require('./routers/api/reqsubmit');
const homeflow = require('./routers/api/Homeflow/homeflow');

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
require("./config/passport")(passport)
app.get('/document/*',function(req,res){
    //console.log(req.url)
  res.sendFile(`D:${req.url}`); 	

})

//中间件 加载 user路由
app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/reqsubmit", reqsubmit);
app.use("/api/home", homeflow);

//端口
app.listen('3001',"10.1.6.14",() => {
    console.log('服务器已启动在3001端口')
})