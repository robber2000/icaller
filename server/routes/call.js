var express = require('express');
var router = express.Router();
const execa = require('execa');
var path = require('path');
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("call", req.query,)
  //play.sound('./public/start.wav');
  var start_vbs = path.join(path.resolve('.'), 'public', 'vbscript', 'start.vbs')
  var voice_vbs = path.join(path.resolve('.'), 'public', 'vbscript', 'voice.vbs')
  var wav = path.join(path.resolve('.'), 'public', 'vbscript', 'start.wav')

  //播放开始提醒
  execa('wscript', [start_vbs, wav]).then(res => {
    console.log(start_vbs, "sss")
  }).catch(e => { console.log(e) });

  //播放语音
  var timer = setTimeout(function () {
    execa('wscript', [voice_vbs, req.query.name]).then(res => {
    }).catch(e => { console.log(e) });
  }, 2200);
  res.send("ok")


});

module.exports = router;
