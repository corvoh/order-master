<template>
  <div>
    <el-card>
      <!-- 添加按钮 -->
      <el-button icon="el-icon-circle-plus-outline" @click="addDialogVisible = true" style="width:100px;margin-right:20px;">新增</el-button>

      <el-button type="primary" class="short" icon="el-icon-delete" @click="removeRoomsById">批量删除</el-button>

      <!-- 搜索框 -->
      <div style="float:right;">
        <el-input
          placeholder="请输入搜索内容"
          v-model="roomlist.dname"
          class="input-with-select"
          style="width:250px"
          clearable
          @clear="getRoomList"
        >
        <el-button slot="append" icon="el-icon-search" @click="getRoomList"></el-button>
        </el-input>

        <!-- 添加科室对话框 -->
        <el-dialog title="添加科室" :visible.sync="addDialogVisible" @close="addDialogClose" width="30%">
          <!-- 内容主体区 -->
          <el-form :model="addform" :rules="addformRules" ref="addformRef" label-width="100px">
            <!-- 选择pid -->
            <el-form-item label="选择父id" prop="pid">
              <el-select v-model="addform.pid" placeholder="请选择上级科室">
                <template v-for="item in usePid">
                  <el-option :label="item.dname" :value="item.id" :key="item.id"></el-option>
                  <template v-for="child in item.children">
                    <el-option :label="child.dname" :value="child.id" :key="child.id">
                      <span>{{ "- " + child.dname}}</span>
                    </el-option>
                  </template>
                </template>
              </el-select>
            </el-form-item>

            <el-form-item label="科室名称" prop="dname">
              <el-input v-model="addform.dname"></el-input>
            </el-form-item>

            <el-form-item label="科室电话" prop="dphone">
              <el-input v-model="addform.dphone"></el-input>
            </el-form-item>

            <el-form-item label="科室内容" prop="dintro">
              <el-input v-model="addform.dintro"></el-input>
            </el-form-item>
          </el-form>

          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoom">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 修改科室对话框 -->
        <el-dialog title="修改科室" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
          <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px" v-if="editForm">
            <el-form-item label="科室id" prop="id">
              <el-input v-model="editForm.id"></el-input>
            </el-form-item>

            <el-form-item label="科室名称" prop="dname">
              <el-input v-model="editForm.dname"></el-input>
            </el-form-item>

            <el-form-item label="科室电话" prop="dphone">
              <el-input v-model="editForm.dphone"></el-input>
            </el-form-item>

            <el-form-item label="科室内容" prop="dintro">
              <el-input v-model="editForm.dintro"></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoomsInfo">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 表格树 -->
      <el-table
        max-height="600px"
        :data="roomlist"
        style="width: 100%;margin-top:10px"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <!-- id科室编号 pid上级父类 -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column props="id" label="编号" width="100"></el-table-column>
        <el-table-column props="dname" label="科室名称" width="150"></el-table-column>
        <el-table-column props="dphone" label="科室电话" width="150"></el-table-column>
        <el-table-column props="dintro" label="科室简介"></el-table-column>
        <el-table-column props="gmtCreate" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" circle @click="editDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="removeRoomById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      multipleSelection: [],
      input: '',
      value: '',
      roomlist: [],
      total: 0,
      editDialogVisible: false,
      addDialogVisible: false,
      addform: {},
      usePid: [],
      //判断手机号是否重复
      flag:0,
      //添加表单验证的规则名称
      addformRules: {
        dname: [
          {
            required: true,
            message: '请输入科室名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '科室名长度在2~10之间',
            trigger: 'blur'
          }
        ],
        dphone: [
          {
            required: true,
            message: '请输入科室电话',
            trigger: 'blur'
          },
          {
            max: 11,
            message: '科室电话长度只能为11位',
            trigger: 'blur'
          }
        ],
        dintro: [
          {
            required: true,
            message: '请输入科室内容',
            trigger: 'blur'
          },
          {
            min: 10,
            max: 100,
            message: '公告内容长度在10~100之间',
            trigger: 'blur'
          }
        ]
      },
      editForm: {},
      editFormRules: {
        dname: [
          {
            required: true,
            message: '请输入科室名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '科室名长度在2~10之间',
            trigger: 'blur'
          }
        ],
        dphone: [
          {
            required: true,
            message: '请输入科室电话',
            trigger: 'blur'
          },
          {
            max: 11,
            message: '科室电话长度只能为11位',
            trigger: 'blur'
          }
        ],
        dintro: [
          {
            required: true,
            message: '请输入科室内容',
            trigger: 'blur'
          },
          {
            min: 10,
            max: 100,
            message: '公告内容长度在10~100之间',
            trigger: 'blur'
          }
        ]
      },
      index: 0,
      use: []
    }
  },
  created() {
    this.getRoomList()
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
    //第一步 获取科室表数据
    async getRoomList() {
      const res = await this.$http.get('/department/tree');
      this.usePid = res.data.data;
      //第二部 把科室表传给roomlist
      this.roomlist = res.data.data[0].children; //获取1 2级数据
      console.log(res)
      console.log(this.roomlist)
      let result = this.roomlist.length
      let recieve = this.roomlist
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
    //监听添加科室对话框的关闭事件
    addDialogClose() {
      this.$refs.addformRef.resetFields()
    },
    //点击按钮 添加新科室
    addRoom() {
      //第三步 获取roomlist的长度
      let one = this.roomlist.length;
      console.log(one);
      //第四步 遍历roomlist的一二层
      this.$refs.addformRef.validate(async valid => {
        for(let i= 0;i < one ;i++){
          let two = this.roomlist[i].children.length;
          console.log(two);
          if(this.addform.dphone == this.roomlist[i].dphone){
              this.flag = 1;
              this.$message.error("该手机号已存在");
              for(let j = 0;j < two; j++){
                if(this.addform.dphone == this.roomlist[i].children[j].dphone){
                  this.flag = 1;
                  this.$message.error("该手机号已存在");
                }
              }
          }
        }
        console.log(this.flag);
        if(this.flag == 0){
            // this.roomlist.push();
            // this.roomlist.children.push();
            this.$refs.addformRef.validate(async valid => {
              if (!valid) return
              const res = await this.$http.post('/department/save', this.addform)
              if (res.data.code != 0) {
                this.$message.error('添加科室失败')
              }
              this.$message.success('添加科室成功')
              //隐藏添加的对话框
              this.addDialogVisible = false
              //刷新重掉getRoomList函数 重获列表数据
              this.getRoomList()
            })
          }
      
      })
    },
    //展示编辑科室的对话框
    async editDialog(id) {
      const res = await this.$http.get('/department/getOne?id=' + id)
      console.log(id)
      console.log(res)
      if (res.data.code != 0) {
        return this.$message.error('编辑科室失败')
      }
      console.log(this.editForm)
      this.editForm = res.data.data
      this.editDialogVisible = true
      this.getRoomList()
    },
    //监听修改科室对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改科室信息并提交
    editRoomsInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        //发起修改科室信息的数据请求
        const res = await this.$http.post('/department/update', this.editForm)
        if (res.data.code != 0) {
          return this.$message.error('更新科室失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        //刷新数据列表
        this.getRoomList()
        //提示修改成功
        this.$message.success('更新科室成功')
      })
    },
    //根据id删除科室
    async removeRoomById(id) {
      console.log(id)
      const result = await this.$confirm('此操作将永久删除该科室, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认删除 返回值为字符串 confirm 取消则为cancle
      // console.log(res);
      console.log(confirm)
      if (result != 'confirm') {
        return this.$message.info('取消了删除')
      }
      console.log('确认了删除')
      const res = await this.$http.delete('/department/' + id)
      if (res.data.code != 0) {
        this.$message.error('删除科室失败!')
      }
      this.getRoomList()
      this.$message.success('删除科室成功!')
    },

    //批量删除科室
    async removeRoomsById() {
      console.log(this.multipleSelection)
      let long = this.multipleSelection.length
      let id
      for (let i = 0; i < long; i++) {
        id = this.multipleSelection[i].id
        this.result.push(id)
      }
      console.log('result:', this.result)
      const res = await this.$http.delete('/department?idsStr=' + this.result)
      if (res.data.code != 0) {
        this.$message.error('批量删除科室失败!')
      }
      this.getUserList()
      this.$message.success('批量删除科室成功')
    }
  }
}
</script>

<style scoped>
</style>