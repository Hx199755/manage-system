<template>
  <div class="account-manage">
    <!-- 面板组件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号管理</span>
      </div>
      <div class="text item">
        <!-- 账号管理表格 -->
        <el-table
          ref="multipleTable"
          :data="accountTableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <!-- 单选框 -->
          <el-table-column type="selection" width="55"></el-table-column>

          <!-- 账号 -->
          <el-table-column prop="username" label="账号"></el-table-column>

          <!-- 用户组 -->
          <el-table-column prop="usergroup" label="用户组"></el-table-column>

          <!-- 日期 -->
          <el-table-column label="创建日期">
            <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                <i class="el-icon-delete"></i> 删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
//引入moment模块
import moment from "moment";
//引入qs模块
import qs from "qs";
export default {
  data() {
    return {
      accountTableData: []
    };
  },
   // 生命周期的钩子函数 created 自动触发 vue组件实例对象创建完成 dom还没有绑定 这个函数里面适合发送ajax请求 获取数据
  created() {
    // 自动发送请求 获取所有用户账号数据 （只要一进入这个组件 就自动发送请求）
    this.getAccountList();
  },
  methods: {
    // // 请求所有账号数据的函数
    getAccountList() {
      this.axios
        .get("http://127.0.0.1:1234/account/accountlist")
        .then(response => {
          // 把后端返回的账号数据 赋值给用户账号表格数据accountTableData
          this.accountTableData = response.data;
          // console.log(response.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
     getAccountListByPage () {
     
      // 收集当前页码 和 每页显示条数
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;

      // 发送ajax请求 把分页数据发送给后端
      this.axios.get('http://127.0.0.1:1234/account/accountlistbypage', {
        params: {
          pageSize,
          currentPage
        }
      })
        .then(response => {
          console.log('对应页码的数据:', response.data)
          // 接收后端返回的数据总条数 total 和 对应页码的数据 data
          let {total, data} = response.data;
          // 赋值给对应的变量即可
          this.total = total;
          this.accountTableData = data;
          // 如果当前页没有数据 且 排除第一页
          if ( !data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getAccountListByPage();
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //修改账号函数
    handleEdit(id) {
      //获取要修改的数据的id
      this.editId = id;
      //发送axios 发送id到后台
    },
    //删除账号函数
    handleDelete(id) {
      // 确认框
      this.$confirm("你确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      //确定点击确定 执行then
      .then(()=>{
        //发送axios 将id传给后台
        this.axios.get(`http://127.0.0.1:1234/account/accountdel?id=${id}`)
        .then(response=>{
          //接收后端返回的错误码和信息
          let {error_code,reason}=response.data;
          //判断
          if(error_code===0){
            //弹出删除成功的提示
             this.$message({
                  type: "success",
                  message: reason
              });
             //刷新列表，再次调用请求所有用户账号的函数
             this.getAccountList(); 
          }else{
            //弹出删除失败的提示
            this.$message.error(reason);
          }
        })
        .catch(err=>{
          console.log(err);
        })
      })
      //如果点击取消 执行catch
      .catch(() =>{
        // 弹出取消删除的提示
          this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
  },
   // 过滤器(设置事件格式)
  filters: {
    // 过滤时间的函数
    filterCtime(ctime) {
    return moment(ctime).format("YY/MM/DD HH:mm:ss");
    }
  }
};
</script>
<style lang="less">
.account-manage {
  .el-card {
    .el-card__header {
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
  }
}
</style>


