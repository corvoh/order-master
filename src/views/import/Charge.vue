<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索框与添加 -->
      <el-row :gutter="20">
        <el-col :span="15">
          <el-input placeholder="请输入内容" v-model="query.username" clearable @clear="getList">
            <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible=true">添加订单</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="chooseClear">取消选择</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="deletes">批量删除</el-button>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table max-height="585px" ref="chargeTableRef" :data="list" @selection-change="chargeSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="患者">
          <template slot-scope="scope">
            <el-link :underline="false" @click="openPatient(scope.row.pid)">{{scope.row.pname}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="医生">
          <template slot-scope="scope">
            <el-link :underline="false" @click="openDoc(scope.row.docId)">{{scope.row.docName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="订单">
          <template slot-scope="scope">
            <el-link :underline="false" @click="openDetail(scope.row.id)">{{scope.row.chargeNumber}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="chargePayType"></el-table-column>
        <el-table-column label="是否已支付">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.chargePayStatus" disabled></el-switch>
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
        :current-page="query.page"
        :page-size="query.size"
        layout="total,  prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 新增订单的对话框 -->
    <el-dialog title="新增订单" :visible.sync="addDialogVisible" width="50%" @open="getDepartmentData" @close="cancelAdd">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="科室" prop="did">
          <el-cascader
            filterable
            expand-trigger="hover"
            :options="departmentTree"
            :props="departmentProps"
            v-model="selectedKeys"
            @change="departmentChange"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="病人" prop="pid">
          <el-select v-model="patientModel" filterable clearable default-first-option placeholder="请输入病人姓名" :filter-method="filterPatient">
            <el-option :label="patient.name" :value="patient.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="医生" prop="docId">
          <el-select v-model="docModel" filterable clearable default-first-option placeholder="请输入医生姓名" :filter-method="filterDoc">
            <el-option :label="doc.name" :value="doc.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="处方" prop="drugOrderId">
          <el-input placeholder="请选择处方" v-model="drugModel" clearable @focus="drugDialogVisible = true"></el-input>
        </el-form-item>
        <el-form-item label="支付费用" prop="chargePayAccount">
          <el-input v-model="addForm.chargePayAccount"></el-input>
        </el-form-item>
        <el-form-item label="实际支付" prop="chargePayActualAccount">
          <el-input v-model="addForm.chargePayActualAccount"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="chargePayType">
          <el-select v-model="chargePayTypeModel" clearable placeholder="请选择支付方式">
            <el-option v-for="item in chargePayType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否支付" prop="chargePayStatus">
          <el-radio v-model="chargePayStatusModel" label="1">是</el-radio>
          <el-radio v-model="chargePayStatusModel" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="addCharge">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改订单的对话框 -->
    <el-dialog title="修改订单" :visible.sync="editDialogVisible" width="50%" @open="editGetDepartmentData" @close="cancelEdit">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="科室" prop="did">
          <el-cascader
            filterable
            expand-trigger="hover"
            :options="editDepartmentTree"
            :props="editDepartmentProps"
            v-model="editSelectedKeys"
            @change="editDepartmentChange"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="病人" prop="pid">
          <el-select v-model="editPatientModel" filterable clearable default-first-option :filter-method="editFilterPatient">
            <el-option :label="editPatient.name" :value="editPatient.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="医生" prop="docId">
          <el-select v-model="editDocModel" filterable clearable default-first-option :filter-method="editFilterDoc">
            <el-option :label="editDoc.name" :value="editDoc.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="处方" prop="drugOrderId">
          <el-input v-model="editDrugModel" clearable @focus="editDrugDialogVisible = true"></el-input>
        </el-form-item>
        <el-form-item label="支付费用" prop="chargePayAccount">
          <el-input v-model="editChargePayAccountModel" clearable></el-input>
        </el-form-item>
        <el-form-item label="实际支付" prop="chargePayActualAccount">
          <el-input v-model="editChargePayActualAccountModel" clearable></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="chargePayType">
          <el-select v-model="editChargePayTypeModel" clearable>
            <el-option v-for="item in editChargePayType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否支付" prop="chargePayStatus">
          <el-radio v-model="editChargePayStatusModel" :label="1">是</el-radio>
          <el-radio v-model="editChargePayStatusModel" :label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editCharge">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 增加订单-选择处方对话框 -->
    <el-dialog title="新增订单-选择处方" :visible.sync="drugDialogVisible" @open="getDrugData" width="50%">
      <el-input placeholder="请输入内容" v-model="drugQuery.pname" clearable @clear="getDrugData">
        <el-button slot="append" icon="el-icon-search" @click="getDrugData"></el-button>
      </el-input>
      <el-table highlight-current-row @current-change="chooseDrug" ref="drugRef" :data="drugList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="处方编号">
                <span>{{ props.row.drugOrderId }}</span>
              </el-form-item>
              <el-form-item label="病人">
                <span>{{ props.row.pname }}</span>
              </el-form-item>
              <el-form-item label="医生">
                <span>{{ props.row.docName }}</span>
              </el-form-item>
              <el-form-item label="药品">
                <span>{{ props.row.drugName }}</span>
              </el-form-item>
              <el-form-item label="应付">
                <span>{{ props.row.drugAccount }}</span>
              </el-form-item>
              <el-form-item label="实付">
                <span>{{ props.row.payAccount }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="处方编号" prop="drugOrderId"></el-table-column>
        <el-table-column label="药品" prop="drugName"></el-table-column>
        <el-table-column label="应付" prop="drugAccount"></el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @current-change="drugHandleCurrentChange"
        :current-page="drugQuery.page"
        :page-size="drugQuery.size"
        layout="total,  prev, pager, next, jumper"
        :total="drugTotal"
      ></el-pagination>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDrug">取 消</el-button>
        <el-button type="primary" @click="drugDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改订单-选择处方对话框 -->
    <el-dialog title="修改订单-选择处方" :visible.sync="editDrugDialogVisible" @open="editGetDrugData" width="50%">
      <el-input v-model="editDrugQuery.pname" clearable @clear="editGetDrugData">
        <el-button slot="append" icon="el-icon-search" @click="editGetDrugData"></el-button>
      </el-input>
      <el-table highlight-current-row @current-change="editChooseDrug" ref="editDrugRef" :data="editDrugList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="处方编号">
                <span>{{ props.row.drugOrderId }}</span>
              </el-form-item>
              <el-form-item label="病人">
                <span>{{ props.row.pname }}</span>
              </el-form-item>
              <el-form-item label="医生">
                <span>{{ props.row.docName }}</span>
              </el-form-item>
              <el-form-item label="药品">
                <span>{{ props.row.drugName }}</span>
              </el-form-item>
              <el-form-item label="应付">
                <span>{{ props.row.drugAccount }}</span>
              </el-form-item>
              <el-form-item label="实付">
                <span>{{ props.row.payAccount }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="处方编号" prop="drugOrderId"></el-table-column>
        <el-table-column label="药品" prop="drugName"></el-table-column>
        <el-table-column label="应付" prop="drugAccount"></el-table-column>
      </el-table>

      <el-pagination
        @current-change="editDrugHandleCurrentChange"
        :current-page="editDrugQuery.page"
        :page-size="editDrugQuery.size"
        layout="total,  prev, pager, next, jumper"
        :total="editDrugTotal"
      ></el-pagination>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDrug">取 消</el-button>
        <el-button type="primary" @click="editDrugDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 订单详细信息 -->
    <el-dialog center title="订单详细信息" :visible.sync="detailDialogVisible" @open="getDetailData" @close="clearDetail" width="50%">
      <el-form :model="detailList" label-position="left" label-width="120px" inline class="demo-table-expand">
        <el-form-item label="订单编号">
          <span>{{detailList.id }}</span>
        </el-form-item>
        <el-form-item label="患者">
          <span>{{detailList.pName }}</span>
        </el-form-item>
        <el-form-item label="医生">
          <span>{{detailList.docName }}</span>
        </el-form-item>
        <el-form-item label="处方">
          <span>{{detailList.drugName }}</span>
        </el-form-item>
        <el-form-item label="科室">
          <span>{{detailList.depName }}</span>
        </el-form-item>
        <el-form-item label="需要支付">
          <span>{{detailList.chargePayAccount }}</span>
        </el-form-item>
        <el-form-item label="实际支付">
          <span>{{detailList.chargePayActualAccount }}</span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span>{{detailList.chargePayType }}</span>
        </el-form-item>
        <el-form-item label="是否支付">
          <span>{{detailList.chargePayStatus }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 患者详细信息 -->
    <el-dialog center title="患者详细信息" :visible.sync="patientDialogVisible" @open="getPatientData" @close="clearPatient" width="50%">
      <el-form :model="patientList" label-position="left" label-width="120px" inline class="demo-table-expand">
        <el-form-item label="姓名">
          <span>{{patientList.name }}</span>
        </el-form-item>
        <el-form-item label="身份证号码">
          <span>{{patientList.num }}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span>{{patientList.sex }}</span>
        </el-form-item>
        <el-form-item label="年龄">
          <span>{{patientList.age }}</span>
        </el-form-item>
        <el-form-item label="过敏史">
          <span>{{patientList.allergic }}</span>
        </el-form-item>
        <el-form-item label="地址">
          <span>{{patientList.address }}</span>
        </el-form-item>
        <el-form-item label="卡类型">
          <span>{{patientList.type }}</span>
        </el-form-item>
        <el-form-item label="卡号">
          <span>{{patientList.cardNum }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 医生详细信息 -->
    <el-dialog center title="医生详细信息" :visible.sync="docDialogVisible" @open="getDocData" @close="clearDoc" width="50%">
      <el-form :model="docList" label-position="left" label-width="120px" inline class="demo-table-expand">
        <el-form-item label="姓名">
          <span>{{docList.name }}</span>
        </el-form-item>
        <el-form-item label="医龄">
          <span>{{docList.year }}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span>{{docList.sex }}</span>
        </el-form-item>
        <el-form-item label="年龄">
          <span>{{docList.age }}</span>
        </el-form-item>
        <el-form-item label="联系方式">
          <span>{{docList.phone }}</span>
        </el-form-item>
        <el-form-item label="毕业院校">
          <span>{{docList.edu }}</span>
        </el-form-item>
        <el-form-item label="主要成就">
          <span>{{docList.ach }}</span>
        </el-form-item>
        <el-form-item label="科室">
          <span>{{docList.dep }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Charge',

  data() {
    return {
      departmentTree: [],
      departmentProps: {
        value: 'id',
        label: 'dname',
        children: 'children'
      },
      // 获取科室树的键值对
      selectedKeys: [],
      // 获取订单列表的参数对象
      query: {
        //当前的页数
        page: 1,
        // 当前每页显示多少条数据
        size: 5,
        username: ''
      },
      drugQuery: {
        //当前的页数
        page: 1,
        // 当前每页显示多少条数据
        size: 4,
        pname: ''
      },
      editDrugQuery: {
        //当前的页数
        page: 1,
        // 当前每页显示多少条数据
        size: 4,
        pname: ''
      },
      drugTotal: null,
      drugModel: '',
      editDrugDialogVisible: false,
      editDrugModel: '',
      editDrugTotal: null,
      patient: {
        id: '',
        name: ''
      },
      editPatient: {
        id: '',
        name: ''
      },
      patientModel: '',
      patientOptions: [],
      docModel: '',
      docOptions: [],
      editPatientModel: '',
      editPatientOptions: [],
      editDocModel: '',
      editDocOptions: [],
      doc: {
        id: '',
        name: ''
      },
      editDoc: {
        id: '',
        name: ''
      },
      list: [],
      drugList: [],
      drugIdList: [],
      chargePayTypeModel: '',
      chargePayType: [
        {
          value: 1,
          label: '微信支付'
        },
        {
          value: 2,
          label: '支付宝支付'
        },
        {
          value: 3,
          label: '网银支付'
        }
      ],
      chargePayStatusModel: null,
      // 订单数
      total: null,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      drugDialogVisible: false,
      currentRow: null,
      editCurrentRow: null,
      // 添加用户的表单数据
      addForm: {},
      addFormRules: {
        did: [{ required: false, message: '请选择科室' }],
        pid: [{ required: false, message: '请输入病人姓名进行搜索' }],
        docId: [{ required: false, message: '请输入医生姓名进行搜索' }],
        drugOrderId: [{ required: false, message: '请选择处方', trigger: 'blur' }],
        chargePayAccount: [{ required: true, message: '请输入支付费用', trigger: 'blur' }],
        chargePayActualAccount: [{ required: true, message: '请输入实际支付费用', trigger: 'blur' }],
        chargePayType: [{ required: false, message: '请输入支付方式', trigger: 'blur' }],
        chargePayStatus: [{ required: false, message: '请输入是否已支付', trigger: 'blur' }]
      },

      editDialogVisible: false,
      editForm: {},
      editFormId: null,
      editFormRules: {
        did: [{ required: false, message: '请选择科室', trigger: 'blur' }],
        pid: [{ required: false, message: '请输入病人id', trigger: 'blur' }],
        docId: [{ required: false, message: '请输入医生id', trigger: 'blur' }],
        drugOrderId: [{ required: false, message: '请输入处方总订单id', trigger: 'blur' }],
        chargePayAccount: [{ required: true, message: '请输入支付费用', trigger: 'blur' }],
        chargePayActualAccount: [{ required: true, message: '请输入实际支付费用', trigger: 'blur' }],
        chargePayType: [{ required: false, message: '请输入支付方式', trigger: 'blur' }],
        chargePayStatus: [{ required: false, message: '请输入是否已支付', trigger: 'blur' }]
      },
      editDepartmentTree: [],
      editDepartmentProps: {
        value: 'id',
        label: 'dname',
        children: 'children'
      },
      editSelectedKeys: [],
      editChargePayStatusModel: null,
      editChargePayAccountModel: null,
      editChargePayActualAccountModel: null,
      editChargePayType: [
        {
          value: 1,
          label: '微信支付'
        },
        {
          value: 2,
          label: '支付宝支付'
        },
        {
          value: 3,
          label: '网银支付'
        }
      ],
      editChargePayTypeModel: '',
      editDrugList: [],
      editDrugIdList: [],
      chargeMultipleSelection: [],
      detailDialogVisible: false,
      detailId: null,
      detailList: {
        id: '',
        pName: '',
        docName: '',
        drugName: '',
        depName: '',
        chargePayAccount: '',
        chargePayActualAccount: '',
        chargePayType: '',
        chargePayStatus: ''
      },
      patientList: {
        name: '',
        num: '',
        sex: '',
        age: '',
        allergic: '',
        address: '',
        type: '',
        cardNum: ''
      },
      patientDialogVisible: false,
      patientId: null,
      docList: {
        name: '',
        year: '',
        sex: '',
        age: '',
        phone: '',
        edu: '',
        ach: '',
        dep: ''
      },
      docDialogVisible: false,
      docId: null
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
    // 获取当前页面订单列表
    async getList() {
      const result = await this.$http.get('/charge', {
        params: this.query
      })
      console.log(result)
      if (result.data.code != 0) {
        return this.$message.error('获取订单列表失败')
      }
      this.list = result.data.data.records
      this.total = result.data.data.total
      for (const v of this.list) {
        if (v.chargePayType == 1) {
          v.chargePayType = '微信支付'
        } else if (v.chargePayType == 2) {
          v.chargePayType = '支付宝支付'
        } else if (v.chargePayType == 3) {
          v.chargePayType = '网银支付'
        }
        if (v.chargePayStatus == 1) {
          v.chargePayStatus = true
        } else {
          v.chargePayStatus = false
        }
        v.gmtCreate = this.formateDate(v.gmtCreate)
      }
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getList()
    },
    // 点击按钮,添加新订单
    addCharge() {
      this.$refs.addFormRef.validate(async valid => {
        // 绑定病人与医生支付方式是否支付的id
        this.addForm.pid = this.patient.id
        this.addForm.docId = this.doc.id
        this.addForm.chargePayType = this.chargePayTypeModel
        // console.log(this.chargePayStatusModel)
        this.addForm.chargePayStatus = this.chargePayStatusModel
        if (!valid) return
        // 可以发起添加用户的网络请求
        const result = await this.$http.post('/charge/save', this.addForm)
        if (result.data.code == 0) {
          this.$message.success('添加' + result.data.msg)
        } else {
          this.$message.error('添加失败')
        }
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getList()
      })
    },
    // 点击按钮 实现修改订单数据
    editCharge() {
      this.$refs.editFormRef.validate(async valid => {
        // 绑定病人与医生支付方式是否支付的id
        if (this.editPatient.id != null) {
          this.editForm.pid = this.editPatient.id
        }
        if (this.editDoc.id != null) {
          this.editForm.docId = this.editDoc.id
        }
        this.editForm.chargePayAccount = this.editChargePayAccountModel
        this.editForm.chargePayActualAccount = this.editChargePayActualAccountModel
        this.editForm.chargePayType = this.editChargePayTypeModel
        this.editForm.chargePayStatus = this.editChargePayStatusModel
        if (!valid) return
        // 可以发起添加用户的网络请求
        const result = await this.$http.post('/charge/update', this.editForm)
        console.log(result)
        if (result.data.code == 0) {
          this.$message.success('修改' + result.data.msg)
        } else {
          this.$message.error('修改失败')
        }
        // 隐藏添加用户的对话框
        this.editDialogVisible = false
        // 重新获取用户列表数据
        this.getList()
      })
    },
    // 新增窗口中获取科室信息
    getDepartmentData() {
      this.$http.get('/department/tree').then(res => {
        // console.log(res)
        if (res.data.code == 0) {
          this.departmentTree = res.data.data[0].children
          this.deleteEmptyGroup(this.departmentTree)
          // console.log(this.departmentTree)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改窗口中获取科室信息
    editGetDepartmentData() {
      this.$http.get('/department/tree').then(res => {
        // console.log(res)
        if (res.data.code == 0) {
          this.editDepartmentTree = res.data.data[0].children
          this.deleteEmptyGroup(this.editDepartmentTree)
          // console.log(this.departmentTree)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 新增窗口监听科室选择
    departmentChange() {
      this.addForm.did = this.selectedKeys[1]
    },
    // 修改窗口监听科室选择
    editDepartmentChange() {
      this.editForm.did = this.editSelectedKeys[1]
    },
    // 删除科室第三级 getDepartmentData中被调用
    deleteEmptyGroup(treeData) {
      return new Promise(resolve => {
        function traversal(data) {
          data.map(item => {
            for (let info in item) {
              if (item['children']) {
                if (item['children'].length > 0) {
                  traversal(item['children'])
                }
                if (item['children'].length == 0) {
                  delete item['children']
                }
              }
            }
          })
        }
        traversal(treeData)
        resolve(treeData)
      })
    },
    // 新增窗口输入框搜索病人
    filterPatient() {
      this.$http.get('/patient-do/list', { params: { page: 1, size: 1, username: this.patientModel } }).then(res => {
        // console.log(res)
        if (res.data.code == 0) {
          this.patientOptions = res.data.data.records[0]
          // console.log(this.patientOptions)
          this.patient.id = this.patientOptions.id
          this.patient.name = this.patientOptions.pname
          // console.log(this.patient)
        }
      })
    },
    // 修改窗口输入框搜索病人
    editFilterPatient() {
      this.$http.get('/patient-do/list', { params: { page: 1, size: 1, username: this.editPModel } }).then(res => {
        // console.log(res)
        if (res.data.code == 0) {
          this.editPatientOptions = res.data.data.records[0]
          // console.log(this.patientOptions)
          this.editPatient.id = this.editPatientOptions.id
          this.editPatient.name = this.editPatientOptions.pname
          // console.log(this.patient)
        }
      })
    },
    // 新增窗口输入框搜索医生
    filterDoc() {
      this.$http.get('/doctor/list', { params: { current: 1, size: 1, doctorName: this.docModel } }).then(res => {
        // console.log(res)
        if (res.data.code == 0) {
          this.docOptions = res.data.data.records[0]
          // console.log(this.docOptions)
          this.doc.id = this.docOptions.did
          this.doc.name = this.docOptions.docName
          // console.log(this.doc)
        }
      })
    },
    // 修改窗口输入框搜索医生
    editFilterDoc() {
      this.$http.get('/doctor/list', { params: { current: 1, size: 1, doctorName: this.editDocModel } }).then(res => {
        // console.log(res)
        if (res.data.code == 0) {
          this.editDocOptions = res.data.data.records[0]
          // console.log(this.docOptions)
          this.editDoc.id = this.editDocOptions.did
          this.editDoc.name = this.editDocOptions.docName
          // console.log(this.doc)
        }
      })
    },
    // 清空当前订单列表多选
    chooseClear() {
      this.$refs.chargeTableRef.clearSelection()
    },
    // 新增窗口获取处方列表数据
    async getDrugData() {
      this.drugList.splice(0, this.drugList.length)
      this.drugIdList.splice(0, this.drugIdList.length)
      const result = await this.$http.get('/drugOrder/list', {
        params: this.drugQuery
      })
      console.log(result)
      if (result.data.code != 0) {
        return this.$message.error('获取处方列表失败')
      }
      for (let i = 0; i < result.data.data.records.length; ++i) {
        this.drugIdList.push(result.data.data.records[i].id)
      }
      for (let i = 0; i < this.drugIdList.length; ++i) {
        const result2 = await this.$http.get('/drugOrder/getOne', { params: { drugOrderId: this.drugIdList[i] } })
        if (result2.data.code == 0 && result2.data.data != '') {
          for (let i = 0; i < result2.data.data.length; i++) {
            this.drugList.push(result2.data.data[i])
          }
        }
      }
      console.log(this.drugList)
      this.drugTotal = this.drugList.length
    },
    // 修改窗口获取处方列表数据
    async editGetDrugData() {
      this.editDrugList.splice(0, this.editDrugList.length)
      this.editDrugIdList.splice(0, this.editDrugIdList.length)
      const result = await this.$http.get('/drugOrder/list', {
        params: this.editDrugQuery
      })
      // console.log(result)
      if (result.data.code != 0) {
        return this.$message.error('获取订单列表失败')
      }
      for (let i = 0; i < result.data.data.records.length; ++i) {
        this.editDrugIdList.push(result.data.data.records[i].id)
      }
      // console.log(this.editDrugIdList)
      for (let i = 0; i < this.editDrugIdList.length; ++i) {
        const result2 = await this.$http.get('/drugOrder/getOne', { params: { drugOrderId: this.editDrugIdList[i] } })
        // console.log(result2)
        if (result2.data.code == 0 && result2.data.data != '') {
          for (let i = 0; i < result2.data.data.length; i++) {
            this.editDrugList.push(result2.data.data[i])
          }
        }
      }
      // console.log(this.editDrugList)
      this.editDrugTotal = this.editDrugList.length
    },
    // 新增窗口选择处方 将id传给表单
    chooseDrug(val) {
      this.currentRow = val
      // console.log(val)
      this.drugModel = val.drugOrderId
      this.addForm.drugOrderId = val.drugOrderId
    },
    // 修改窗口选择处方 将id传给表单
    editChooseDrug(val) {
      this.editCurrentRow = val
      console.log(val)
      this.editDrugModel = val.drugOrderId
      this.editForm.drugOrderId = val.drugOrderId
    },
    // 监听处方页码值改变的事件
    drugHandleCurrentChange(newPage) {
      this.drugQuery.page = newPage
      this.getDrugData()
    },
    // 监听处方页码值改变的事件
    editDrugHandleCurrentChange(newPage) {
      this.editDrugQuery.page = newPage
      this.editGetDrugData()
    },
    // 清空处方选择
    cancelDrug() {
      this.drugModel = ''
      this.drugDialogVisible = false
    },
    // 清空新增表单的操作
    cancelAdd() {
      this.$refs.addFormRef.resetFields()
      this.selectedKeys.splice(0, this.selectedKeys.length)
      this.patientModel = ''
      this.docModel = ''
      this.drugModel = ''
      this.chargePayTypeModel = ''
      this.chargePayStatusModel = ''
      this.addDialogVisible = false
    },
    // 清空修改表单的操作
    cancelEdit() {
      // this.editForm = this.beforeEditForm
      this.editDialogVisible = false
    },
    // 批量删除订单
    async deletes() {
      for (let i = 0; i < this.chargeMultipleSelection.length; i++) {
        const result = await this.$http.delete('/charge/' + this.chargeMultipleSelection[i].id)
        // console.log(result)
        if (result.data.code != 0) {
          this.$message.error('删除失败')
        }
      }
      this.$message.success('删除成功')
      this.getList()
    },
    async editOne(id) {
      this.editFormId = id
      const result1 = await this.$http.get('/charge/getOne', { params: { id: this.editFormId } })
      console.log(result1)
      if (result1.data.code == 0) this.editDialogVisible = true
      this.editForm = result1.data.data
      const result2 = await this.$http.get('/department/getOne', { params: { id: this.editForm.did } })
      if (result2.data.code == 0) this.editSelectedKeys.splice(0, this.editSelectedKeys.length)
      this.editSelectedKeys.push(result2.data.data.pid)
      this.editSelectedKeys.push(this.editForm.did)
      // console.log(this.editSelectedKeys)
      const result3 = await this.$http.get('/patient-do/getOne', { params: { id: this.editForm.pid } })
      if (result3.data.code == 0) this.editPatientModel = result3.data.data.pname
      const result4 = await this.$http.get('/doctor/getOne', { params: { id: this.editForm.docId } })
      if (result4.data.code == 0) this.editDocModel = result4.data.data.docName
      this.editDrugModel = this.editForm.drugOrderId
      this.editChargePayTypeModel = result1.data.data.chargePayType
      this.editChargePayStatusModel = result1.data.data.chargePayStatus
      this.editChargePayAccountModel = result1.data.data.chargePayAccount
      this.editChargePayActualAccountModel = result1.data.data.chargePayActualAccount
      // console.log(this.editChargePayStatusModel)
    },
    // 监听订单多选
    chargeSelectionChange(val) {
      this.chargeMultipleSelection = val
      console.log(this.chargeMultipleSelection)
    },
    // 删除一个订单
    async deleteOne(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将删除该订单记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const result = await this.$http.delete('/charge/' + id)
      console.log(result)
      if (result.data.code != 0) {
        this.$message.error('删除失败')
      } else {
        this.$message.success('删除成功')
        this.getList()
      }
    },
    // 给点击订单的事件传订单id
    openDetail(id) {
      this.detailId = id
      this.detailDialogVisible = true
    },
    // 退出卡片后清空订单详情列表
    clearDetail() {
      this.detailList.id = ''
      this.detailList.pName = ''
      this.detailList.docName = ''
      this.detailList.drugName = ''
      this.detailList.depName = ''
      this.detailList.chargePayAccount = ''
      this.detailList.chargePayActualAccount = ''
      this.detailList.chargePayType = ''
      this.detailList.chargePayStatus = ''
    },
    // 获取订单详情数据
    async getDetailData() {
      const result1 = await this.$http.get('/charge/getOne', { params: { id: this.detailId } })
      // console.log(result1)
      if (result1.data.code == 0) {
        this.detailList.id = result1.data.data.chargeNumber
        const result2 = await this.$http.get('/patient-do/getOne', { params: { id: result1.data.data.pid } })
        // console.log(result2)
        if (result2.data.code == 0) {
          this.detailList.pName = result2.data.data.pname
          const result3 = await this.$http.get('/doctor/getOne', { params: { id: result1.data.data.docId } })
          // console.log(result3)
          if (result3.data.code == 0) {
            this.detailList.docName = result3.data.data.docName
            const result4 = await this.$http.get('/drugOrder/getOne', { params: { drugOrderId: result1.data.data.drugOrderId } })
            // console.log(result4)
            if (result4.data.code == 0 && result4.data.data != '') {
              for (let i = 0; i < result4.data.data.length; i++) {
                this.detailList.drugName = this.detailList.drugName + ' ' + result4.data.data[i].drugName
              }
              const result5 = await this.$http.get('/department/getOne', { params: { id: result1.data.data.did } })
              // console.log(result5)
              if (result5.data.code == 0) {
                this.detailList.depName = result5.data.data.dname
              }
              this.detailList.chargePayAccount = result1.data.data.chargePayAccount
              this.detailList.chargePayActualAccount = result1.data.data.chargePayActualAccount
              if (result1.data.data.chargePayType == 1) {
                this.detailList.chargePayType = '微信支付'
              } else if (result1.data.data.chargePayType == 2) {
                this.detailList.chargePayType = '支付宝支付'
              } else if (result1.data.data.chargePayType == 3) {
                this.detailList.chargePayType = '网银支付'
              }
              if (result1.data.data.chargePayStatus == 1) {
                this.detailList.chargePayStatus = '已支付'
              } else {
                this.detailList.chargePayStatus = '未支付'
              }
            }
          }
        }
      }
    },
    // 给点击病人的事件传病人id
    openPatient(id) {
      this.patientId = id
      this.patientDialogVisible = true
    },
    // 退出卡片后清空病人详情
    clearPatient() {
      this.patientList.name = ''
      this.patientList.num = ''
      this.patientList.sex = ''
      this.patientList.age = ''
      this.patientList.allergic = ''
      this.patientList.address = ''
      this.patientList.type = ''
      this.patientList.cardNum = ''
    },
    // 获取病人详情数据
    async getPatientData() {
      const result1 = await this.$http.get('/patient-do/getOne', { params: { id: this.patientId } })
      // console.log(result1)
      if (result1.data.code == 0) {
        this.patientList.name = result1.data.data.pname
        this.patientList.num = result1.data.data.pidno
        if (result1.data.data.psex == 1) {
          this.patientList.sex = '男'
        } else {
          this.patientList.sex = '女'
        }
        this.patientList.age = result1.data.data.page
        this.patientList.allergic = result1.data.data.pallergic
        this.patientList.address = result1.data.data.paddress
        const result2 = await this.$http.get('/card/getOne', { params: { id: result1.data.data.cardId } })
        // console.log(result2)
        if (result2.data.code == 0) {
          if (result2.data.data.cardType == 1) {
            this.patientList.type = '医保卡'
          } else if (result2.data.data.cardType == 0) {
            this.patientList.type = '医疗卡'
          }
          this.patientList.cardNum = result2.data.data.cardNumber
        }
      }
    },
    // 给点击医生的事件传医生id
    openDoc(id) {
      this.docId = id
      this.docDialogVisible = true
    },
    // 退出卡片后清空医生详情
    clearDoc() {
      this.docList.name = ''
      this.docList.year = ''
      this.docList.sex = ''
      this.docList.age = ''
      this.docList.phone = ''
      this.docList.edu = ''
      this.docList.type = ''
      this.docList.ach = ''
      this.docList.dep = ''
    },
    // 获取医生详情数据
    async getDocData() {
      const result1 = await this.$http.get('/doctor/getOne', { params: { id: this.docId } })
      // console.log(result1)
      if (result1.data.code == 0) {
        this.docList.name = result1.data.data.docName
        this.docList.year = result1.data.data.docYear
        if (result1.data.data.docSex == 1) {
          this.docList.sex = '男'
        } else {
          this.docList.sex = '女'
        }
        this.docList.age = result1.data.data.docAge
        this.docList.phone = result1.data.data.docPhone
        this.docList.edu = result1.data.data.docEducation
        this.docList.ach = result1.data.data.docAchievement
        const result2 = await this.$http.get('/department/getOne', { params: { id: result1.data.data.did } })
        console.log(result2)
        if (result2.data.code == 0) {
          this.docList.dep = result2.data.data.dname
        }
      }
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
