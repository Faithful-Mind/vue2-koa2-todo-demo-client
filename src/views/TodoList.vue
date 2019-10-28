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
            <template v-if="todoList.length"> <!--v-if和v-for不能同时在一个元素内使用，因为Vue总会先执行v-for-->
              <template v-for="(item, index) in todoList">
                <todo-item
                  :key="index"
                  :index="index"
                  :item="item"
                  v-on:finish="update"
                  v-on:remove="remove"
                />
              </template>
            </template>
            <div v-else>
              暂无待办事项
            </div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="已完成事项" name="second">
          <template v-if="doneList.length">
            <template v-for="(item, index) in doneList">
              <todo-item
                :key="index"
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
import Vue from 'vue';
import axios from 'axios';

import TodoItem from '../components/TodoItem.vue';
import { parseUserInfo } from '../services/user';

export default Vue.extend({
  components: {
    TodoItem,
  },

  created() { // 组件创建时调用
    const userInfo = parseUserInfo(sessionStorage.getItem('demo-token'));
    if (userInfo != null) {
      this.id = userInfo.id;
      this.name = userInfo.name;
    }
    this.getTodolist(); // 新增：在组件创建时获取todolist
  },

  data() {
    return {
      id: '',
      name: '',
      todos: '',
      activeName: 'first',
      list: [] as ITodoItem[],
    };
  },

  computed: {
    todoList() {
      return (this as any).list.filter((item: ITodoItem) => !item.status);
    },
    doneList() {
      return (this as any).list.filter((item: ITodoItem) => item.status);
    },
  },

  methods: {
    async addTodos() {
      if (this.todos === '') return;
      const obj = {
        status: false,
        content: this.todos,
        id: this.id,
      };
      try {
        const res = await axios.post('/api/todolist', obj);
        if (res.status === 200) { // 当返回的状态为200成功时
          this.$message.success('创建成功！');
          this.getTodolist(); // 获得最新的todolist
        } else {
          this.$message.error('创建失败！'); // 当返回不是200说明处理出问题
        }
      } catch (err) {
        this.$message.error(err.response.data.info || '创建失败！'); // 当没有返回值说明服务端错误或者请求没发送出去
        console.log(err);
      }
      this.todos = ''; // 将当前todos清空
    },
    async update(item: ITodoItem) {
      try {
        const res = await axios.put(
          `/api/todolist/${this.id}/${item.id}`,
          { ...item, status: !item.status },
        );
        if (res.status === 200) {
          this.$message.success('任务状态更新成功！');
          this.getTodolist();
        } else {
          this.$message.error('任务状态更新失败！');
        }
      } catch (err) {
        this.$message.error(err.response.data.info || '任务状态更新失败！');
        console.log(err);
      }
    },
    async remove(item: ITodoItem) {
      try {
        const res = await axios.delete(`/api/todolist/${this.id}/${item.id}`);
        if (res.status === 200) {
          this.$message.success('任务删除成功！');
          this.getTodolist();
        } else {
          this.$message.error('任务删除失败！');
        }
      } catch (err) {
        this.$message.error(err.response.data.info || '任务删除失败！');
        console.log(err);
      }
    },
    async getTodolist() {
      try {
        const res = await axios.get(`/api/todolist/${this.id}`);
        if (res.status === 200) {
          this.list = res.data; // 将获取的信息塞入实例里的list
        } else {
          this.$message.error('获取列表失败！');
        }
      } catch (err) {
        this.$message.error(err.response.data.info || '获取列表失败！');
        console.log(err);
      }
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
