<template>
<div>

  <div class="container">
    <div class="left">
      <div class="menu" @click="changeQueue">{{current.length}}</div>
      <div class="menu miss-menu" @click="changeQueue">{{miss.length}}</div>
    </div>
    <div>
      <div class="main" v-if="current.length>0 && queueType=='queue'">
        <div v-for="(item,index) in current" :key="index" @click="selectItem(item)">
          <div v-if="item.name==select_item.name && item.create==select_item.create" class="select-card ">
            <span>{{item.name}}</span>
            <div class="card-menu">
              <el-button type="danger" size="mini" @click="hangup($event)">挂单</el-button>
              <el-button type="primary" size="mini" @click="reduce($event)">完成</el-button>
            </div>
          </div>
          <div v-else class="card ">
            <span>{{item.name}}</span>
          </div>
        </div>

      </div>
      <div class="empty-queue" @click="changeQueue" v-else-if="current.length==0 && queueType=='queue'">
        暂无人员排队取药
      </div>

      <div class="main" v-if="miss.length>0 && queueType=='miss'">
        <div v-for="(item,index) in miss" :key="index" @click="selectMissItem(item)">
          <div v-if="item.name==select_miss_item.name && item.create==select_miss_item.create" class="card select-card ">
            {{item.name}}
            <div class="card-menu center">
              <el-button type="primary" size="mini" @click="reduce($event)">完成</el-button>
            </div>
          </div>
          <div v-else class="card miss-card">
            <span>{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="empty-queue miss-menu" @click="changeQueue" v-else-if="miss.length==0 && queueType=='miss'">
        暂无挂单
      </div>
    </div>
  </div>

  <el-dialog :visible.sync="dialogVisible" width="80%" center>
    <span class="cardtitle">{{select_item.name}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="hangup(select_item)">挂单</el-button>
      <el-button type="primary" @click="reduce(select_item)">完成</el-button>
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
      queueType: "queue",
      websock: '',
      start: 0,
      socket: {},
      smessage: "",
      select_item: {
        name: "",
        num: ""
      },
      select_miss_item: {
        name: "",
        num: ""
      },
      current: [],
      miss: [],
      queue: [],

    }
  },
  computed: {

  },
  mounted() {
    let that = this
    socket.on('connection', function (res) {
      that.current = res.form.queue
      console.log("sss", res)
    });
    socket.on("customer", function (res) {
      //接收当前用户队列
      let temp = []
      for (let i in res.form.queue) {
        temp.push(res.form.queue[i])
      }
      that.current = temp
      let temp2 = []
      for (let i in res.form.miss) {
        temp2.push(res.form.miss[i])
      }
      that.miss = temp2
    })
    this.socket = socket
  },
  created() {

  },
  destroyed() {
    
  },
  methods: {
    changeQueue: function () {
      if (this.queueType == "miss") {
        this.queueType = "queue"
      } else {
        this.queueType = "miss"
      }
    },
    selectItem: function (item) {
      console.log(item.name)
      this.select_item = item
      let url = "http://127.0.0.1:8888/call?name=" + item.name
      this.$axios.get(url).then(res => {
        console.log("res", res)
      }).catch(e => {
        console.log(e)
      })
      //需先将信息发送的大屏，但未实际减少用户
      this.socket.emit("call", item)
    },
    selectMissItem:function (item) {
      console.log(item.name)
      this.select_miss_item = item
      let url = "http://127.0.0.1:8888/call?name=" + item.name
      this.$axios.get(url).then(res => {
        console.log("res", res)
      }).catch(e => {
        console.log(e)
      })
      //需先将信息发送的大屏，但未实际减少用户
      this.socket.emit("call", item)
      // console.log(this.socket)
    },
   
    reduce: function (event) {
      event.stopPropagation();
      //点击完成
      //在等待取药队列才进行挂起，在挂起队列，不操作
      if (this.queueType == "queue")
        this.socket.emit("reduce", this.select_item)
      else
        this.socket.emit("reduce miss", this.select_miss_item)
    },
    hangup: function (event) {
      //挂起
      event.stopPropagation();
      //在等待取药队列才进行挂起，在挂起队列，不操作
      if (this.queueType == "queue") {
        this.socket.emit("hangup", this.select_item)
      }
    }
  }
}
</script>

<style scoped>
.main {
  width: 980px;
  height: 150px;
  margin-left:20px;
  
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

}

.cardtitle {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 3em;
  color: #3F51B5;
}

.card,
.select-card {
  width: 300px;
  height: 120px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  margin-left: 20px;

  background-color: #2196F3;
  color: #fff;
  font-size: 3em;
  font-weight: 500;
}

.select-card {
  height: 114px;
  color: #2196F3;
  background-color: #fff;
  border: 3px solid #2196F3;
}

.miss-card {
  background-color: #a4a5aa;
}

.card-menu {
  width: 50%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.center {
  justify-content: center;
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

.more {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  font-size: 2.5em;
  color: #2196F3;
}

.empty-queue {
  width: 980px;
  height: 150px;
  margin-left:20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;

  background-color: #2196F3;
  color: #fff;
  border-radius: 10px;
}

.menu {
  width: 60px;
  height: 60px;
  margin-left: 30px;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  background-color: #2196F3;
  color: #fff;
  font-size: 1.2em;
  font-weight: 600;
}

.miss-menu {

  background-color: #a4a5aa;
}

.container {
  display: flex;
  flex-direction: row;
  height: 150px;
  width: 100%;
  padding-top:15px;
}

.left {
  width: 100px;
  height: 100%;

}

.right {
  width: 800px;
  height: 100%;

}
</style>
