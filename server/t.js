import io from 'socket.io-client'
let socket = io("ws://127.0.0.1:3000"); // 建立链接
// 此时会触发后台的connect事件
socket.on('login', function (data) { // 监听服务端的消息“msg”
  socket.emit('login', { username: "fine,thank you", password: 'pass' }); //向服务器发送消息
  console.log(data);
});

module.exports = soc;