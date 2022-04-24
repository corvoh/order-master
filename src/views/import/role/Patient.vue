<template>
  <div>
    <el-card>
      <!-- 搜索框与添加 -->
      <el-input style="width:88%" placeholder="请输入搜索内容" v-model="query.pName" clearable @clear="getList">
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>

      <el-button style="width:10%;float:right" type="primary" @click="addDialogVisible=true">添加患者</el-button>

      <el-table max-height="585px" :data="patientList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-descriptions title="患者详细信息">
              <el-descriptions-item label="姓名">{{ props.row.pname }}</el-descriptions-item>
              <el-descriptions-item label="性别">
                <span v-if="props.row.psex">男</span>
                <span v-if="!props.row.psex">女</span>
              </el-descriptions-item>
              <el-descriptions-item label="年龄">
                <span>{{ props.row.page }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="手机号">
                <span>{{ props.row.pphone }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="卡类型">
                <span v-if="props.row.cardType">医保卡</span>
                <span v-else>医疗卡</span>
              </el-descriptions-item>
              <el-descriptions-item label="卡号">
                <span>{{ props.row.cardNumber }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="地址">
                <span>{{ props.row.paddress }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="过敏史">
                <span>{{ props.row.pallergic }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="身份证">
                <span>{{ props.row.pidno }}</span>
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
        <el-table-column label="姓名" prop="pname"></el-table-column>
        <el-table-column label="手机号" prop="pphone"></el-table-column>
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
        :current-page="query.page"
        :page-size="query.size"
        layout="total,  prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加患者对话框 -->
    <el-dialog title="添加患者" :visible.sync="addDialogVisible" width="30%" @close="closeAdd">
      <el-form :rules="rules" ref="addFormRef" :model="addForm" label-width="100px">
        <el-form-item label="姓名" prop="pname">
          <el-input v-model="addForm.pname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="psex">
          <el-select v-model="addForm.psex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="page">
          <el-input v-model="addForm.page"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="pphone">
          <el-input v-model="addForm.pphone"></el-input>
        </el-form-item>
        <el-form-item label="卡类型" prop="cardType">
          <el-select v-model="addForm.cardType" placeholder="请选择卡类型">
            <el-option label="医保卡" value="1"></el-option>
            <el-option label="医疗卡" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡密" prop="cardPwd">
          <el-input v-model="addForm.cardPwd"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="paddress">
          <el-input v-model="addForm.paddress"></el-input>
        </el-form-item>
        <el-form-item label="过敏史" prop="pallergic">
          <el-input v-model="addForm.pallergic"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="pidno">
          <el-input v-model="addForm.pidno"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="addPatient">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑患者对话框 -->
    <el-dialog title="编辑患者" :visible.sync="editDialogVisible" width="30%" @close="editDialogVisible = false">
      <el-form ref="editFormRef" :model="editForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.pname"></el-input>
        </el-form-item>
        <el-form-item label="性别">
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
        <el-form-item label="卡类型">
          <el-select v-model="editForm.cardType" placeholder="请选择卡类型">
            <el-option label="医保卡" value="1"></el-option>
            <el-option label="医疗卡" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡密">
          <el-input v-model="editForm.cardPwd"></el-input>
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
        <el-button type="primary" @click="editPatient">确 定</el-button>
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
        pName: ''
      },
      addDialogVisible: false,
      total: null,
      addForm: {
        pname: '',
        psex: '',
        page: '',
        pphone: '',
        paddress: '',
        pallergic: '',
        pidno: '',
        cardType: '',
        cardPwd: '',
        cardId: ''
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
        cardType: '',
        cardPwd: '',
        cardId: ''
      },
      patientList: [],
      rules: {
        pname: [{ required: false, message: '请输入活动名称', trigger: 'blur' }],
        psex: [{ required: false, message: '请选择活动区域', trigger: 'change' }],
        page: [{ required: false, message: '请选择活动区域', trigger: 'change' }],
        pphone: [{ required: false, message: '请选择时间', trigger: 'change' }],
        cardType: [{ required: false, message: '请选择时间', trigger: 'change' }],
        cardPwd: [{ required: false, message: '请选择活动资源', trigger: 'change' }],
        paddress: [{ required: false, message: '请填写活动形式', trigger: 'blur' }],
        pallergic: [{ required: false, message: '请填写活动形式', trigger: 'blur' }],
        pidno: [{ required: false, message: '请填写活动形式', trigger: 'blur' }]
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
      const result = await this.$http.get('/patient-do/list', {
        params: this.query
      })
      console.log(result)
      if (result.data.code != 0) {
        return this.$message.error('获取患者列表失败')
      }
      this.patientList = result.data.data.records
      for (let i = 0; i < this.patientList.length; i++) {
        this.patientList[i].gmtCreate = this.formateDate(this.patientList[i].gmtCreate)
        this.patientList[i].gmtModified = this.formateDate(this.patientList[i].gmtModified)
        if (this.patientList[i].cardId != null) {
          const result1 = await this.$http.get('/card/getOne', { params: { id: this.patientList[i].cardId } })
          if (result1.data.code == 0) {
            this.patientList[i].cardType = result1.data.data.cardType
            this.patientList[i].cardNumber = result1.data.data.cardNumber
          }
        }
      }
      console.log(this.patientList)
      this.total = result.data.data.total
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getList()
    },
    async addPatient() {
      const result1 = await this.$http.post('/card/save', {
        params: {
          cardType: this.addForm.cardType,
          cardPwd: this.addForm.cardPwd
        }
      })
      // console.log(result1)
      if (result1.data.code == 0) {
        this.addForm.cardId = result1.data.data.id
      }
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
      const result1 = await this.$http.get('/card/getOne', { params: { id: result.data.data.cardId } })
      if (result1.data.code == 0) {
        this.editForm.cardType = result1.data.data.cardType
        this.editForm.cardPwd = result1.data.data.cardPwd
      }
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    async editPatient() {
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