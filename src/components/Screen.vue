<template>
<div class="main">
  <div class="header">
    <div class="header-left-bar"></div>
    <div class="header-middle-bar">
      {{ form.hosptial }}
    </div>
    <div class="header-right-bar">
      {{ current_time }}
    </div>
  </div>

  <div class="body">
    <div class="body-left">
      <div class="body-left-row">
        <div class="body-left-title">当前呼叫</div>
      </div>
      <div class="body-left-row-80">
        <div class="left-span">{{ form.window.name }}</div>
      </div>
    </div>
    <div class="body-right">
      <div class="body-right-row">
        <span class="body-right-title">配药中,请耐心等待!</span>
      </div>
      <div class="body-right-row justify-start" v-for="(it, i) in 4" v-bind:key="i">
        <div class="right-span" v-for="(item, j) in form.queue.slice(i * 2, i * 2 + 2)" v-bind:key="j">
          
          <div class="min" v-if="item.name.length >= 5">
            <span class="min-num" v-if="form.queue.length>0 && form.queue[0].name!=''">{{i*2+j+1}}</span>
            <span class="min-name">{{ item.name.slice(0, 5)  }}</span>
          </div>
          <div v-else class="max">
             <span class="max-num" v-if="form.queue.length>0 && form.queue[0].name!=''">{{i*2+j+1}}</span> 
             <span class="max-name">{{ item.name }}</span>
          </div>
         
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <span class="footer-title">错过取药：</span>
    <div class="miss">
      <el-carousel height="100px" direction="vertical" :interval="4000"  :autoplay="true" indicator-position="none">
        <el-carousel-item v-for="item in miss" :key="item">
          <span class="miss-item" v-for="(subitem, sindex) in subQueue(item)" :key="sindex">{{ subitem }}</span>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</div>
</template>

<script>
import io from 'socket.io-client'
const socket = io('http://127.0.0.1:8888')
export default {
  name: 'Screen',
  data() {
    return {
      current_time: '',
      miss: [],
      form: {
        hosptial: '溪南中心卫生院',
        miss: [],
        queue: [],
        window: {
          create: '',
          name: '',
        },
      },
    }
  },
  mounted() {
    let that = this
    socket.on('connection', function (res) {
      console.log('sss', res)
    })
    socket.on('customer', function (res) {
      console.log(res.form.queue)
      //alert(res)
      that.form = res.form
      //that.form.window=res.form.window
      if (res.form.queue.length == 0) {
        that.form.queue = [{
          create: '',
          name: '',
        }, ]
      } else that.form.queue = res.form.queue
      console.log(that.form.miss)
      that.formatMissQueue()
    })
  },
  created() {
    this.currentTime()
  },
  destroyed() {
    
  },
  computed: {},

  methods: {
    subQueue(item) {
      
      return item.split('*')
    },
    formatMissQueue() {
      let _miss = []
      for (let i = 0; i < this.form.miss.length; i = i + 4) {
        let temp = ''
        for (let k = i; k < this.form.miss.length && k < i + 5; k++)
          temp += this.form.miss[k].name + '*'
        _miss.push(temp)
      }
      this.miss = _miss
    },
    formatTime(date) {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      return year +'年' +month +'月' + day +'日' +' ' + [hour, minute, second].map(this.formatNumber).join(':')
    },
    formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    },
    currentTime() {
      var interval = setInterval(() => {
        this.current_time = this.formatTime(new Date())
      }, 1000)
      window.console.log(interval)
    },
  },
}
</script>

<style scoped>
body {
  display: none;
  /* Chrome Safari */
  margin: 0;
  padding: 0;
  background-color: #000;
  scrollbar-width: none;
  /* firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
  overflow-x: hidden;
  overflow-y: hidden;
}

.main {
  width: 100%;
  height: 1050px;
  
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #000;;
}

.header {
  width: 100%;
  height: 80px;
  position: absolute;
  top:0;
  display: flex;
  flex-direction: row;
  background-color: #999;
  background: -webkit-gradient(linear,
      0 0,
      0 100%,
        from(rgb(90, 156, 231)),
      to(rgb(125, 170, 243)));
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

.header-left-bar {
  width: 30%;
  height: 100%;

  border-bottom-left-radius: 10px;
}

.header-middle-bar {
  width: 40%;
  height: 94%;
  left: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #0088ff;
  border-left: 5px solid #fff;
  border-right: 5px solid #fff;
  border-bottom: 5px solid #fff;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  font-size: 3em;
  font-weight: 800;
  letter-spacing: 0.2em;
  background: -webkit-gradient(linear,
      0 0,
      0 100%,
      from(rgb(17, 105, 206)),
      to(#29296b));
}

.header-right-bar {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #010157;
  font-size: 2em;
  font-weight: 600;
  border-bottom-right-radius: 10px;
}

.body {
  width: 95%;
  height: 80%;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 30px;
  padding-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top:30px;
  border-radius: 5px;
}

.body-left {
  width: 38%;
  height: 100%;
  border-radius: 15px;
  border: 5px solid #fff;
  margin-right:50px;
}

.body-left-row,
.body-left-row-80,
.body-right-row {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  color: #fff;
  background: -webkit-gradient(linear,
      0 0,
      0 100%,
      from(rgb(17, 105, 206)),
      to(rgb(41, 41, 107)));
}

.justify-start {
  justify-content: start;
}

.body-left-row-80 {
  height: 80%;
  
  background: -webkit-gradient(linear,
      0 0,
      0 100%,
      from(rgb(239, 240, 241)),
      to(rgb(232, 232, 236)));
}

.body-right-row {
  color: #000;
  background: -webkit-gradient(linear,
      0 0,
      0 100%,
      from(rgb(221, 222, 223)),
      to(rgb(232, 232, 236)));
}

.body-left-row:first-child,
.body-right-row:first-child {
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}

.body-left-row-80,
.body-left-row:last-child,
.body-right-row:last-child {
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border: 0;
}

.body-right {
  width: 60%;
  height: 100%;
  border-radius: 15px;
  border: 5px solid #fff;
}

.body-left-title,
.body-right-title {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color:#fff;

  background: -webkit-gradient(linear,
      0 0,
      0 100%,
      from(rgb(15, 119, 238)),
      to(rgb(41, 41, 100)));
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  font-size: 4em;
  line-height: 100%;
}

.body-right-title {
  background: -webkit-gradient(linear,
      0 0,
      0 100%,
      from(rgb(90, 156, 231)),
      to(rgb(125, 170, 243)));
}

.left-span,
.right-span {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4em;
  letter-spacing: 0.1em;
  
}

.min {
  width: 90%;
  font-size: 85px;
  color:rgb(6, 61, 124);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.min-num,.max-num{
  width:100px;
  height:100px;
  border-radius: 100px;
  background: #010157;
  color:#fff;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  
}
.min-name{
  color:#000;
  font-size: 75px;
}
.max {
  width: 90%;
  font-size: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color:rgb(6, 61, 124);
}
.max-name{
  color:#000;
}


.left-span {
  font-size: 120px;
  color: red;
  width: 100%;
  font-weight: 600;
}

.right-span {
  width: 50%;
}

.footer {
  width: 99%;
  height: 80px;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  background-color: #0088ff;
  background: -webkit-gradient(linear,
      0 0,
      0 100%,
      from(rgb(90, 156, 231)),
      to(rgb(125, 170, 243)));
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  color: #020290;
  font-size: 2.5em;
  
  letter-spacing: 0.2em;
  padding-left: 20px;
}

.footer-title {
  width: 300px;
  color:#fff;
}

.miss {
  height: 100%;
  width: 1600px;
  margin-right: 60px;
  margin-top: 35px;
}

.miss-item {
  margin-right: 80px;
 color:#000;
}
</style>
