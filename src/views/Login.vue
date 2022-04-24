<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :xl="5" :lg="7" :md="9" :sm="12" :xs="15">
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="70px">
        <el-avatar :size="40"></el-avatar>
        <el-form-item label="用户名" prop="username" style="width: 300px;">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" style="width: 300px;">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import Element from 'element-ui'

export default {
  name: 'Login',
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      if (this.loginForm.username === "user" && this.loginForm.password === "123") {
          this.$router.push('/home/index')
          return Element.Message.success('登录成功，欢迎' + this.loginForm.username)
        } else {
          return Element.Message.error("您输入的用户名和密码有误!")
        }
    },
    resetForm() {
      this.loginForm.username = null;
      this.loginForm.password = null;
    }
    
  }
}
</script>


<style scoped>
.el-row {
  background: url(../assets/wave.png) bottom;
}
.el-form {
  position: relative;
  background-color: #fff;
  height: 200px;
  padding: 90px 50px 30px 50px;
  border-radius: 14px;
  box-shadow: 5px 5px 3px rgba(220, 221, 223, 0.5);
}

.el-avatar {
  position: absolute;
  top: 23px;
  left: 190px;
}

.el-row {
  height: 100vh;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}
.el-button--default {
  position: absolute;
  top: 7px;
  left: 100px;
}
.el-button--primary {
  position: absolute;
  top: 7px;
  left: 10px;
  background-color: rgba(16, 40, 71, 1);
}
</style>
