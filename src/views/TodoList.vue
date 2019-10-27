<template>
  <el-row class="content">
    <el-col :xs="{span:20,offset:2}" :sm="{span:8,offset:8}">
      <router-link to="/changePassword"><el-button>更改密码</el-button></router-link>
      <div>
        欢迎：{{name}}！你的待办事项是：
      </div>
      <el-input placeholder="请输入待办事项" v-model="todos" @keyup.enter.native="addTodos"></el-input>
      <el-tabs v-model="activeName">
        <el-tab-pane label="待办事项" name="first">
          <el-col :xs="24">
            <template v-if="!Done"> <!--v-if和v-for不能同时在一个元素内使用，因为Vue总会先执行v-for-->
              <template v-for="(item, index) in list">
                <todo-item
                  :key="index"
                  v-if="item.status == false"
                  :index="index"
                  :item="item"
                  v-on:finish="update"
                  v-on:remove="remove"
                />
              </template>
            </template>
            <div v-else-if="Done">
              暂无待办事项
            </div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="已完成事项" name="second">
          <template v-if="count > 0">
            <template v-for="(item, index) in list">
              <todo-item
                :key="index"
                v-if="item.status == true"
                :index="index"
                :item="item"
                v-on:restore="update"
                v-on:remove="remove"
              />
            </template>
          </template>
          <div v-else>
            暂无已完成事项
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script lang="ts">
/* eslint-disable guard-for-in */
import Vue from 'vue';
import axios from 'axios';

import TodoItem from '../components/TodoItem.vue';

export default Vue.extend({
  components: {
    TodoItem,
  },

  created() { // 组件创建时调用
    const userInfo = this.getUserInfo();
    if (userInfo != null) {
      this.id = userInfo.id;
      this.name = userInfo.name;
    } else {
      this.id = '';
      this.name = '';
    }
    this.getTodolist(); // 新增：在组件创建时获取todolist
  },

  data() {
    return {
      name: '',
      todos: '',
      activeName: 'first',
      list: [] as ITodoItem[],
      count: 0,
      id: '', // 新增用户id属性，用于区别用户
    };
  },

  computed: { // 计算属性用于计算是否已经完成了所有任务
    Done() {
      let count = 0;
      const { length } = this.list;
      // eslint-disable-next-line no-restricted-syntax
      for (const i in this.list) {
        // eslint-disable-next-line no-unused-expressions
        this.list[i].status === true ? count += 1 : '';
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.count = count;
      if (count === length || length === 0) {
        return true;
      }
      return false;
    },
  },

  methods: {
    addTodos() {
      if (this.todos === '') return;
      const obj = {
        status: false,
        content: this.todos,
        id: this.id,
      };
      axios.post('/api/todolist', obj) // 新增创建请求
        .then((res) => {
          if (res.status === 200) { // 当返回的状态为200成功时
            this.$message({
              type: 'success',
              message: '创建成功！',
            });
            this.getTodolist(); // 获得最新的todolist
          } else {
            this.$message.error('创建失败！'); // 当返回不是200说明处理出问题
          }
        }, (err) => {
          this.$message.error('创建失败！'); // 当没有返回值说明服务端错误或者请求没发送出去
          console.log(err);
        });
      this.todos = ''; // 将当前todos清空
    },
    update(index: number) {
      axios.put(
        `/api/todolist/${this.id}/${this.list[index].id}`,
        { ...this.list[index], status: !this.list[index].status },
      )
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '任务状态更新成功！',
            });
            this.getTodolist();
          } else {
            this.$message.error('任务状态更新失败！');
          }
        }, (err) => {
          this.$message.error('任务状态更新失败！');
          console.log(err);
        });
    },
    remove(index: number) {
      axios.delete(`/api/todolist/${this.id}/${this.list[index].id}`)
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '任务删除成功！',
            });
            this.getTodolist();
          } else {
            this.$message.error('任务删除失败！');
          }
        }, (err) => {
          this.$message.error('任务删除失败！');
          console.log(err);
        });
    },
    /** 解析JWT Payload，获取用户信息 */
    getUserInfo() {
      const token = sessionStorage.getItem('demo-token');
      if (token) {
        const decode = JSON.parse(atob(token.split('.')[1])); // 解析JWT Payload
        return decode; // decode解析出来实际上就是{name: XXX,id: XXX}
      }
      return null;
    },
    getTodolist() {
      axios.get(`/api/todolist/${this.id}`) // 向后端发送获取todolist的请求
        .then((res) => {
          if (res.status === 200) {
            this.list = res.data; // 将获取的信息塞入实例里的list
          } else {
            this.$message.error('获取列表失败！');
          }
        }, (err) => {
          this.$message.error('获取列表失败！');
          console.log(err);
        });
    },
  },
});

export interface ITodoItem {
  id: number;
  status: boolean;
  content: string;
}
</script>

<style lang="stylus" scoped>
  .el-input
    margin 20px auto
  .todo-list
    width 100%
    margin-top 8px
    padding-bottom 8px
    border-bottom 1px solid #eee
    overflow hidden
    text-align left
    .item
      font-size 20px
      &.finished
        text-decoration line-through
        color #ddd
  .pull-right
    float right
</style>
