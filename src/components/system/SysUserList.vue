<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            
            <!-- 搜索框 -->
            <el-row :gutter="10">
                <el-col :span="18" >
                    <el-form :model="params" label-width="80px" :inline="true" size="small">
                        <el-form-item label="姓名">
                            <el-input v-model="params.trueName"></el-input>
                        </el-form-item>
                        <el-form-item label="电话">
                            <el-input v-model="params.phone"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="resetBtn">重置</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="addUser">添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            
           <!-- 列表 -->
           <el-table :data="tableList" border stripe>
                <el-table-column type="index" label="序号" width="50px"></el-table-column>
                <el-table-column label="姓名" prop="trueName"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="性别" prop="sex">
                    <template slot-scope="scope">
                        <el-tag type="danger" size="small" v-if="scope.row.sex==0">女</el-tag>
                        <el-tag type="danger" size="small" v-if="scope.row.sex==1">男</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="身份证号" prop="idCard"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="身份" prop="isAdmin">
                    <template slot-scope="scope">
                        <el-tag type="danger" size="small" v-if="scope.row.isAdmin==0">普通员工</el-tag>
                        <el-tag type="danger" size="small" v-if="scope.row.isAdmin==1">超级管理员</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="在职状态" prop="status">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" 
                            :active-value="0" 
                            active-text="在职"
                            :inactive-value="1"
                            inactive-text="离职"
                            @change="changeUserStatus(scope.row)">
                        </el-switch>    
                    </template>
                </el-table-column>
                <el-table-column label="是否可用" prop="enabled">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enabled" 
                            :active-value="true" 
                            active-text="可用"
                            :inactive-value="false"
                            inactive-text="禁用"
                            @change="changeUserEnabled(scope.row)">
                        </el-switch>    
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editUser(scope.row)">编辑</el-button>
                        <el-button type="primary" icon="el-icon-delete" size="small" @click="deleteUser(scope.row)">删除</el-button>
                        <el-button type="primary" icon="el-icon-delete" :disabled="scope.row.isAdmin==1" size="small" @click="assignRole(scope.row)">分配角色</el-button>
                    </template>
                </el-table-column>
           </el-table>
           
           <!-- 分页 -->
           <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page.sync="params.currentPage"
            :page-sizes="[5, 10, 15]"
            :page-size="params.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="params.total" background>
            :pager-count="7">
           </el-pagination>
           
            
        </el-card>
        
        <!-- 添加或修改对话框 -->
        <el-dialog
            :title="editDialog.title"
            :visible.sync="editDialog.visible"
            :width="editDialog.width">
            
            <el-form :model="editModel" ref="editForm" :rules="rules" label-width="80px" :inline="true" size="small">
                <el-form-item label="姓名:" prop="trueName">
                    <el-input v-model="editModel.trueName"></el-input>
                </el-form-item>
                <el-form-item prop="sex" style="width: 280px" label="性别:">
                    <el-radio-group v-model="editModel.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="phone" label="电话:">
                    <el-input v-model="editModel.phone"></el-input>
                </el-form-item>
                <el-form-item prop="idCard" label="身份证:">
                    <el-input v-model="editModel.idCard"></el-input>
                </el-form-item>
                <el-form-item prop="username" label="用户名:">
                    <el-input v-model="editModel.username"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码:" v-if="editModel.type=='0'">
                    <el-input type="password" v-model="editModel.password"></el-input>
                </el-form-item>
                <el-form-item prop="status" style="width: 280px" label="离职:">
                    <el-radio-group v-model="editModel.status">
                    <el-radio :label="0">在职</el-radio>
                    <el-radio :label="1">离职</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="enabled" style="width: 280px" label="启用:">
                    <el-radio-group v-model="editModel.enabled">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="onClose">取 消</el-button>
                <el-button type="primary" @click="onConfirm">确 定</el-button>
            </div>

        </el-dialog>
        

        <!-- 分配角色对话框 -->
        <el-dialog
            :title="assignDialog.title"
            :visible.sync="assignDialog.visible"
            :width="assignDialog.width">
            
            <el-table :data="roleTableList" ref="roleTable" @selection-change="getAssignRoleIds" border stripe>
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="roleName" label="角色名"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>  
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="assignClose">取 消</el-button>
                <el-button type="primary" @click="assignConfirm">确 定</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
import {getUserListApi,addUserApi,editUserApi,deleteUserApi,checkRolesApi,saveRoleIdsByUserIdApi} from '@/api/sys-user'
export default {
    name: 'SysUserList',

    data() {
        return {
            //查询
            params:{
                trueName:'',
                phone:'',
                currentPage:1,
                pageSize:5,
                total:0
            },
            //列表数据
            tableList:[],
            //编辑数据对话框
            editDialog:{
                title:'',
                visible:false,
                width:'720px'
            },
            //表单数据绑定
            editModel: {
                userId: "",
                type: "", // 0:新增 1：编辑
                trueName: "",
                sex: "",
                phone: "",
                idCard: "",
                username: "",
                password: "",
                enabled: "",
                status: "",
            },
            rules:{
                trueName: [{
                    required: true,
                    trigger: "blur",
                    message: "请填写姓名",
                }],
                sex: [{
                    required: true,
                    trigger: "blur",
                    message: "请选择性别",
                }],
                phone: [{
                    required: true,
                    trigger: "blur",
                    message: "请填写电话",
                }],
                idCard: [{
                    required: true,
                    trigger: "blur",
                    message: "请填写身份证",
                }],
                username: [{
                    required: true,
                    trigger: "blur",
                    message: "请输入用户名",
                }],
                password: [{
                    required: true,
                    trigger: "blur",
                    message: "请输入密码",
                }],
                enabled: [{
                    required: true,
                    trigger: "blur",
                    message: "请选择是否禁用",
                }],
                status: [{
                    required: true,
                    trigger: "blur",
                    message: "请选择是否离职",
                }],
            },
            //分配角色对话框
            assignDialog:{
                title:"",
                visible:false,
                width:"800px"
            },
            //分配角色数据
            roleTableList:[],
            //分配的用户id
            assignUserId:"",
            //分配的角色id
            assignRoleIds:[]
        };
    },

    mounted() {
        this.getUserList();
    },

    methods: {
        async getUserList(){
            let res = await getUserListApi(this.params);
            if(res.code=200){
                this.tableList = res.data.records;
                this.params.total = res.data.total;
            }
        },
        searchBtn(){
            this.getUserList();
        },
        resetBtn(){
            this.params.trueName='';
            this.params.phone='';
            this.getUserList();
        },
        sizeChange(val){
            this.params.pageSize = val;
            this.getUserList();
        },
        currentChange(val){
            this.params.currentPage = val;
            this.getUserList();
        },
        //添加用户
        addUser(){
            //清空表单数据
            this.$resetForm("editForm",this.editModel)
            //设置编辑类型为添加
            this.editModel.type="0";
            //设置标题
            this.editDialog.title="新增员工";
            this.editDialog.visible = true;
        },
        //编辑用户
        editUser(row){
            //清空表单
            this.$resetForm("editForm",this.editModel)
            //设置编辑类型为添加
            this.editModel.type="1";
            //表单数据回显
            this.$objCopy(row,this.editModel);
            console.log(this.editModel)
            //设置标题
            this.editDialog.title="编辑员工";
            this.editDialog.visible = true;
        },
        //关闭对话框
        onClose(){
            this.editDialog.visible=false;
        },
        //确认对话框，保存用户数据
        onConfirm(){
            this.$refs.editForm.validate(async(valid)=>{
                if(valid){
                    let res = null;
                    if(this.editModel.type=="0"){
                        //新增
                        res = await addUserApi(this.editModel);
                    }else {
                        //修改
                        res = await editUserApi(this.editModel);
                    }
                    if(res && res.code==200){
                        this.getUserList();
                        //关闭对话框
                        this.editDialog.visible = false;
                        this.$message.success(res.msg);
                    }

                }
            })
        },
        //删除用户
        async deleteUser(row){
            let confirm = await this.$myconfirm("确认删除员工吗？");
            if(confirm){
                let res = await deleteUserApi(row.userId);
                if(res && res.code==200){
                    this.getUserList();
                    this.$message.success(res.msg);
                }
            }
        },
        //修改用户在职离职状态
        async changeUserStatus(row){
            let res = await editUserApi({userId:row.userId,status:row.status});
            if(res && res.code==200){
                this.getUserList();
                this.$message.success(res.msg);
            }
        },
        //修改用户的可用状态
        async changeUserEnabled(row){
            let res = await editUserApi({userId:row.userId,enabled:row.enabled});
            if(res && res.code==200){
                this.getUserList();
                this.$message.success(res.msg);
            }
        },
        //分配角色
        async assignRole(row){
            this.assignDialog.visible=true;
            //设置标题
            this.assignDialog.title=`为【${row.username}】分配角色`;
            let res =await checkRolesApi(row.userId);
            //设置角色列表数据
            if(res && res.code==200){
                this.roleTableList = res.data;
                this.$nextTick(()=>{
                    for(let i=0;i<this.roleTableList.length;i++){
                        let role = this.roleTableList[i];
                        if(role.checked){
                            this.$refs.roleTable.toggleRowSelection(this.roleTableList[i],true);

                        }
                    }
                })
            }
            this.assignUserId=row.userId;
        },
        getAssignRoleIds(value){
            let roleIds = [];
            for(let i=0;i<value.length;i++){
                roleIds.push(value[i].roleId);
            }
            this.assignRoleIds = roleIds;
        },
        assignClose(){
            this.assignDialog.visible = false;
        },
        async assignConfirm(){
            let param = {
                userId:this.assignUserId,
                roleIds:this.assignRoleIds
            }
            let res = await saveRoleIdsByUserIdApi(param);
            this.assignDialog.visible=false;
        }


    },
};
</script>

<style lang="less" scoped>
.el-radio-group{
    width:190px
}
</style>