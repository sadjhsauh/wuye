<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item >业主管理</el-breadcrumb-item>
            <el-breadcrumb-item >业主列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <!-- 搜索框 -->
            <el-row :gutter="20">
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
                            <el-button type="primary" icon="el-icon-plus" @click="addLiveUser">添加</el-button>
                        </el-form-item>
                    </el-form>    
                </el-col>
            </el-row>
            
            <!-- 业主列表 -->
            <el-table :data="tableList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="trueName" label="姓名"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="sex" label="性别">
                    <template slot-scope="scope">
                        <el-tag type="success" size="normal" v-if="scope.row.sex == 1">男</el-tag>
                        <el-tag type="danger" size="normal" v-if="scope.row.sex == 0">女</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column prop="buildName" label="栋数"></el-table-column>
                <el-table-column prop="unitName" label="单元"></el-table-column>
                <el-table-column prop="houseNum" label="房屋编号"></el-table-column>
                <el-table-column prop="houseArea" label="使用面积"></el-table-column>
                <el-table-column label="操作" width="400px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editLiveUser(scope.row)">编辑</el-button>
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="assignHouse(scope.row)">分配房屋</el-button>
                        <el-button type="primary" icon="el-icon-delete" size="small" @click="returnHouse(scope.row)">退房</el-button>
                        <el-button type="primary" icon="el-icon-delete" size="small" @click="deleteLiveUser(scope.row)">删除</el-button>
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
        
        <!-- 编辑对话框 -->
        <el-dialog
            :title="editDialog.title"
            :visible.sync="editDialog.visible"
            :width="editDialog.width"
            >
            <el-form :model="editModel" ref="editForm" label-width="80px" :inline="true" size="small">
                <el-form-item label="姓名">
                    <el-input v-model="editModel.trueName"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editModel.sex">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                    </el-radio-group>        
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="editModel.phone"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="editModel.roleId" >
                        <el-option v-for="item in roleList" 
                            :key="item.roleId"
                            :label="item.roleName"
                            :value="item.roleId">
                        </el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="editModel.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" v-if="editModel.editType!=1">
                    <el-input v-model="editModel.password"></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer">
                <el-button @click="onClose">取 消</el-button>
                <el-button type="primary" @click="onConfirm">确 定</el-button>
            </span>
        </el-dialog>
        
        
        <!-- 分配房屋 -->
        <el-dialog
            :title="assignHouseDialog.title"
            :visible.sync="assignHouseDialog.visible"
            :width="assignHouseDialog.width"
            >
            <!-- 搜索框 -->
            <el-form :model="houseParams" ref="assignHouseForm" label-width="80px" :inline="true" size="small">
                <el-form-item label="楼栋名称">
                    <el-input v-model="houseParams.buildName"></el-input>
                </el-form-item>
                <el-form-item label="单元名称">
                    <el-input v-model="houseParams.unitName"></el-input>
                </el-form-item>
                <el-form-item label="房屋编号">
                    <el-input v-model="houseParams.houseNum"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" @click="assignHouseSearchBtn">搜索</el-button>
                    <el-button icon="el-icon-close" @click="assignHouseResetBtn">重置</el-button>
                </el-form-item>
            </el-form>
            <!-- 表格 -->
            <el-table :data="houseList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="选择">
                    <template slot-scope="scope">
                        <el-radio v-model="assignHouseParam.houseId" :label="scope.row.houseId"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="buildName" label="楼栋名称"></el-table-column>
                <el-table-column prop="unitName" label="单元名称"></el-table-column>
                <el-table-column prop="houseNum" label="房屋编号"></el-table-column>
                <el-table-column prop="houseArea" label="使用面积"></el-table-column>
                <el-table-column prop="status" label="分配状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 0" type="danger" size="small">未分配</el-tag>
                        <el-tag v-if="scope.row.status == 1" type="success" size="small">已分配</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 分页 -->   
            <el-pagination
                @size-change="assignHouseSize"
                @current-change="assignHouseChange"
                :current-page.sync="houseParams.currentPage"
                :page-sizes="[5, 10, 15]"
                :page-size="houseParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="houseParams.total"
                background>
            </el-pagination>

            <span slot="footer">
                <el-button @click="assignHouseClose">取 消</el-button>
                <el-button type="primary" @click="assignHouseConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getLiveUserListApi,addLiveUserApi,editLiveUserApi,getRoleListApi,getUserByIdApi,getHouseListApi,assignHouseApi,returnHouseApi,deleteUserApi} from '@/api/live-user'
export default {
    name: 'LiveUserList',

    data() {
        return {
            //查询数据
            params:{
                trueName:'',
                phone:'',
                currentPage:1,
                pageSize:5,
                total:0
            },
            //业主列表
            tableList:[],
            //编辑对话框
            editDialog:{
                title:'',
                width:'620px',
                visible:false
            },
            //角色列表
            roleList:[],
            //编辑数据
            editModel:{
                editType:"",//编辑状态 0添加 1修改
                userId:"",
                username:"",
                phone:"",
                sex:"",
                trueName:"",
                password:"",
                roleId:"",
            },
            //分配房屋对话框
            assignHouseDialog:{
                title:'',
                width:'820px',
                visible:false
            },
            //分配房屋搜索框
            houseParams:{
                buildName:"",
                unitName:"",
                houseNum:"",
                currentPage:1,
                pageSize:5,
                total:0,
                status:0
            },
            //房屋数据
            houseList:[],
            //分配房屋提交数据
            assignHouseParam:{
                houseId:"",
                userId:""
            }
        };
    },

    mounted() {
        this.getLiveUserList();
        this.getRoleList();
    },

    methods: {
        //查询列表数据
        async getLiveUserList(){
            let res = await getLiveUserListApi(this.params);
            if(res && res.code==200){
                this.tableList = res.data.records;
                this.params.total = res.data.total;
            }
        },
        //查询
        searchBtn(){
            this.getLiveUserList();
        },
        //重置
        resetBtn(){
            this.params.trueName='';
            this.params.phone='';
            this.getLiveUserList();
        },
        //当前页改变
        currentChange(val){
            this.params.currentPage=val;
            this.getLiveUserList();
        },
        //分页大小改变
        sizeChange(val){
            this.params.pageSize=val;
            this.getLiveUserList();
        },
        //获取角色列表
        async getRoleList(){
            let res = await getRoleListApi();
            if(res && res.code==200){
                this.roleList = res.data;
            }
        },
        //添加
        addLiveUser(){
            //清空表单
            this.$resetForm("editForm",this.editModel);
            //设置编辑状态
            this.editModel.editType="0";
            //设置标题
            this.editDialog.title="添加业主";
            this.editDialog.visible=true;
        },
        //编辑
        async editLiveUser(row){
            //复制表单
            this.$objCopy(row,this.editModel);
            console.log(row.userId)
            //获取编辑的数据
            let res = await getUserByIdApi(row.userId);
            console.log(res);
            if(res && res.code==200){
                if(res.data){
                    console.log(res.data);
                    console.log(this.editModel);
                    this.$objCopy(res.data,this.editModel);
                }
            }
            //设置编辑状态
            this.editModel.editType="1";
            //设置标题
            this.editDialog.title="编辑业主";
            this.editDialog.visible=true;
        },
        //关闭对话框
        onClose(){
            this.editDialog.visible=false;
        },
        //确认对话框
        onConfirm(){
            this.$refs.editForm.validate(async (valid)=>{
                if(valid){
                    let res;
                    if(this.editModel.editType=="0"){
                        res = await addLiveUserApi(this.editModel);
                    }else {
                        res = await editLiveUserApi(this.editModel);
                    }
                    if(res && res.code==200){
                        this.getLiveUserList();
                        this.editDialog.visible=false;
                        this.$message.success(res.msg);
                    }
                }
            })
        },
        //分配房屋
        async assignHouse(row){
            if(row.houseNum){
                this.$message.warning("已经分配房屋，不能重复分配")
                return;
            }
            //清空表单
            this.houseParams.buildName="";
            this.houseParams.unitName="";
            this.houseParams.houseNum="";
            //获取未分配的房屋列表
            this.getAssingHouseList();
            //弹框属性
            this.assignHouseDialog.title=`为【${row.username}】分配房屋`;
            this.assignHouseDialog.visible=true;
            //设置分配人
            this.assignHouseParam.userId = row.userId;
        },
        //获取房屋列表数据
        async getAssingHouseList(){
            let res = await getHouseListApi(this.houseParams);
            if(res && res.code==200){
                this.houseList = res.data.records;
                this.houseParams.total = res.data.total;
            }
        },
        //分配房屋列表页数改变
        assignHouseChange(val){
            this.houseParams.currentPage = val;
            this.getAssingHouseList();
        },
        //分配房屋列表容量改变
        assignHouseSize(val){
            this.houseParams.pageSize = val;
            this.getAssingHouseList();
        },
        //分配房屋搜所事件
        assignHouseSearchBtn(){
            this.getAssingHouseList();
        },
        //分配房屋重置事件
        assignHouseResetBtn(){
            this.houseParams.buildName="";
            this.houseParams.unitName="";
            this.houseParams.houseNum="";
            this.getAssingHouseList();
        },
        //关闭分配房屋对话框
        assignHouseClose(){
            this.assignHouseDialog.visible=false;
        },
        //分配房屋确认事件
        async assignHouseConfirm(){
            if(!this.assignHouseParam.houseId){
                this.$message.warning("请选择要分配的房屋");
                return;
            }
            //数据提交
            let res = await assignHouseApi(this.assignHouseParam);
            if(res && res.code==200){
                this.getLiveUserList();
                this.$message.success(res.msg);
                this.assignHouseDialog.visible = false;
            }
        },
        //退房
        async returnHouse(row){
            console.log(row.useStatus);
            if(!row.useStatus){
                this.$message.warning("该租户暂无可退的房屋")
                return;
            }
            let confirm = await this.$myconfirm("你确认退房吗")
            if(confirm){
                let res = await returnHouseApi({
                    userId:row.userId,
                    houseId:row.houseId
                });
                if(res && res.code==200){
                    this.getLiveUserList();
                    this.$message.success(res.msg);
                }
            }
        },
        //删除业主
        async deleteLiveUser(row){
            let confirm = await this.$myconfirm("确认删除该数据吗");
            if(confirm){
                let res = await deleteUserApi(row.userId,row.houseId);
                if(res && res.code==200){
                    this.getLiveUserList();
                    this.$message.success(res.msg);
                }
                
                
            }
        }

    },
};
</script>

<style lang="scss" scoped>

</style>