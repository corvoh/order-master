<template>
  <div>
    <el-input
      placeholder="请输入搜索内容"
      v-model="queryInfo.commodity"
      class="input-with-select"
      style="width:250px"
      clearable
      ><el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button @click="sortData" style="width:100px;margin-right:20px;">排序</el-button>
    <el-button icon="el-icon-circle-plus-outline" @click="addDialogVisible = true" style="width:100px;margin-right:20px;">新增</el-button>
    <!-- 添加商品对话框 -->
      <el-dialog title="添加商品" :visible.sync="addDialogVisible" @close="addDialogClose" width="30%">
        <!-- 内容主体区 -->
        <el-form :model="addform" ref="addformRef" label-width="100px">
          <el-form-item label="商品名字" prop="commodity_title">
            <el-input v-model="addform.commodity_title"></el-input>
          </el-form-item>
          <el-form-item label="商品图片" prop="commodity_img">
            <el-input v-model="addform.commodity_img"></el-input>
          </el-form-item>
          <el-form-item label="商品归类" prop="commodity_type_id">
            <el-input v-model="addform.commodity_type_id"></el-input>
          </el-form-item>
          <el-form-item label="商品原价" prop="origin_price">
            <el-input v-model="addform.origin_price"></el-input>
          </el-form-item>
          <el-form-item label="商品现价" prop="current_price">
            <el-input v-model="addform.current_price"></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="commodity_count">
            <el-input v-model="addform.commodity_count"></el-input>
          </el-form-item>
          <el-form-item label="销量" prop="sale_quantity">
            <el-input v-model="addform.sale_quantity"></el-input>
          </el-form-item>
          <el-form-item label="详情" prop="detail">
            <el-input v-model="addform.detail"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCommodity">确 定</el-button>
        </span>
      </el-dialog>
    <el-table
      ref="multipleTable"
      :data="commodityData"
      tooltip-effect="dark"
      style="width: 100%;text-align:center;"
      @selection-change="handleSelectionChange"
      :row-style="tableRowStyle"
      :header-cell-style="tableHeaderStyle">
    <el-table-column
      type="selection"
      width="70px">
    </el-table-column>
    <el-table-column
    prop="commodity_title"
      label="商品名称"
      width="120px">
    </el-table-column>
    <el-table-column
      prop="commodity_img"
      label="商品图片"
      width="90px">
    </el-table-column>
    <el-table-column
      prop="commodity_type_id"
      label="商品归类"
      width="120px">
    </el-table-column>
    <el-table-column
      prop="origin_price"
      label="原价"
      width="120">
    </el-table-column>
    <el-table-column
      prop="current_price"
      label="现价"
      width="120"
      >
    </el-table-column>
    <el-table-column
      prop="sale_status"
      label="销售状态"
      width="120px">
    </el-table-column>
    <el-table-column
      prop="commodity_count"
      label="库存"
      width="120">
    </el-table-column>
    <el-table-column
      prop="sale_quantity"
      label="销量"
      width="120">
    </el-table-column>
    <el-table-column
      prop="detail"
      label="商品详情">
    </el-table-column>
    </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.current"
          :page-sizes="[2, 4, 8, 10]"
          :page-size="queryInfo.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
        commodityData: [
        {
          commodity_title:"篮球",
          commodity_img:"忽略",
          commodity_type_id:"体育用品",
          origin_price:"888",
          current_price:"800",
          sale_status:"在售",
          detail:"国产篮球，快冲！",
          commodity_count:3,
          sale_quantity:67
        },{
          commodity_title:"足球",
          commodity_img:"忽略",
          commodity_type_id:"体育用品",
          origin_price:"666",
          current_price:"600",
          sale_status:"在售",
          detail:"国产篮球，快冲！",
          commodity_count:3,
          sale_quantity:67
        },
        {
          commodity_title:"篮球",
          commodity_img:"忽略",
          commodity_type_id:"体育用品",
          origin_price:"188",
          current_price:"100",
          sale_status:"在售",
          detail:"国产篮球，快冲！",
          commodity_count:3,
          sale_quantity:67
        },{
          commodity_title:"足球",
          commodity_img:"忽略",
          commodity_type_id:"体育用品",
          origin_price:"8888",
          current_price:"8000",
          sale_status:"在售",
          detail:"国产篮球，快冲！",
          commodity_count:3,
          sale_quantity:67
        },
        {
          commodity_title:"篮球",
          commodity_img:"忽略",
          commodity_type_id:"体育用品",
          origin_price:"888",
          current_price:"800",
          sale_status:"在售",
          detail:"国产篮球，快冲！",
          commodity_count:3,
          sale_quantity:67
        }],//后台数据
        multipleSelection: [],
        total:0,//总条数
        addDialogVisible: false,
        queryInfo: {
        commodity:'',
        current: 1,//初始页
        size: 10//每页的数据
        },
        newArray:[],//循环数据
        addform: {
          commodity_title:"",
          commodity_type_id:"",
          origin_price:"",
          current_price:"",
          detail:"",
          commodity_count:"",
          sale_quantity:"",
          commodity_img:""
        },
        dialogVisible:false,
        updateVisible:false,
      }
    },
  methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange:function(size){
        this.size = size;
        this.getResultDate();
      },
      handleCurrentChange: function(page){
        this.current = page;
        this.getResultDate();
      },
      compare(value1,value2){
        if(value1.current_price < value2.current_price){
          return -1;
        }else if(value1.current_price > value2.current_price){
          return 1;
        }else{
          return 0;
        }
      },
      // 排序
      sortData(){
        this.commodityData.sort(this.compare);
        console.log(this.commodityData);
      },
      // 搜索
      search(){
        let searchList;
        searchList = this.commodityData.filter((item) => item.commodity_title.includes(this.queryInfo.commodity)) ;
        console.log(searchList);
        this.commodityData = searchList;
        console.log(this.commodityData);
      },
      //监听添加商品对话框的关闭事件
      addDialogClose() {
        this.$refs.addformRef.resetFields()
      },
      addCommodity(){
        console.log(this.addform);
        let newArray = this.addform;
        this.commodityData.push(newArray);
        console.log(this.commodityData);
        this.addDialogVisible = false;
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      tableRowStyle({ row, rowIndex, column, columnIndex }) {
        return {
          'background-color': '#2A4866',
          'text-align': 'center',
        }
      },
      tableHeaderStyle({ row, rowIndex, column, columnIndex }) {
        return {
          'background-color': '#2A4866',
          'color':'white',
          // 'text-align': 'center'
        }
      },
    }
}
</script>
<style scoped>

</style>