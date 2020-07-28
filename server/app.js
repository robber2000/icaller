/**
 * 基于nodejs+express医院叫号软件
 * 
 * 溪南卫生院 服务器地址  192.168.1.200:8888
 */
var express = require('express')
var app = express();
var path = require('path');
var bodyParser = require('body-parser');


var http = require('http').createServer(app);
var io = require('socket.io')(http);

//应用工具包
var cors = require('cors')
var old = {}
var form = {
  hosptial: '溪南中心卫生院',
  queue: [
  ],
  miss: [],

  window: [
    { num: 1, name: '马明哲克' },
  ]
}

app.set('trust proxy', true);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(cors())
app.use(bodyParser.json());// 添加json解析
app.use(bodyParser.urlencoded({ extended: false }));

//大屏页面
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static('public'));


app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  //res.header("Content-Type",    "application/json;charset=utf-8");
  next();
});


//获取数据
//var indexRouter = require('./routes/index');
//app.use('/importdata', indexRouter);
app.post("/importdata", function (req, res, next) {
  //console.log(req.body.name, "impotdaat", form)
  let news = {
    name: req.body.name,
    create: new Date() + ""
  }
  if (news.name != old.name) {
    form.queue.push({
      name: req.body.name,
      create: new Date() + ""
    })
    old = news
    io.emit("customer", { form: form })
    console.log(new Date(), '\t【新病人排队】');
  }
  res.send("ok")
})



//取药叫号 
var callRouter = require('./routes/call');
app.use('/call', callRouter);



io.on('connect', function (socket) {
  //接受消息 
  console.log(new Date(), '\t【用户加入】');
  io.emit("customer", { form: form })
  socket.on("customer", function (obj) {
    console.log(new Date(), '\t【用户加入】', old, obj);
    form.queue.push({ create: new Date() + "", name: obj.name })
    io.emit("customer", { form: form })
  });
  socket.on("call", function (obj) {
    //仅是改变大屏的当前人，未实际改变用户队列
    //与 /call 不同  
    form.window = obj
    console.log(new Date(), '\t【呼叫用户】', obj.name, obj.create);
    io.emit("customer", { form: form })

  });
  socket.on("hangup", function (obj) {
    //挂起
    console.log(new Date(), '\t【挂起用户】', obj.name, obj.create);
    let index = -1
    for (let i in form.queue) {
      if (obj.name == form.queue[i].name && obj.create == form.queue[i].create) {
        console.log("o", obj.name, obj.create, form.queue[i].name)
        index = i
        form.window = obj
        break
      }
    }
    if (index >= 0) {
      form.queue.splice(index, 1)
    }
    form.miss.push(obj)
    console.log(form.miss, "form.miss")
    io.emit("customer", { form: form })
  });

  socket.on("reduce miss", function (obj) {
    console.log(new Date(), '\t【减少排队队列】', obj.name, obj.create);
    let index = -1
    for (let i in form.miss) {
      if (obj.name == form.miss[i].name && obj.create == form.miss[i].create) {
        console.log("o", obj.name, obj.create, form.miss[i].name)
        index = i
        form.window = obj
        break
      }
    }
    if (index >= 0) {
      form.miss.splice(index, 1)
    }
    io.emit("customer", { form: form })
  });
  socket.on("reduce", function (obj) {
    console.log(new Date(), '\t【减少挂起队列】', obj.name, obj.create);
    let index = -1
    for (let i in form.queue) {
      if (obj.name == form.queue[i].name && obj.create == form.queue[i].create) {
        console.log("o", obj.name, obj.create, form.queue[i].name)
        index = i
        form.window = obj
        break
      }
    }
    if (index >= 0) {
      form.queue.splice(index, 1)
    }
    io.emit("customer", { form: form })
  });
  socket.on('disconnect', function () {
    console.log(new Date(), '\t【用户退出】');
  });
});

http.listen(8888, function () {
  console.log(new Date(), '\t【服务器启动】\t端口号：8888');
});
module.exports = app;