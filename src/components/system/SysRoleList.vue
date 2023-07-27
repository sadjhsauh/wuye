<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item >角色管理</el-breadcrumb-item>
            <el-breadcrumb-item >角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="14" >
                    <el-form :model="params" label-width="80px" :inline="true" size="small">
                        <el-form-item label="角色名">
                            <el-input v-model="params.roleName"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="resetBtn">重置</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="addRole">添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>     
            </el-row>
            
            <!-- 表格 -->
            <el-table :data="tableList" border stripe>
                <el-table-column type="index" label="序号" width="50px"></el-table-column>
                <el-table-column prop="roleName" label="角色名"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editRole(scope.row)">编辑</el-button>
                        <el-button type="primary" icon="el-icon-delete" size="small" @click="deleteRole(scope.row)">删除</el-button>
                        <el-button type="primary" icon="el-icon-delete" size="small" @click="assignMenu(scope.row)">分配菜单</el-button>
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
        

        <!-- 对话框 -->
        <el-dialog
            :title="editDialog.title"
            :visible.sync="editDialog.visible"
            :width="editDialog.width">

            <el-form :model="editModel" ref="editForm" :rules="rules" label-width="80px" :inline="true" size="small">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editModel.roleName"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="editModel.remark"></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer">
                <el-button @click="onClose">取 消</el-button>
                <el-button type="primary" @click="onConfirm">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 分配权限对话框 -->
        <el-dialog
            :title="assignDialog.title"
            :visible.sync="assignDialog.visible"
            :width="assignDialog.width">

            <!-- 树形菜单 -->
            <el-tree ref="assignTree" 
                :data="tree"
                :default-checked-keys="checkMenuIds" 
                node-key="menuId" 
                :props="defaultProps" 
                empty-text="暂无数据" 
                :show-checkbox="true"
                :check-strictly="true"
                icon-class="el-icon-plus"
                default-expand-all>
            </el-tree>
            
            <span slot="footer">
                <el-button @click="assignClose">取 消</el-button>
                <el-button type="primary" @click="assignConfirm">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
import {getRoleListApi,addRoleApi,editRoleApi,deleteRoleApi, getAssignTreeApi,saveMenuIdsByRoleIdApi} from '@/api/sys-role'
export default {
    name: 'SysRoleList',

    data() {
        return {
            //查询参数
            params:{
                roleName:'',
                currentPage:1,
                pageSize:5,
                total:0
            },
            //数据列表
            tableList:[],
            //对话框
            editDialog:{
                title:'',
                width:'720px',
                visible:false
            },
            //编辑数据
            editModel:{
                roleId:'',
                roleName:'',
                remark:'',
                type:''//0新增 1修改
            },
            //校验
            rules:{
                roleName: [{
                    required: true,
                    trigger: "blur",
                    message: "请输入角色名称",
                }],
                remark: [{
                    required: true,
                    trigger: "blur",
                    message: "请输入备注信息",
                }],
            },

            //树形菜单弹框
            assignDialog:{
                width:'520px',
                title:'',
                visible:false
            },
            //树形菜单数据
            tree:[],
            //准备默认选中的节点
            checkMenuIds:[],
            //默认节点参数名设置
            defaultProps:{
                children:'children',
                label:'moduleLabel'
            },
            //角色id
            roleId:'',
        }
    },

    mounted() {
        this.getRoleList();
    },

    methods: {
        //角色列表查询
        async getRoleList(){
            let res = await getRoleListApi(this.params);
            if(res && res.code==200){
                this.tableList = res.data.records;
                this.params.total = res.data.total;
            }
        },
        //查询按钮
        searchBtn(){
            this.getRoleList();
        },
        //重置按钮
        resetBtn(){
            this.params.roleName='';
            this.getRoleList();
        },
        //分页大小改变
        sizeChange(val){
            this.params.pageSize = val;
            this.getRoleList();
        },
        //当前页改变
        currentChange(val){
            this.params.currentPage = val;
            this.getRoleList();
        },
        //添加角色
        addRole(){
            //清空表单
            this.$resetForm("editForm",this.editModel);
            //设置新增状态
            this.editModel.type='0';
            //设置标题
            this.editDialog.title='新增角色';
            this.editDialog.visible=true;
        },
        //编辑角色
        editRole(row){
            //清空表单
            this.$resetForm("editForm", this.editModel);
            //设置标识
            this.editModel.type = "1";
            //把当前编辑的数据数值给表单数据域
            this.$objCopy(row, this.editModel);
            //设置弹框属性
            this.editDialog.title = "编辑角色";
            this.editDialog.visible = true;
        },
        //关闭对话框
        onClose(){
            this.editDialog.visible=false;
        },
        //确认
        onConfirm(){
            //表单验证
            this.$refs.editForm.validate(async (valid)=>{
                if(valid){
                    let res = null;
                    if(this.editModel.type=='0'){
                        //新增
                        res = await addRoleApi(this.editModel);
                    }else {
                        res = await editRoleApi(this.editModel);
                    }
                    //返回成功
                    if(res && res.code==200){
                        //刷新表格
                        this.getRoleList();
                        this.$message.success(res.msg);
                        this.editDialog.visible = false;
                    }
                }
            })
        },
        //删除
        async deleteRole(row){
            let confirm = await this.$myconfirm("你确认删除吗？");
            if(confirm){
                let res = await deleteRoleApi(row.roleId);
                if(res && res.code==200){
                    //刷新表格
                    this.getRoleList();
                    this.$message.success(res.msg);
                }
            }
        },
        //分配菜单
        async assignMenu(row){
            //设置对话框
            this.assignDialog.title= `为【${row.roleName}】分配权限`;
            this.assignDialog.visible=true;

            //清空数据
            this.roleId='';
            this.tree=[];
            this.checkMenuIds=[];

            //获取数据
            this.roleId = row.roleId;
            let res = await getAssignTreeApi(this.roleId);
            if(res && res.code==200){
                this.tree = res.data.tree;
                this.checkMenuIds = res.data.checkMenuIds;
            }
        },
        //关闭菜单对话框
        assignClose(){
            this.assignDialog.visible=false;
        },
        //菜单对话框确认
        async assignConfirm(){
            let ids = this.$refs.assignTree.getCheckedKeys();
            let param = {
                roleId:this.roleId,
                menuIds:ids
            }
            let res = await saveMenuIdsByRoleIdApi(param);
            if(res && res.code==200){
                this.$message.success(res.msg);
                this.assignDialog.visible=false;
            }
        }
    },
};
</script>

<style lang="scss" scoped>

</style>