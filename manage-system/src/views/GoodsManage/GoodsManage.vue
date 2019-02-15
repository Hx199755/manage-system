<template>
  <div class="account-manage">
    <!-- 面板组件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品管理</span>
      </div>
      <div class="text item">
        <!-- 账号管理表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <!-- 单选框 -->
          <el-table-column type="selection" width="55"></el-table-column>

          <!-- 账号 -->
          <el-table-column prop="username" label="商品名称"></el-table-column>

          <!-- 编号 -->
          <el-table-column prop="number" label="商品编号"></el-table-column>

          <!-- 商品类型 -->
          <el-table-column prop="goodsgroup" label="商品类型"></el-table-column>

          <!-- 价格 -->
          <el-table-column prop="price" label="商品价格" width="120"></el-table-column>

          <!-- 数量 -->
          <el-table-column prop="num" label="商品数量" width="120"></el-table-column>

          <!-- 日期 -->
          <el-table-column label="添加日期">
            <template slot-scope="scope">{{ scope.row.cdate }}</template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
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
export default {
  data() {
    return {
      tableData: [
        {
          username: "可口可乐",
          number: "00000001",
          goodsgroup: "饮料",
          price: "5",
          num: "55",
          cdate: "2019-02-05"
        },
        {
          username: "百事可乐",
          number: "00000002",
          goodsgroup: "饮料",
          price: "6",
          num: "45",
          cdate: "2019-02-05"
        },
        {
          username: "旺仔牛奶",
          number: "00000003",
          goodsgroup: "饮料",
          price: "7",
          num: "80",
          cdate: "2019-02-05"
        },
        {
          username: "海飞丝",
          number: "00000004",
          goodsgroup: "洗护用品",
          price: "30",
          num: "60",
          cdate: "2019-02-05"
        }
      ]
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit() {},
    handleDelete() {}
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


