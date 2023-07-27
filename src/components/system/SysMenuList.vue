<template>
    <div>
         <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item >菜单管理</el-breadcrumb-item>
            <el-breadcrumb-item >菜单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <!-- 新增按钮 -->
            <el-row :gutter="20">
                <el-col :span="1" >
                    <el-button type="primary" icon="el-icon-plus" @click="addMenu">添加</el-button>
                </el-col>     
            </el-row>
            
            <!-- 表格 -->
            <el-table :data="tableList" row-key="menuId" :tree-props="{children:'children'}" border stripe default-expand-all>
                <el-table-column type="index" label="序号" width="50px"></el-table-column>
                <el-table-column prop="moduleLabel" label="菜单名称"></el-table-column>
                <el-table-column prop="type" label="菜单类型">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.type==0" >目录</el-tag>
                        <el-tag type="sucess" v-if="scope.row.type==1" >菜单</el-tag>
                        <el-tag type="info" v-if="scope.row.type==2" >按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="icon" label="菜单图标">
                    <template slot-scope="scope">
                        <i :class="scope.row.icon"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="路由名称"></el-table-column>
                <el-table-column prop="path" label="路由地址"></el-table-column>
                <el-table-column prop="url" label="组件路径"></el-table-column>
                <el-table-column prop="menuCode" label="权限字段"></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editMenu(scope.row)">编辑</el-button>
                        <el-button type="primary" :disabled="scope.row.children.length!=0" icon="el-icon-delete" size="small" @click="deleteMenu(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>    
        </el-card>
        
        <!-- 对话框 -->
        <el-dialog
            :title="editDialog.title"
            :visible.sync="editDialog.visible"
            :width="editDialog.width">

            <el-form :model="editModel" ref="editForm" label-width="80px" :inline="true" size="small" label-position="left">
                <el-row>
                    <el-col :span="14" >
                        <el-form-item label="菜单类型" >
                            <el-radio-group v-model="editModel.type">
                                <el-radio :label="0" >目录</el-radio>
                                <el-radio :label="1" >菜单</el-radio>
                                <el-radio :label="2" >按钮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="上级菜单" size="parentName">
                    <el-input v-model="editModel.parentName" placeholder="请选择上级菜单" size="small" @click.native="selectParent">
                    </el-input>
                </el-form-item>
                <el-form-item label="菜单名称" >
                    <el-input v-model="editModel.moduleLabel" placeholder="请填写菜单名称" size="small" >
                    </el-input>   
                </el-form-item>
                <el-form-item label="菜单图片" v-if="editModel.type!=2">
                    <el-input v-model="editModel.icon" placeholder="请填写菜单图标" size="small" >
                    </el-input>   
                </el-form-item>
                <el-form-item label="路由名称" v-if="editModel.type==1">
                    <el-input v-model="editModel.name" placeholder="请填写路由名称" size="small" >
                    </el-input>   
                </el-form-item>
                <el-form-item label="路由地址" v-if="editModel.type==1">
                    <el-input v-model="editModel.path" placeholder="请填写路由地址" size="small" >
                    </el-input>   
                </el-form-item>
                <el-form-item label="组件路径" v-if="editModel.type==1">
                    <el-input v-model="editModel.url" placeholder="请填写组件地址" size="small" >
                    </el-input>   
                </el-form-item>
                <el-form-item label="权限字段">
                    <el-input v-model="editModel.menuCode" placeholder="请填写权限字段" size="small" >
                    </el-input>   
                </el-form-item>

                <el-form-item label="权限备注">
                    <el-input v-model="editModel.remark" placeholder="请填写权限备注" size="small" >
                    </el-input>
                </el-form-item>

                
                <el-form-item label="权限序号">
                    <el-input type="number" v-model="editModel.orderNum" placeholder="请填写权限序号" size="small" >
                    </el-input>   
                </el-form-item>
            </el-form>
            

            <span slot="footer">
                <el-button @click="onClose">取 消</el-button>
                <el-button type="primary" @click="onConfirm">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 上级菜单对话框 -->
        <el-dialog
            :title="parentDialog.title"
            :visible.sync="parentDialog.visible"
            :width="parentDialog.width">

            <el-tree ref="parentTree" 
                :data="parentList" 
                node-key="menuId" 
                :props="parentProps" 
                empty-text="暂无数据" 
                icon-class="el-icon-plus"
                @node-click="treeClick">
            </el-tree>
            

            <span slot="footer">
                <el-button @click="onParentClose">取 消</el-button>
                <el-button type="primary" @click="onParentConfirm">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
import {getMenuListApi,getMenuParentListApi,addMenuApi,editMenuApi,deleteMenuApi} from '@/api/sys-menu'
export default {
    name: 'SysMenuList',

    data() {
        return {
            //表格数据
            tableList:[],
            //编辑对话框
            editDialog:{
                title:'',
                width:'620px',
                visible:false
            },
            //编辑数据
            editModel:{
                editType:"",//标记，0新增，1编辑
                menuId:"",
                parentId:"",
                moduleLabel:"",
                menuCode:"",
                name:"",
                path:"",
                url:"",
                type:"",
                icon:"",
                remark:"",
                parentName:"",
                orderNum:""
            },
            //上级菜单数据
            parentList:[],
            //上级菜单对话框
            parentDialog:{
                title:'',
                width:'400px',
                visible:false
            },
            //上级菜单树属性配置
            parentProps: {
                children: "children",
                label: "moduleLabel",
            },
            //选中菜单的数据
            selectNode:{
                menuId:'',
                moduleLabel:'',
            } 

        };
    },

    mounted() {
        this.getMenuList();
    },

    methods: {
        //获取列表
        async getMenuList(){
            let res = await getMenuListApi();
            if(res && res.code==200){
                this.tableList = res.data;
            }
        },
        //添加菜单
        addMenu(){
            //清空表单
            this.$resetForm("editForm",this.editModel);
            //设置编辑状态
            this.editModel.editType="0";
            //设置对话框
            this.editDialog.title="新增菜单";
            this.editDialog.visible=true
        },
        //编辑菜单
        editMenu(row){
            //复制表单
            this.$objCopy(row,this.editModel);
            //设置编辑状态
            this.editModel.editType="1";
            //设置对话框
            this.editDialog.title="编辑菜单";
            this.editDialog.visible=true;
        },
        //获取上级菜单数据
        async selectParent(){
            //获取上级部门树型数据
            let res = await getMenuParentListApi();
            if(res && res.code==200){
                this.parentList = res.data;
                this.parentDialog.visible=true;
            }
        },
        //点击选中菜单获取数据
        treeClick(node){
            this.selectNode.menuId = node.menuId;
            this.selectNode.moduleLabel = node.moduleLabel;
        },
        //关闭上级菜单
        onParentClose(){
            this.parentDialog.visible=false;
        },
        //上级菜单点击确认
        onParentConfirm(){
            this.editModel.parentId = this.selectNode.menuId;
            this.editModel.parentName = this.selectNode.moduleLabel;
            this.parentDialog.visible=false;
        },
        //关闭编辑对话框
        onClose(){
            this.editDialog.visible=false;
        },
        //确认编辑对话框
        onConfirm(){
            this.$refs.editForm.validate(async (valid)=>{
                if(valid){
                    let res = null;
                    console.log(this.editModel.editType);
                    if(this.editModel.editType=="0"){
                        res = await addMenuApi(this.editModel);
                    }else {
                        res = await editMenuApi(this.editModel);
                    }
                    if(res && res.code==200){
                        this.getMenuList();
                        this.$message.success(res.msg);
                        this.editDialog.visible=false;
                    }
                }
            })
        },
        //删除菜单
        async deleteMenu(row){
            let confirm = await this.$myconfirm("你确认删除吗？");
            if(confirm){
                let res = await deleteMenuApi(row.menuId);
                if(res && res.code==200){
                    this.getMenuList();
                    this.$message.success(res.msg);
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>