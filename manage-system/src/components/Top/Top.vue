<template>
  <div class="top">
    <el-row>
      <el-col :span="12">
        <div class="title">
          <i class="el-icon-menu"></i>
          华联超市管理系统
        </div>
      </el-col>
      <el-col :span="12">
        <div class="top-right">
          <el-row>
            <el-col :span="18">欢迎您!
              <el-dropdown>
                <span class="username el-dropdown-link">
                  {{ username }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="6">
              <div class="head">
                <img width="100%" height="100%" :src="headUrl" alt>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: "李寻欢",
      headUrl: "http://127.0.0.1:8080/head.jpg"
    };
  }
};
</script>
<style lang="less">
.top {
  .title {
    text-align: left;
    font-size: 20px;
    font-weight: 900;
  }
  .top-right {
    color: #2d3a4b;
    text-align: right;
    .username {
      font-weight: 600;
    }
    .head {
      width: 52px;
      height: 52px;
      margin-top: 4px;
      margin-left: 30px;
      border-radius: 50%;
      img {
        border-radius: 50%;
      }
    }
  }
}
</style>


