var express = require('express');
//const { format } = require('core-js/fn/date');
var router = express.Router();


/* GET home page. */
router.post('/', function (req, res, next) {
  console.log(req.body, 'post method ok    ' + new Date(), req.body.name)
  //console.log(form, "form")
  res.send('post method ok    ' + new Date());
});

router.get('/', function (req, res, next) {
  console.log(req.query, 'get method ok    ' + new Date())
  res.send('get method ok    ' + new Date());
});

module.exports = router;
