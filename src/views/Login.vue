<template>
  <el-row class="content">
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <span class="title">
       欢迎登录
      </span>
      <el-row>
        <el-input
          v-model="account"
          placeholder="账号"
          type="text">
        </el-input>
        <!-- 给input增加键盘事件，当输入完密码回车也执行loginToDo方法 -->
        <el-input
          v-model="password"
          placeholder="密码"
          type="password"
          @keyup.enter.native="loginToDo">
        </el-input>
        <!-- 增加一个click方法 loginToDo -->
        <el-button type="primary" @click="loginToDo">登录</el-button>
      </el-row>
      <router-link to="/register"><el-button>注册</el-button></router-link>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

export default Vue.extend({
  data() {
    return {
      account: '',
      password: '',
    };
  },
  methods: {
    async loginToDo() {
      const obj = {
        name: this.account,
        password: this.password,
      };
      try {
        const { data } = await axios.post('/auth/user', obj);
        if (data.success) { // 如果成功
          sessionStorage.setItem('demo-token', data.token); // 用sessionStorage把token存下来
          this.$message.success('登录成功！'); // 登录成功，显示提示语
          this.$router.push('/todolist'); // 进入todolist页面，登录成功
        } else {
          this.$message.error(data.info); // 登录失败，显示提示语
          sessionStorage.removeItem('demo-token'); // 将token清空
        }
      } catch (err) {
        this.$message.error(err.response.data.info || '请求错误！');
        sessionStorage.removeItem('demo-token'); // 将token清空
      }
    },
  },
});
</script>

<style lang="stylus" scoped>
  .el-row.content
    padding 16px
  .title
    font-size 28px
  .el-input
    margin 12px 0
  .el-button
    width 100%
    margin-top 12px
</style>
