<template>
  <el-row class="content">
    <el-col :xs="{span:20,offset:2}" :sm="{span:8,offset:8}">
      <span>
        欢迎：{{name}}！你的待办事项是：
      </span>
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
                  v-on:finish="finished"
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
                v-on:restore="restore"
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

<script>
/* eslint-disable guard-for-in */
import TodoItem from '../components/TodoItem.vue';

export default {
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
  },

  data() {
    return {
      name: '',
      todos: '',
      activeName: 'first',
      list: [],
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
      if (this.todos === '') { return; }
      const obj = {
        status: false,
        content: this.todos,
      };
      this.list.push(obj);
      this.todos = '';
    },
    finished(index) {
      this.$set(this.list[index], 'status', true); // 通过set的方法让数组的变动能够让Vue检测到
      this.$message({
        type: 'success',
        message: '任务完成',
      });
    },
    remove(index) {
      this.list.splice(index, 1);
      this.$message({
        type: 'info',
        message: '任务删除',
      });
    },
    restore(index) {
      this.$set(this.list[index], 'status', false);
      this.$message({
        type: 'info',
        message: '任务还原',
      });
    },
    /** 解析JWT Payload，获取用户信息 */
    getUserInfo() {
      const token = sessionStorage.getItem('demo-token');
      if (token != null && token !== 'null') {
        const decode = JSON.parse(atob(token.split('.')[1])); // 解析JWT Payload
        return decode; // decode解析出来实际上就是{name: XXX,id: XXX}
      }
      return null;
    },
  },
};
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
