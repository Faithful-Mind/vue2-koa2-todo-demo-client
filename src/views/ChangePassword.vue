<template>
  <el-row class="content">
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <h3 class="title">更改密码</h3>
        <el-form-item label="旧密码" prop="password">
          <el-input type="password" placeholder="请输入旧密码" v-model="form.password"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" placeholder="请输入新密码" v-model="form.newPassword"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword2">
          <el-input type="password" placeholder="请确认密码" v-model="form.newPassword2"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="onSubmit('form')">修改</el-button>
        </el-form-item>
      </el-form>
      <router-link to="/todolist"><el-button>主页</el-button></router-link>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      userId: 0,
      form: {
        password: '',
        newPassword: '',
        newPassword2: '',
      },

      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        password: [
          { required: true, message: '密码不可为空', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '密码不可为空', trigger: 'blur' },
        ],
        newPassword2: [
          { required: true, message: '密码不可为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    const userInfo = this.getUserInfo();
    if (userInfo != null) {
      this.userId = userInfo.id;
    }
  },
  methods: {
    onSubmit(formName) {
      // 为表单绑定验证功能
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { password, newPassword } = this.form;
          try {
            const { data } = await axios.patch(
              `/user/${this.userId}`,
              { password, newPassword },
            );
            if (data.success) {
              sessionStorage.setItem('demo-token', data.token);
              this.$message.success('修改成功！');
              this.$router.push('/todolist');
            } else {
              this.$message.error(data.info);
            }
            return true;
          } catch (err) {
            this.$message.error(err.response.data.info || '请求错误！');
            return false;
          }
        } else {
          this.$message.error('请输入新旧密码');
          return false;
        }
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
  },
};
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
