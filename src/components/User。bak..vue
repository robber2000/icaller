<template>
<div class="main">
  <div class="more">

  <i class="el-icon-caret-top" @click="prevQueue"></i>
  </div>

  <div class="card" v-for="(item,index) in current" :key="index"  @click="showDialog(item)" >
    <div class="num">
      {{item.create}}
    </div>
    <div class="title">{{item.name}}</div>
  </div>
 
  <div class="more">
  <i class="el-icon-caret-bottom" @click="nextQueue"></i>
  </div>

  <el-dialog :visible.sync="dialogVisible" width="80%" center>
    <span class="cardtitle">{{item.name}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="dialogVisible = false">挂单</el-button>
      <el-button type="primary" @click="dialogVisible = false">完成</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import io from 'socket.io-client';
const socket = io('http://127.0.0.1:8888');
export default {
  name: 'User',
  data() {
    return {
      dialogVisible: false,
      websock: '',
      start:0,
      socket:{},
      smessage:"",
      item:{
        name:"",
        num:""
      },
      current:[
        ],
      queue: [
       
      ],

    }
  },
  computed:{
  
  },
  mounted() {
    let that=this
    socket.on('connection', function (res) {
      that.current=res.form.queue
      console.log("sss", res)
    });
    socket.on("customer", function (res) {
     //接收当前用户队列
      let temp=[]
      for(let i in res.form.queue){
        console.log(res.form.queue[i].name)
         temp.push(res.form.queue[i])
      }
      that.queue=[]
      that.queue=temp
      that.current=res.form.queue
    })
    this.socket=socket
  },
  created() {
   
  },
  destroyed() {
    //this.websock.close() //离开路由之后断开websocket连接
  },
  methods: {
   
    showDialog:function(item){
      console.log(item)
      this.item=item
      let url="http://127.0.0.1:8888/call?name="+item.name 
      this.$axios.get(url).then(res=>{
        console.log("res",res)
      }).catch(e=>{console.log(e)})
      this.dialogVisible=true
      this.socket.emit("reduce",item)
      console.log(this.socket)
    },
    nextQueue:function () {      
      if(this.start+3>this.queue.length){
        let temp=[]
        //console.log(this.start,this.queue.length,this.queue.slice(this.start,this.queue.length),0,this.start+3-this.queue.length,this.queue.slice(0,this.start+3-this.queue.length))
        this.current=[]
        temp=this.queue.slice(this.start,this.queue.length)
        for(let i in temp){
          this.current.push(temp[i])
        }
        temp=this.queue.slice(0,this.start+3-this.queue.length)
          for(let i in temp){
          this.current.push(temp[i])
        }
      }
      else{
        this.current=this.queue.slice(this.start,this.start+3)
      }
      this.start=(this.start+3)%this.queue.length
      
    },
    prevQueue:function () {
    if(this.start-3>=0){
        this.current=this.queue.slice(this.start-3,this.start)
      }
      else{
        let temp=this.queue.slice(this.queue.length-3+this.start,this.queue.length)
        this.current=[]
        for(let i in temp){
          this.current.push(temp[i])
        }
        temp=this.queue.slice(0,this.start)
        for(let i in temp){
          this.current.push(temp[i])
        }
      }
      this.start=(this.start-3+this.queue.length)%this.queue.length
    },


    currentTime() {
      /*
      var interval = setInterval(() => {
        this.current = this.formatTime(new Date())
      }, 1000)
      window.console.log(interval)
      */
    },

  }
}
</script>

<style scoped>
.cardbox {
  width: 90%;
  height: 450px;
  border: 1px solid red;
  border-radius: 10px;
  margin-left: 5%;
  z-index: 11;
  position: absolute;
}

.cardtitle {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 3em;
  color: #3F51B5;

}

.card {
  width: 95%;
  height: 150px;

  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-left: 2.5%;

  box-shadow: 0px 0px 2px 2px rgba(224, 222, 222, 0.9);
  transform: scale(1);
  transition: box-shadow 0.6s, transform 0.5s;
}

.num {
  width: 40%;
  height: 150px;
  background-color: #3F51B5;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-size: 3em;
  font-weight: 500;
  color: #fff;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  line-height: 100%;
}

.title {
  width: 60%;
  height: 100%;
  background-color: #2196F3;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-size: 3em;
  font-weight: 500;
  color: #fff;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.more{
  
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top:40px;
  font-size:2.5em;
  color:#2196F3;
}
</style>
