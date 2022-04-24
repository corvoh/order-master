<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="请输入搜索内容" clearable @clear="getRoleList">
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogVisible = true">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm title="确定批量删除？" @confirm="delHandle(null)">
            <el-button type="danger" slot="reference" :disabled="delBtlStatu">批量删除</el-button>
          </el-popconfirm>
        </el-form-item>
      </el-form>

      <el-table max-height="585px" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="name" label="名称" width="120"></el-table-column>
        <el-table-column prop="code" label="唯一编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="描述" show-overflow-tooltip></el-table-column>

        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.active === 0" type="success">正常</el-tag>
            <el-tag size="small" v-else-if="scope.row.active === 1" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="操作">
          <template slot-scope="scope">
            <el-button style="color:RGB(16, 40, 71)" type="text" @click="permHandle(scope.row.id)">分配权限</el-button>
            <el-divider direction="vertical"></el-divider>

            <el-button style="color:RGB(16, 40, 71)" type="text" @click="editHandle(scope.row.id)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>

            <template>
              <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">
                <el-button style="color:RGB(16, 40, 71)" type="text" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total,  prev, pager, next, jumper"
        :current-page="current"
        :page-size="size"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--新增对话框-->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="角色名称" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="唯一编码" prop="code" label-width="100px">
          <el-input v-model="editForm.code" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="remark" label-width="100px">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="active" label-width="100px">
          <el-radio-group v-model="editForm.active">
            <el-radio :label="1">禁用</el-radio>
            <el-radio :label="0">正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">立即创建</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="permDialogVisible" width="600px">
      <el-form :model="permForm">
        <el-tree
          :data="permTreeData"
          show-checkbox
          ref="permTree"
          :default-expand-all="true"
          node-key="id"
          :check-strictly="true"
          :props="defaultProps"
        ></el-tree>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="permDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermFormHandle('permForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Role',
  data() {
    return {
      searchForm: {},
      delBtlStatu: true,

      total: 0,
      size: 10,
      current: 1,

      dialogVisible: false,
      editForm: {},

      tableData: [],

      editFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入唯一编码', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },

      multipleSelection: [],

      permDialogVisible: false,
      permForm: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permTreeData: []
    }
  },
  created() {
    this.getRoleList()

    this.$http.get('/sys/menu/tree').then(res => {
      this.permTreeData = res.data.data
    })
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
      console.log('勾选')
      console.log(val)
      this.multipleSelection = val

      this.delBtlStatu = val.length == 0
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.size = val
      this.getRoleList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.current = val
      this.getRoleList()
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
    },

    getRoleList() {
      this.$http
        .get('/sys/role', {
          params: {
            name: this.searchForm.name,
            page: this.current,
            size: this.size
          }
        })
        .then(res => {
          this.tableData = res.data.data.records
          this.size = res.data.data.size
          this.current = res.data.data.current
          this.total = res.data.data.total
        })
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post('/sys/role/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功',
              type: 'success',
              onClose: () => {
                this.getRoleList()
              }
            })

            this.dialogVisible = false
            this.resetForm(formName)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editHandle(id) {
      this.$http.get('/sys/role/getOne?id=' + id).then(res => {
        this.editForm = res.data.data

        this.dialogVisible = true
      })
    },
    delHandle(id) {
      var ids = []

      if (id) {
        ids.push(id)
      } else {
        this.multipleSelection.forEach(row => {
          ids.push(row.id)
        })
      }

      console.log(ids)

      this.$http.delete('/sys/role/' + id).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        })
      })
    },
    permHandle(id) {
      this.permDialogVisible = true

      this.$http.get('/sys/role/menus?id=' + id).then(res => {
        this.$refs.permTree.setCheckedKeys(res.data.data)
        this.permForm.id = id
        this.permForm.perms = res.data.data
      })
    },

    submitPermFormHandle(formName) {
      var menuIds = this.$refs.permTree.getCheckedKeys()

      console.log(menuIds)

      this.$http.post('/sys/role/menus/update?id=' + this.permForm.id + '&menuIdsStr=' + menuIds).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        })
        this.permDialogVisible = false
        this.resetForm(formName)
      })
    }
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>
