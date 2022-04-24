<template>
  <div>
    <el-card>
      <!-- 增加对话框 -->
      <el-button icon="el-icon-circle-plus-outline" @click="addDialogVisible = true" style="width:100px;margin-right:20px;">新增</el-button>
      <el-button type="primary" class="short" icon="el-icon-delete" @click="removeDrugsById">批量删除</el-button>
      <div style="float:right;">

        <el-input
          placeholder="请输入搜索内容"
          v-model="queryInfo.drugName"
          class="input-with-select"
          style="width:250px"
          clearable
          @clear="getDrugList"
        >
          <el-button slot="append" icon="el-icon-search" @click="getDrugList"></el-button>
          
        </el-input>
      </div>

      <!-- 添加药方对话框 -->
      <el-dialog title="添加药方" :visible.sync="addDialogVisible" @close="addDialogClose" width="30%">
        <!-- 内容主体区 -->
        <el-form :model="addform" :rules="addformRules" ref="addformRef" label-width="100px">
          <el-form-item label="药方名字" prop="drugName">
            <el-input v-model="addform.drugName"></el-input>
          </el-form-item>
          <el-form-item label="药方费用" prop="drugAccount">
            <el-input v-model="addform.drugAccount"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDrug">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改处方对话框 -->
      <el-dialog title="修改药方" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px" v-if="editForm">
          <el-form-item label="药方id">
            <el-input v-model="editForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="药方名" prop="noticeTitle">
            <el-input v-model="editForm.drugName"></el-input>
          </el-form-item>
          <el-form-item label="药方费用" prop="noticeType">
            <el-input v-model="editForm.drugAccount"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDrugInfo">确 定</el-button>
        </span>
      </el-dialog>

      <el-table max-height="585px" ref="multipleTable" :data="druglist" style="width: 100%; " @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55;"></el-table-column>
        <el-table-column prop="id" label="id" width="100"></el-table-column>
        <el-table-column prop="drugName" label="药方名称" width="250"></el-table-column>
        <el-table-column prop="drugAccount" label="药方费用" width="200"></el-table-column>
        <el-table-column prop="gmtCreate" label="创建时间" width="220"></el-table-column>
        <el-table-column prop="gmtModified" label="修改时间" width="220"></el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" circle @click="editDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="removeDrugById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.current"
          :page-size="queryInfo.size"
          layout="total,  prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      multipleSelection: [],
      input: '',
      options: [
        {
          value: '选项1',
          label: '1'
        },
        {
          value: '选项2',
          label: '2'
        },
        {
          value: '选项3',
          label: '3'
        },
        {
          value: '选项4',
          label: '4'
        },
        {
          value: '选项5',
          label: '5'
        }
      ],
      value: '',
      // 获取处方列表参数对象
      queryInfo: {
        current: 1,
        drugName: '',
        size: 10
      },
      //用来存放获取的处方表格数据
      druglist: [],
      total: 0,
      //控制药房添加的对话框是否显示
      addDialogVisible: false,
      //添加药房表单数据
      addform: {
        drugName: '',
        drugAccount: ''
      },
      //添加表单表单验证的规则名称
      addformRules: {
        drugName: [
          {
            required: true,
            message: '请输入药方名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '药方名长度在2~10之间',
            trigger: 'blur'
          }
        ],
        drugAccount: [
          {
            required: true,
            message: '请输入药方费用',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '药方费用长度在2~10之间',
            trigger: 'blur'
          }
        ]
      },
      //控制编辑对话框的显示与否
      editDialogVisible: false,
      //查询到的用户对象保存
      editForm: {
        id: 0,
        drugName: '',
        drugAccount: ''
      },
      editFormRules: {
        drugName: [
          {
            required: true,
            message: '请输入药方名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '药方名长度在2~10之间',
            trigger: 'blur'
          }
        ],
        drugAccount: [
          {
            required: true,
            message: '请输入药方费用',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '药方费用长度在2~10之间',
            trigger: 'blur'
          }
        ]
      },
      //用来存放获取勾选行的id
      result: []
    }
  },
  created() {
    this.getDrugList()
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    tableRowStyle({ row, rowIndex, column, columnIndex }) {
      return {
        'background-color': '#2A4866',
        'text-align': 'center;'
      }
    },
    tableHeaderStyle({ row, rowIndex, column, columnIndex }) {
      return {
        'background-color': '#2A4866',
        'text-align': 'center;'
      }
    },
    async getDrugList() {
      const res = await this.$http.get('/drug/list', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.data.code != 0) {
        return this.$message.error('获取用户列表失败')
      }
      this.druglist = res.data.data.records
      this.total = res.data.data.total
      let result = res.data.data.records.length
      let recieve = res.data.data.records
      for (let i = 0; i < result; i++) {
        recieve[i].gmtCreate = this.format(recieve[i].gmtCreate)
        recieve[i].gmtModified = this.format(recieve[i].gmtModified)
      }
    },
    format(date) {
      date = new Date(date)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      let minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      let second = date.getSeconds()
      second = minute < 10 ? '0' + second : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      this.getDrugList()
    },
    //监听页码 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.current = newPage
      this.getDrugList()
      console.log(newPage)
    },
    //监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addformRef.resetFields()
    },
    //点击按钮 添加新用户
    addDrug() {
      this.$refs.addformRef.validate(async valid => {
        if (!valid) return
        const res = await this.$http.post('/drug/save', this.addform)
        if (res.data.code != 0) {
          this.$message.error('添加处方失败')
        }
        this.$message.success('添加处方成功')
        //隐藏添加的对话框
        this.addDialogVisible = false
        //刷新重掉getUserList函数 重获列表数据
        this.getDrugList()
      })
    },
    //展示编辑用户的对话框
    async editDialog(id) {
      const res = await this.$http.get('/drug/getOne?id=' + id)
      if (res.data.code != 0) {
        return this.$message.error('查询处方失败')
      }
      this.editForm = res.data.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    //监听修改用户对话框得关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息并提交
    editDrugInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        //发起修改用户信息得数据请求
        const res = await this.$http.post('/drug/update', {
          id: this.editForm.id,
          drugName: this.editForm.drugName,
          drugAccount: this.editForm.drugAccount
        })
        console.log(res)
        if (res.data.code != 0) {
          return this.$message.error('更新处方失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        //刷新数据列表
        this.getDrugList()
        //提示修改成功
        this.$message.success('更新处方成功')
      })
    },
    //根据id删除公告
    async removeDrugById(id) {
      console.log(id)
      const result = await this.$confirm('此操作将永久删除该处方, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认删除 返回值为字符串 confirm 取消则为cancle
      // console.log(res);
      if (result != 'confirm') {
        return this.$message.info('取消了删除')
      }
      console.log('确认了删除')
      const res = await this.$http.delete('/drug/' + id)
      if (res.data.code != 0) {
        this.$message.err('删除处方失败!')
      }
      this.getDrugList()
      this.$message.success('删除处方成功!')
    },
    //获取勾选的每行数据
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    //批量删除公告
    async removeDrugsById() {
      console.log(this.multipleSelection)
      let long = this.multipleSelection.length
      let id
      for (let i = 0; i < long; i++) {
        id = this.multipleSelection[i].id
        this.result.push(id)
      }
      console.log('result:', this.result)
      const res = await this.$http.delete('/drug?idsStr=' + this.result)
      if (res.data.code != 0) {
        this.$message.err('批量删除处方失败!')
      }
      this.getDrugList()
      this.$message.success('批量删除处方成功')
    }
  }
}
</script>

<style scoped>
</style>