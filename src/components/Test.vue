<template>
<div class="test">
  <el-tag style="font-size:2em">模拟iE发送消息</el-tag>
  <el-form :model="form">
    <el-form-item label="姓名(前缀)一次生成5个">
        <el-input v-model="form.name"></el-input>
    </el-form-item>
  </el-form>
 
  <el-button type="success"  @click="sendMsg">模拟iE发送消息</el-button>

 </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io('http://127.0.0.1:8888');
export default {
  name: 'Test',
  data(){
    return {
      form:{
        name:"测试"
      }
    }
  },
  mounted() {
    socket.on('connect', function(res){
      console.log("sss",res)
    });  
    socket.on("customer",function(res){
      console.log(res)
    })
  },
  methods: {
   
    sendMsg: function () {
      console.log("sendmsg.....")
      for(let i=0;i<5;i++)
      socket.emit('customer', {
        name: this.form.name+(i+1)
      });
    }
  }
}
</script>


<style scoped>

</style>
