<template>
  <div>
    <el-card>
      <!-- 搜索框与添加 -->
      <el-input style="width:88%" placeholder="请输入搜索内容" v-model="query.doctorName" clearable @clear="getList">
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>
      <el-button style="width:10%;float:right" type="primary" @click="addDialogVisible=true">添加医生</el-button>

      <!-- 表格 -->
      <el-table max-height="585px" :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-descriptions title="医生详细信息">
              <el-descriptions-item label="姓名">{{ props.row.docName }}</el-descriptions-item>
              <el-descriptions-item label="性别">
                <span v-if="props.row.docSex==1">男</span>
                <span v-if="props.row.docSex==0">女</span>
              </el-descriptions-item>
              <el-descriptions-item label="年龄">
                <span>{{ props.row.docAge }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="医龄">
                <span>{{ props.row.docYear }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="科室">
                <span>{{ props.row.did }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="级别">
                <span v-if="props.row.docLevel==1">主治医生</span>
                <span v-if="props.row.docLevel==2">副主任医生</span>
                <span v-if="props.row.docLevel==3">主任医生</span>
              </el-descriptions-item>
              <el-descriptions-item label="值班时间">
                <span>{{ props.row.time }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="手机号">
                <span>{{ props.row.docPhone }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="教育经历">
                <span>{{ props.row.docEducation }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="主要成就">
                <span>{{ props.row.docAchievement }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                <span>{{ props.row.gmtCreate }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">
                <span>{{ props.row.gmtModified }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="docName"></el-table-column>
        <el-table-column label="排班">
          <template slot-scope="scope">
            <el-link :underline="false" @click="openPatient(scope.row.pid)">编辑</el-link>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="gmtCreate"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button circle type="primary" icon="el-icon-edit" @click="editOne(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button circle type="danger" icon="el-icon-delete" @click="deleteOne(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="query.current"
        :page-size="query.size"
        layout="total,  prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加医生对话框 -->
    <el-dialog title="添加医生" :visible.sync="addDialogVisible" width="30%" @close="closeAdd">
      <el-form ref="addFormRef" :model="addForm" label-width="100px">
        <el-form-item label="姓名" prop="docName">
          <el-input v-model="addForm.docName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="docSex">
          <el-select v-model="addForm.docSex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="addForm.docAge"></el-input>
        </el-form-item>
        <el-form-item label="医龄">
          <el-input v-model="addForm.docYear"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addForm.docPhone"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.docPassword"></el-input>
        </el-form-item>
        <el-form-item label="科室">
          <el-input v-model="addForm.did"></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="addForm.docLevel" placeholder="请选择级别">
            <el-option label="主治医生" value="1"></el-option>
            <el-option label="副主任医生" value="2"></el-option>
            <el-option label="主任医生" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教育经历">
          <el-input v-model="addForm.docEducation"></el-input>
        </el-form-item>
        <el-form-item label="主要成就">
          <el-input v-model="addForm.docAchievement"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="addDoctor">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑医生对话框 -->
    <el-dialog title="编辑医生" :visible.sync="editDialogVisible" width="30%" @close="editDialogVisible = false">
      <el-form ref="editFormRef" :model="editForm" label-width="100px">
        <el-form-item label="姓名" prop="docName">
          <el-input v-model="editForm.docName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="docSex">
          <el-select v-model="editForm.docSex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="editForm.docAge"></el-input>
        </el-form-item>
        <el-form-item label="医龄">
          <el-input v-model="editForm.docYear"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.docPhone"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.docPassword"></el-input>
        </el-form-item>
        <el-form-item label="科室">
          <el-input v-model="editForm.did"></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="addForm.docLevel" placeholder="请选择级别">
            <el-option label="主治医生" value="1"></el-option>
            <el-option label="副主任医生" value="2"></el-option>
            <el-option label="主任医生" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教育经历">
          <el-input v-model="editForm.docEducation"></el-input>
        </el-form-item>
        <el-form-item label="主要成就">
          <el-input v-model="editForm.docAchievement"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDoctor">确 定</el-button>
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
        current: 1,
        // 当前每页显示多少条数据
        size: 8,
        doctorName: ''
      },
      addDialogVisible: false,
      tableData: [],
      total: 0,
      addForm: {},
      editDialogVisible: false,
      editForm: {}
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
      const result = await this.$http.get('/doctor/list', {
        params: this.query
      })
      console.log(result)
      if (result.data.code != 0) {
        return this.$message.error('获取医生列表失败')
      }
      this.total = result.data.data.total
      8
      this.tableData = result.data.data.records
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].gmtCreate = this.formateDate(this.tableData[i].gmtCreate)
        this.tableData[i].gmtModified = this.formateDate(this.tableData[i].gmtModified)
        this.tableData[i].time = ''
        for (let j = 0; j < this.tableData.length; j++) {
          const result1 = await this.$http.get('/schedule/getDoctorSchedule', { params: { id: this.tableData[i].id } })
          if (result1.data.code == 0) {
            if (result1.data.data[j].sworkperiod == 0) {
              this.tableData[i].time = this.tableData[i].time + ' ' + result1.data.data[j].sdate + '上午'
            } else if (result1.data.data[j].sworkperiod == 1) {
              this.tableData[i].time = this.tableData[i].time + ' ' + result1.data.data[j].sdate + '下午'
            }
          }
        }
      }
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.query.current = newPage
      this.getList()
    },
    async addDoctor() {
      const result = await this.$http.post('/doctor/save', this.addForm)
      console.log(this.addForm)
      console.log(result)
      if (result.data.code != 0) {
        this.$message.error('添加失败')
      } else {
        this.$message.success('添加成功')
        this.getList()
        this.addDialogVisible = false
        this.$refs.addFormRef.resetFields()
      }
    },
    closeAdd() {
      this.$refs.addFormRef.resetFields()
      this.addDialogVisible = false
    },
    async deleteOne(id) {
      const result = await this.$http.delete('/doctor/' + id)
      console.log(result)
      if (result.data.code != 0) {
        this.$message.error('删除失败')
      } else {
        this.$message.success('删除成功')
        this.getList()
      }
    },
    async editOne(id) {
      const result = await this.$http.get('/doctor/getOne', { params: { id: id } })
      //   console.log(result)
      if (result.data.code == 0) this.editForm = result.data.data
      this.editDialogVisible = true
    },
    async editDoctor() {
      const result = await this.$http.post('/doctor/update', this.editForm)
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