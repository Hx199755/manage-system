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
        <!-- 分页 -->
                <div style="margin-top: 20px; text-align: center;">
                   <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[1, 3, 5, 10, 20, 50]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
                  </el-pagination>
                </div>
         <!-- 批量删除按钮 & 取消选择按钮 -->
                <div style="margin-top: 20px; text-align: left;">
                  <el-button @click="batchDelete">批量删除</el-button>
                  <el-button @click="cancelSelect()">取消选择</el-button>
                </div>
      <!-- 修改的弹出模态框 -->
            <el-dialog title="账号修改" width="400px" :visible.sync="flag">
              <!-- 回填表单 -->
              <el-form :model="editForm"  label-width="60px">
                  <!-- 账号 -->
                <el-form-item label="账号" prop="username">
                    <el-input style="width: 217px;" type="text" v-model="editForm.username" autocomplete="off"></el-input>
                </el-form-item>

                  <!-- 选中用户组 -->
                <el-form-item label="用户组" prop="usergroup">
                    <el-select v-model="editForm.usergroup" placeholder="请选择用户组">
                      <el-option label="普通用户" value="普通用户"></el-option>
                      <el-option label="高级管理员" value="高级管理员"></el-option>
                    </el-select>
                </el-form-item>

              </el-form>
              <!-- 表单的尾部 -->
              <div slot="footer" class="dialog-footer">
                <el-button @click="flag = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
              </div>
            </el-dialog> 
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
      accountTableData: [],
       flag: false, // 控制修改模态框的显示和隐藏
      editForm: {
        // 修改表单数据
        username: "",
        usergroup: ""
      },
      editId: "", // 要修改的数据的id
      selectedAccount: [], // 被选中的账号数据
      currentPage: 1, // 当前页
      total: 0, // 数据总条数
      pageSize: 3 // 每页条数
    };
  },
   // 生命周期的钩子函数 created 自动触发 vue组件实例对象创建完成 dom还没有绑定 这个函数里面适合发送ajax请求 获取数据
  created() {
    // 自动发送请求 获取所有用户账号数据 （只要一进入这个组件 就自动发送请求）
    this.getAccountListByPage();
  },
  methods: {
    // // // 请求所有账号数据的函数
    // getAccountList() {
    //   this.axios
    //     .get("http://127.0.0.1:1234/account/accountlist")
    //     .then(response => {
    //       // 把后端返回的账号数据 赋值给用户账号表格数据accountTableData
    //       this.accountTableData = response.data;
    //       // console.log(response.data);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    //分页显示函数
     getAccountListByPage () {
     
      // 收集当前页码和每页显示条数
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;

      // 发送给后端
      this.axios.get('http://127.0.0.1:1234/account/accountlistbypage', {
        params: {
          pageSize,
          currentPage
        }
      })
        .then(response => {
          //console.log(response.data)
          // 接收后端返回的数据总条数 total 和 对应页码的数据 data
          let {total, data} = response.data;
          // 赋值给对应的变量
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
    // 每页显示条数改变 就会触发这个函数
    handleSizeChange(val) {
      // 保存每页显示的条数
      this.pageSize = val;
      //console.log(val);
      
      // 调用分页函数
      this.getAccountListByPage();
    },

    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // 保存当前页码
      this.currentPage = val;
      // 调用分页函数
      this.getAccountListByPage();
    },
    //单选框选中状态改变时，触发这个函数，是个数组，里面是数据对象
    handleSelectionChange(val) {
      this.selectedAccount = val;
      //console.log(val);
      
    },

    //批量删除函数
    batchDelete(){
      // 收集需要删除的账号的id
      let selectedId = this.selectedAccount.map(v => v.id);

      //如果什么都不选
      if(!selectedId.length){
        this.message.error("请选择后在操作");
        return;
      }
       // 确认框
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      //点确认执行then
      .then(()=>{
        //发送收集到选中的账号的id发送给后端
        this.axios.get(`http://127.0.0.1:1234/account/batchdelete`,{
          params:{
            selectedId
          }
        })
        .then(response=>{
          //接收后端的错误码和提示信息
          let {error_code,reason}=response.data;

          if(error_code ===0){
            //弹出成功信息
            this.$message({
              type: "success",
              message: reason
            });
            //调用刷新列表
            this.getAccountListByPage();
          }else{
            //弹出失败提示
            this.$message.error(reason);
          }
        })
        .catch(err=>{
          console.log(err);
          
        })
      })
      //点取消执行catch
      .catch(()=>{
          // 弹出取消删除的提示
          this.$message({
            type: "info",
            message: "已取消删除"
          })
      })
    },
    //修改账号函数
    handleEdit(id) {
      //获取要修改的数据的id
      this.editId = id;
      //发送axios 发送id到后台
       this.axios
        .get(`http://127.0.0.1:1234/account/accountedit?id=${id}`)
        .then(response => {
          // 接收后端的数据，后端返回的数据即使只有一条 也是数组
          let result = response.data[0];
          // 回填表单
          this.editForm.username = result.username;
          this.editForm.usergroup = result.usergroup;

          // 显示模态框 (回填数据之后)
          this.flag = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 保存修改
    saveEdit() {
      // 收集新数据 和 一个原来的id
      let params = {
        username: this.editForm.username,
        usergroup: this.editForm.usergroup,
        editId: this.editId
      };
      // 发送ajax请求 把新数据和原来的id一起发送给后端
      this.axios
        .post(
          "http://127.0.0.1:1234/account/accounteditsave",
          qs.stringify(params)
        )
        .then(response => {
          // 接收错误码和提示信息
          let { error_code, reason } = response.data;
          if (error_code === 0) {
            // 弹出成功的提示
            this.$message({
              type: "success",
              message: reason
            });
            // 刷新列表（重新请求所有账号数据）
            this.getAccountListByPage();
          } else {
            // 弹出失败的提示
            this.$message.error(reason);
          }
          // 关闭模态框
          this.flag = false;
        })
        .catch(err => {
          console.log(err);
        });
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
             this.getAccountListByPage(); 
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


