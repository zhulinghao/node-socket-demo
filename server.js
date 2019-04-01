const http = require('http');
// const mysql = require('mysql');
const UUID = require('uuid');
// MySQL 的连接信息
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'node_study'
// });
// 开始连接
// connection.connect();
// 引入 http 模块：http 是提供 Web 服务的基础
// const url = require("url");
// const qs = require("querystring");

const server = http.createServer(function (req, res) {
  // 设置 cors 跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 设置 header 类型
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // 跨域允许的请求方式
  res.setHeader('Content-Type', 'application/json');

  /*
  if (req.method == "POST") { // 接口 POST 形式
    let pathName = req.url;
    let tempResult = "";
    // 数据接入中
    req.addListener("data", function (chunk) {
      tempResult += chunk;
    });
    // 数据接收完成
    req.addListener("end", function () {
      var result = JSON.stringify(qs.parse(tempResult));
      if (pathName == "/sendMessage") { // 提交留言信息

      } else if (pathName == "/login") { // 登录

      } else if (pathName == "/register") { // 注册

      }
      // 接口信息处理完毕
    })
    // 数据接收完毕
  } else if (req.method == "GET") { // 接口 GET 形式
    let pathName = url.parse(req.url).pathname;
    if (pathName == "/getMessage") {

    } else if(pathName == "/") { // 首页
      res.writeHead(200, {
        "Content-Type": "text/html;charset=UTF-8"
      });
      res.write('');
      res.end();
    }
  }
  */
});
let items = [];
let users = [];


const io = require('socket.io')(server);
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    if(socket.uid) {
      users = users.filter(item => item.id !== socket.uid);
      io.emit('getUser', users);
      io.emit('message', `${socket.uname}离开了房间`);
    }
  });

  socket.on('addUser', (data) => {
    const id = UUID.v1();
    socket.uid = id;
    socket.uname = data.uname;
    users.push({id, ...data});
    io.emit('getUser', users);
    io.emit('message', `${socket.uname}来到了房间`);
  });

  socket.on('addChat', (data) => {
    const id = UUID.v1();
    items.push({id, ...data});
    io.emit('getList', items);
  });

  socket.emit('getList', items);

  socket.emit('getUser', users);
})
server.listen(12345);

console.log('app server run in http://localhost:12345')