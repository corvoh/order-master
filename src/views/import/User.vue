<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.username" placeholder="请输入用户名搜索" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
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

        <el-table-column label="头像" width="50">
          <template slot-scope="scope">
            <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column prop="code" label="角色名称">
          <template slot-scope="scope">
            <el-tag :key="item.id" size="small" type="info" v-for="item in scope.row.roles">{{item.name}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱"></el-table-column>

        <el-table-column prop="active" label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.active === false" type="success">正常</el-tag>
            <el-tag size="small" v-else-if="scope.row.active === true" type="danger">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="gmtCreate" width="200" label="创建时间"></el-table-column>
        <el-table-column prop="gmtModified" width="200" label="更新时间"></el-table-column>
        <el-table-column prop="icon" width="260px" label="操作">
          <template slot-scope="scope">
            <el-button style="color:RGB(16, 40, 71)" type="text" @click="roleHandle(scope.row.id)">分配角色</el-button>
            <el-divider direction="vertical"></el-divider>

            <el-button style="color:RGB(16, 40, 71)" type="text" @click="repassHandle(scope.row.id, scope.row.username)">重置密码</el-button>
            <el-divider direction="vertical"></el-divider>

            <el-button style="color:RGB(16, 40, 71)" type="text" @click="editHandle(scope.row.id)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>

            <template>
              <el-popconfirm title="确定删除吗？" @confirm="delHandle(scope.row.id)">
                <el-button style="color:RGB(16, 40, 71)" type="text" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :current-page="current"
        :page-size="size"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--新增对话框-->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>
          <el-alert title="初始密码" :closable="false" type="info" style="line-height: 12px;"></el-alert>
        </el-form-item>

        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="active" label-width="100px">
          <el-radio disabled v-model="editForm.active" label="false">启用</el-radio>
          <el-radio disabled v-model="editForm.active" label="true">禁止</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible" width="600px">
      <el-form :model="roleForm">
        <el-tree
          :data="roleTreeData"
          show-checkbox
          ref="roleTree"
          :check-strictly="checkStrictly"
          node-key="id"
          :default-expand-all="true"
          :props="defaultProps"
        ></el-tree>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitRoleHandle('roleForm')">确 定</el-button>
      </div>
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
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },

      multipleSelection: [],

      roleDialogFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleForm: {},
      roleTreeData: [],
      treeCheckedKeys: [],
      checkStrictly: true
    }
  },
  created() {
    this.getUserList()

    this.$http
      .get('/sys/role', {
        params: {
          page: this.current,
          size: this.size
        }
      })
      .then(res => {
        this.roleTreeData = res.data.data.records
      })
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
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.current = val
      this.getUserList()
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
    },

    getUserList() {
      this.$http
        .get('/sys/user', {
          params: {
            username: this.searchForm.username,
            page: this.current,
            size: this.size
          }
        })
        .then(res => {
          this.tableData = res.data.data.records
          console.log(this.tableData)
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].gmtCreate = this.formateDate(this.tableData[i].gmtCreate)
            this.tableData[i].gmtModified = this.formateDate(this.tableData[i].gmtModified)
          }
          this.size = res.data.data.size
          this.current = res.data.data.current
          this.total = res.data.data.total
        })
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post('/sys/user/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功',
              type: 'success',
              onClose: () => {
                this.getUserList()
              }
            })

            this.dialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editHandle(id) {
      this.$http
        .get('/sys/user/getOne', {
          params: {
            id: id
          }
        })
        .then(res => {
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

      this.$http.delete('/sys/user/' + ids).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getUserList()
          }
        })
      })
    },

    roleHandle(id) {
      this.roleDialogFormVisible = true

      this.$http
        .get('/sys/user/getOne', {
          params: {
            id: id
          }
        })
        .then(res => {
          this.roleForm = res.data.data

          let roleIds = []
          res.data.data.roles.forEach(row => {
            roleIds.push(row.id)
          })

          this.$refs.roleTree.setCheckedKeys(roleIds)
        })
    },

    submitRoleHandle(formName) {
      var roleIds = this.$refs.roleTree.getCheckedKeys()

      console.log(roleIds)

      this.$http.post('/sys/user/perm?userId=' + this.roleForm.id + '&roleIds=' + roleIds).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getUserList()
          }
        })

        this.roleDialogFormVisible = false
      })
    },
    repassHandle(id, username) {
      this.$confirm('将重置用户【' + username + '】的密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .put('/sys/user/repass', {
            params: {
              id: id,
              password: ''
            }
          })
          .then(res => {
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功',
              type: 'success',
              onClose: () => {}
            })
          })
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
