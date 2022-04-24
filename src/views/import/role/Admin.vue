<template>
  <div>
    <el-card>
      <!-- 搜索框与添加 -->
      <el-row :gutter="20">
        <el-col :span="15">
          <el-input placeholder="请输入搜索内容" v-model="query.pName" clearable @clear="getList">
            <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible=true">添加患者</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="姓名">
                <span>{{ props.row.pname }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ props.row.psex }}</span>
              </el-form-item>
              <el-form-item label="年龄">
                <span>{{ props.row.page }}</span>
              </el-form-item>
              <el-form-item label="手机号">
                <span>{{ props.row.pphone }}</span>
              </el-form-item>
              <el-form-item label="地址">
                <span>{{ props.row.paddress }}</span>
              </el-form-item>
              <el-form-item label="过敏史">
                <span>{{ props.row.pallergic }}</span>
              </el-form-item>
              <el-form-item label="身份证">
                <span>{{ props.row.pidno }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.gmtCreate }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ props.row.gmtModified }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="pname"></el-table-column>
        <el-table-column label="手机号" prop="pphone"></el-table-column>
        <el-table-column label="创建时间" prop="gmtCreate"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOne(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteOne(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="query.page"
        :page-size="query.size"
        layout="total,  prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加患者对话框 -->
    <el-dialog title="添加患者" :visible.sync="addDialogVisible" width="30%" @close="closeAdd">
      <el-form ref="addFormRef" :model="addForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="phone">
          <el-select v-model="addForm.phone" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addForm.pphone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addForm.paddress"></el-input>
        </el-form-item>
        <el-form-item label="过敏史">
          <el-input v-model="addForm.pallergic"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="addForm.pidno"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="addP">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑患者对话框 -->
    <el-dialog title="编辑患者" :visible.sync="editDialogVisible" width="30%" @close="editDialogVisible = false">
      <el-form ref="editFormRef" :model="editForm" label-width="100px">
        <el-form-item label="姓名" prop="pname">
          <el-input v-model="editForm.pname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="psex">
          <el-select v-model="editForm.psex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="editForm.page"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.pphone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editForm.paddress"></el-input>
        </el-form-item>
        <el-form-item label="过敏史">
          <el-input v-model="editForm.pallergic"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="editForm.pidno"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editP">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Patient',
  data() {
    return {
      query: {
        //当前的页数
        page: 1,
        // 当前每页显示多少条数据
        size: 8,
        username: ''
      },
      addDialogVisible: false,
      tableData: [],
      total: null,
      addForm: {
        pname: '',
        psex: '',
        page: '',
        pphone: '',
        paddress: '',
        pallergic: '',
        pidno: '',
        gmtCreate: '',
        gmtModified: ''
      },
      editDialogVisible: false,
      editForm: {
        pname: '',
        psex: '',
        page: '',
        pphone: '',
        paddress: '',
        pallergic: '',
        pidno: '',
        gmtCreate: '',
        gmtModified: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 显示日期转换 datetime转字符串
    formateDate(date) {
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
    async getList() {
      const result = await this.$http.get('/sys/user', {
        params: this.query
      })
      console.log(result)
      if (result.data.code != 0) {
        return this.$message.error('获取患者列表失败')
      }
      this.tableData = result.data.data.records
      this.total = this.tableData.length
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getList()
    },
    async addP() {
      const result = await this.$http.post('/patient-do/save', this.addForm)
      if (result.data.code != 0) {
        this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      this.getList()
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    closeAdd() {
      this.$refs.addFormRef.resetFields()
      this.addDialogVisible = false
    },
    async deleteOne(id) {
      const result = await this.$http.delete('/patient-do/' + id)
      //   console.log(result)
      if (result.data.code != 0) {
        this.$message.error('删除失败')
      } else {
        this.$message.success('删除成功')
        this.getList()
      }
    },
    async editOne(id) {
      const result = await this.$http.get('/patient-do/getOne', { params: { id: id } })
      //   console.log(result)
      if (result.data.code == 0) this.editForm = result.data.data
      this.editDialogVisible = true
    },
    async editP() {
      const result = await this.$http.post('/patient-do/update', this.editForm)
      console.log(result)
      if (result.data.code == 0) {
        this.$message.success('修改成功')
        this.editDialogVisible = false
        this.getList()
      } else {
        this.$message.error('修改失败')
      }
    }
  }
}
</script>

<style>
</style>