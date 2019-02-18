<template>
    <div class="login">
        <!-- 登录表单容器 -->
        <div class="login-wrapper">
            <!-- 登录标题 -->
            <h1 class="title">
                <i class="el-icon-menu"></i>
                华联超市管理系统-登录
            </h1>
            <!-- 登录表单 -->
            <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                <!-- 账号 -->
                <el-form-item label="账号" prop="username">
                    <el-input type="text" v-model="loginForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input type="text" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 确认密码 -->
                <el-form-item label="确认密码" prop="checkPwd">
                    <el-input type="text" v-model="loginForm.checkPwd" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 登录按钮丶重置按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
//引入qs
import qs from 'qs';
export default {
  data() {
    // 包含特殊字符的函数
    const checkSpecificKey = str => {
      var specialKey =
        "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      return true;
    };

    // 验证密码的函数
    const pass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 3 || value.length > 6) {
        callback(new Error("密码长度 3 - 6 位"));
      } else if (!checkSpecificKey(value)) {
        callback(new Error("密码不能包含特殊字符"));
      } else {
        if (this.loginForm.checkPwd !== "") {
          // 如果确认密码不为空
          this.$refs.loginForm.validateField("checkPwd"); // 调用确认密码的验证（一致性验证）
        }
        // 成功的回调
        callback();
      }
    };

    // 确认密码的验证函数
    const checkPass = (rule, value, callback) => {
      // rule是传入的验证规则  value是用户输入的值 callback是一个回调函数
      if (value === "") {
        // 如果等于空
        callback(new Error("请再次输入密码")); // 输出提示
      } else if (value !== this.loginForm.password) {
        // 如果确认密码 和 密码不同
        callback(new Error("两次输入密码不一致"));
      }
      // 如果直接调用 不传入任何错误信息 就是成功 绿色的勾勾
      callback();
    };

    return {
      // 登录表单的数据
      loginForm: {
        username: "",
        password: "",
        checkPwd: ""
      },
      // 验证的规则
      rules: {
        // 验证用户名
        username: [
          // 非空验证
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 5, message: "账号长度在 3 - 5 位", trigger: "blur" }
        ],
        // 验证密码
        password: [
          // 非空验证
          { required: true, validator: pass, trigger: "blur" }
        ],
        // 验证确认密码
        checkPwd: [
          // 自定义验证函数
          { required: true, validator: checkPass, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
   // 登录按钮触发函数
    submitForm(formName) {
      // 获取表单组件 调用验证方法
      this.$refs[formName].validate(valid => {
        // 如果所有验证通过 valid就是true
        if (valid) {
          // 收集账号和密码
          let params = {
            username: this.loginForm.username,
            password: this.loginForm.password
          };
          //参数发送给后台
          this.axios.post('http://127.0.0.1:1234/login/checklogin',qs.stringify(params))
          .then(response=>{
           // 跳转到后端主页
           this.$router.push("/");
          })
          .catch(err=>{
            console.log(err);
            
          })
          
        } else {
          // 否则就是false
          alert("前端验证失败 不能提交给后端");
          return false;
        }
      });
    },
    // 点击重置按钮 触发这个函数
    resetForm(formName) {
      // this.$refs.loginForm.resetFields() 获取整个表单组件 调用重置方法
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less">
.login {
  height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  .login-wrapper {
    width: 500px;
    height: 350px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.2);
    color: #ffffff;
    // 垂直水平居中
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    padding: 30px 50px 0 10px;
    .title {
      font-size: 20px;
      margin-left: 60px;
      margin-bottom: 20px;
    }
    .el-form {
      .el-form-item {
        .el-form-item__label {
          color: #ffffff;
        }
      }
    }
  }
}
</style>


