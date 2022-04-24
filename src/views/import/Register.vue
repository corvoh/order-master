<template>
    <div>
        <div class="handle">
            <!-- 增加预约按钮 -->
            <el-button 
            type="text" 
            icon="el-icon-circle-plus-outline" 
            @click="addDialogVisible = true" 
            style="width:100px;background-color:#409EFF;color:white;margin-right:50px;">
                新增
            </el-button>

            <!-- 添加预约对话框 -->
            <el-dialog
            title="添加预约"
            :visible.sync="addDialogVisible"
            @close='addDialogClose'
            width="30%">
                <!-- 内容主体区  -->
                <el-form 
                :model="addform" 
                :rules="addformRules" 
                ref="addformRef" 
                label-width="100px">
                    <!-- 第一步 选科室id  定义一个change事件 触发时 显示隐藏的排班内容 -->
                    <el-form-item label="选择科室" prop="did">
                            <template v-for="item in roomlist">
                                <el-select v-model="addform.did" placeholder="请选择上级科室类型" @change="getScheduleList($event)">
                                    <template v-for="child in item.children">
                                        <el-option  :label="child.dname" :value="child.id"></el-option>
                                        <!-- <template childson in child.children>
                                            <el-optoon :label="childson.dname" :value="child.id"></el-optoon>
                                        </template> -->
                                    </template>
                                </el-select>
                            </template>
                    </el-form-item>

                    <!-- 显示排班内容-->
                    <el-form-item label="排班内容" prop="scheduleId" v-show="isShow">
                        <el-select v-model="addform.scheduleId" placeholder="请选择预约时间段">
                            <template v-for="item in schedulelist">
                                    <el-option :label="item.sdate" :value="item.id">
                                        <span>{{ "- " + item.id}}</span>
                                    </el-option>
                            </template>
                        </el-select>
                    </el-form-item>

                    <!-- 选择docId -->
                    <el-form-item label="选择医生" prop="docName">
                        <el-select v-model="addform.docName" placeholder="请选择医生">
                            <template v-for="item in doclist">
                                    <el-option :label="item.dname" :value="item.dname">
                                        <span>{{ "- " + item.dname}}</span>
                                    </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    

                    <el-form-item label="患者名字" prop="pname">
                        <el-input v-model="addform.pname"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="dphone">
                        <el-input v-model="addform.dphone"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域  -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRegister">确 定</el-button>
                </span>
            </el-dialog>

            <el-button type="primary" class="short" icon="el-icon-delete" @click="batchDelete()">批量删除</el-button>

            <el-input  
            placeholder="请输入内容" 
            v-model="input" 
            style="width:200px;display:block;float:right"
            @keyup.enter.native="search()" 
            suffix-icon ="el-icon-search">
            </el-input>
        </div>
        <el-table 
        ref="multipleTable" 
        :data="registerlist" 
        tooltip-effect="dark"
        style="width: 100%; " 
        @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55;"></el-table-column>
            <el-table-column prop="brNumber" label="预约编号" width="320"></el-table-column>
            <el-table-column prop="pname" label="患者" width="120"></el-table-column>
            <el-table-column prop="pphone" label="手机号" width="120"></el-table-column>
            <el-table-column prop="docName" label="医生" width="80"></el-table-column>
            <el-table-column prop="dname" label="科室" width="120"></el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" width="200"></el-table-column>
            <el-table-column prop="syyMmDd" label="预约挂号时间" width="220"></el-table-column>
            <el-table-column prop="Pway" label="操作" width="120"></el-table-column>
        </el-table>

        <div class="block">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.current"
            :page-sizes="[2, 4, 8, 10]"
            :page-size="queryInfo.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {     
    data() {
        return {
            flag:0,
            multipleSelection: [],
            input: '',
            value: '',
            // 获取公告列表参数对象
            queryInfo: {
                page:1,
                size:10,
                current:1
            },
            total:0,
            //是否显示隐藏内容
            isShow:false,
            registerlist:[],
            patientlist:[],
            doclist:[],
            roomlist:[],
            schedulelist:[],
            //控制用户添加的对话框是否显示
            addDialogVisible:false,
            //添加用户表单数据
            addform:{
            },
            //添加表单验证的规则名称
            addformRules:{
                pname: [{
                    required:true,
                    message:'请输入患者名字',
                    trigger:'blur',
                },
                {
                    min:2,
                    max:10,
                    message:'患者名字不超过4个字',
                    trigger:'blur'
                }
                ],
                dphone: [{
                    required:true,
                    message:'请输入手机号',
                    trigger:'blur',
                },
                {
                    min:11,
                    max:11,
                    message:'手机号长度为11位',
                    trigger:'blur'
                },
                ],
                dname:[{
                    required:true,
                    message:'请输入科室',
                    trigger:'blur'
                },
                {
                    min:2,
                    max:10,
                    message:'科室名字长度在2~10之间',
                    trigger:'blur'
                }],
                docName:[{
                    required:true,  
                    message:'请输入医生id',
                    trigger:'blur'
                },
                {
                    min:2,
                    max:5,
                    message:'医生id长度在2~5之间',
                    trigger:'blur'
                }],
                syyMmDd:[{
                    required:true,  
                    message:'请输入预约',
                    trigger:'blur'
                }]
            },
            patientList: {
            },
        }
    },
    created() {
        //预约表
        this.getRegisterList();
        //病人表
        this.getPatientList();
        //科室表
        this.getRoomList();
        //医生表
        this.getDocList();
        //排班表
        this.getScheduleList();
    },
    methods: {
        toggleSelection(rows) {
            if (rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });
            } else {
            this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //用js添加样式
        // tableRowStyle({row, rowIndex,column,columnIndex}){
        //  :row-style="tableRowStyle"
        //  :header-cell-style="tableHeaderStyle"
        //     return {
        //         'background-color':'#2A4866',
        //         "text-align":"center;"
        //     }
        // },
        // tableHeaderStyle({row, rowIndex,column,columnIndex}){
        //     return {
        //         'background-color':'#2A4866',
        //         "text-align":"center;"
        //     }
        // },
        //监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.size = newSize;
            this.getRegisterList();
        },
        //监听页码 改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.current = newPage;
            this.getRegisterList();
        },
        async getRegisterList() {
            const res =await this.$http.get('/beforeRegister/list?',{
                params: this.queryInfo
            })
            //预约表数据
            console.log(res);
            if(res.data.code != 0) {
                return this.$message.error('获取预约列表失败')
            }
            //把预约表数据传给registerlist
            this.registerlist = res.data.data.records;
            this.total = res.data.data.total
            let result = res.data.data.records.length;
            let recieve = res.data.data.records
            for(let i = 0;i < result;i++){
                recieve[i].gmtCreate= this.format(recieve[i].gmtCreate);
                recieve[i].syyMmDdDate= this.format(recieve[i].syyMmDdDate)  
                // this.registerlist[i].push(recieve[i])
            }
            console.log(this.registerlist);
        },
             //获取科室表
        async getRoomList() {
            const res =await this.$http.get('/department/tree');
            this.roomlist = res.data.data;//获取1 2级数据
            console.log(res);   
            console.log(this.roomlist);
            let result =this.roomlist.length;
            let recieve = this.roomlist;
            for(let i = 0;i < result;i++){
                recieve[i].gmtCreate= this.format(recieve[i].gmtCreate);
                recieve[i].gmtModified= this.format(recieve[i].gmtModified);
            }
        },
        //获取医生表
        async getDocList() {
            const res =await this.$http.get('/doctor/list',{
                params: this.queryInfo
            });
            console.log(res);  
            this.doclist = res.data.data.records;
            console.log(this.doclist);
            let result =this.roomlist.length;
            let recieve = this.roomlist;
            for(let i = 0;i < result;i++){
                recieve[i].gmtCreate= this.format(recieve[i].gmtCreate);
                recieve[i].gmtModified= this.format(recieve[i].gmtModified);
            };
        },
        //获取排班表
        async getScheduleList(id) {
            console.log(id);
            this.isShow = true;
        //     //添加预约  要获取医生的排班
            const res =await this.$http.get('/schedule/getScheduleList?dId='+id);
            console.log(res);  
            this.schedulelist = res.data.data;
            console.log(this.doclist);
            let result =this.roomlist.length;
            let recieve = this.roomlist;
            for(let i = 0;i < result;i++){
                recieve[i].gmtCreate= this.format(recieve[i].gmtCreate);
                recieve[i].gmtModified= this.format(recieve[i].gmtModified);
            } 
        },
        format(date) {
            date = new Date(date);
            let y = date.getFullYear();  
            let m = date.getMonth() + 1;  
            m = m < 10 ? ('0' + m) : m;  
            let d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;  
            let h = date.getHours();  
            let minute = date.getMinutes();  
            minute = minute < 10 ? ('0' + minute) : minute; 
            let second= date.getSeconds();  
            second = minute < 10 ? ('0' + second) : second;  
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+ second;  
        },
        //监听添加预约对话框的关闭事件
        addDialogClose(){
            this.$refs.addformRef.resetFields();
        },
         //第一步 获取病人表
        async getPatientList(){
            const res = await this.$http.get('/patient-do/list',{
                params: this.queryInfo
            })
            console.log(res);
        //第二步 把病人表数据 传给数组 patientList 
            this.patientList = res.data.data.records;
            console.log(this.patientList);
        },
        //点击按钮添加预约
        async addRegister(){
        //第三步 获取patientList数组的长度
            let long = this.patientList.length;
        //第四步 循环病人表 如果和病人表的手机号相等 就弹出该病人已经 否则就进行网络请求
            for(let i= 0;i < long ;i++){
                if(this.addform.pphone == this.patientList[i].pphone){
                    this.flag = 1;
                    this.$message.error("该手机号已存在");
                }
            }
            console.log(this.flag);
            if(this.flag == 0){
                this.patientList.push()
                this.$refs.addformRef.validate(async valid => {
                    if(!valid) return
                    const res = await this.$http.post('/beforeRegister/save',this.addform) 
                    console.log(res);
                    console.log(this.addform);
                    if (res.data.code != 0){
                        this.$message.error("添加预约失败");
                    }
                    this.$message.success("添加预约成功"); 
                    //隐藏添加的对话框
                    this.addDialogVisible = false;
                    //刷新重掉getUserList函数 重获列表数据
                    this.getRegisterList()
                })
            }
        },

    }
}
</script>

<style scoped>
.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf{
    text-align: center;
}
</style>