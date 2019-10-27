<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">欢迎注册</h3>
      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号" v-model="form.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
        <el-input type="password" placeholder="请确认密码" v-model="form.password2"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="onSubmit('form')">注册</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>请输入账号和密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Form } from 'element-ui';
import axios from 'axios';

export default Vue.extend({
  name: 'Register',
  data() {
    const validatePass2 = (rule: object, value: any, callback: Function) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== (this as any).form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: '',
        password: '',
        password2: '',
      },

      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        username: [
          { required: true, message: '账号不可为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不可为空', trigger: 'blur' },
        ],
        password2: [
          { required: true, message: '密码不可为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
      },

      // 对话框显示和隐藏
      dialogVisible: false,
    };
  },
  methods: {
    onSubmit(formName: string) {
      // 为表单绑定验证功能
      (this.$refs[formName] as Form).validate(async (valid) => {
        if (valid) {
          const { username: name, password } = this.form;
          try {
            const { data } = await axios.post(
              '/user/register',
              { name, password },
            );
            if (data.success) {
              sessionStorage.setItem('demo-token', data.token);
              this.$message.success('注册成功！');
              this.$router.push('/todolist');
            } else {
              this.$message.error(data.info);
            }
            return true;
          } catch (err) {
            this.$message.error('请求错误！');
            return false;
          }
        } else {
          this.dialogVisible = true;
          return false;
        }
      });
    },
  },
});
</script>

<style scoped>
.login-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>
