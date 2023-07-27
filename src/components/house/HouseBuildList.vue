<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item >楼栋管理</el-breadcrumb-item>
            <el-breadcrumb-item >楼栋列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="18" >
                    <el-form :model="params" label-width="80px" :inline="true" size="small">
                        <el-form-item label="楼栋名称">
                            <el-input v-model="params.buildName"></el-input>
                        </el-form-item>
                        <el-form-item label="楼栋类型">
                            <el-select v-model="params.type" label="楼栋类型">
                                <el-option label="普通房" :value="0"></el-option>
                                <el-option label="电梯房" :value="1"></el-option>
                            </el-select>
                            
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="resetBtn">重置</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="addBuild">添加</el-button>
                        </el-form-item>
                    </el-form>    
                </el-col>
            </el-row>
            
            <!-- 楼栋列表 -->
            <el-table :data="tableList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="buildName" label="栋数名称"></el-table-column>
                <el-table-column prop="orderNum" label="排序"></el-table-column>
                <el-table-column prop="type" label="栋数类型">
                    <template slot-scope="scope">
                    <el-tag v-if="scope.row.type == 0" type="success" size="small">普通房</el-tag>
                    <el-tag v-if="scope.row.type == 1" type="danger" size="small">电梯房</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editBuild(scope.row)">编辑</el-button>
                        <el-button type="primary" icon="el-icon-delete" size="small" @click="deleteBuild(scope.row)">删除</el-button>
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
                <el-form-item label="楼栋名称">
                    <el-input v-model="editModel.buildName"></el-input>
                </el-form-item>
                <el-form-item label="楼栋类型">
                    <el-select v-model="editModel.type" >
                        <el-option label="普通房" :value="0"></el-option>
                        <el-option label="电梯房" :value="1"></el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="楼栋序号">
                    <el-input v-model="editModel.orderNum" type="number"></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer">
                <el-button @click="onClose">取 消</el-button>
                <el-button type="primary" @click="onConfirm">确 定</el-button>
            </span>
        </el-dialog>
        
        
    </div>
</template>

<script>
import {getBuildListApi,addBuildApi,editBuildApi,deleteBuildApi} from '@/api/house-build'
export default {
    name: 'HouseBuildList',

    data() {
        return {
            //查询数据
            params:{
                buildName:'',
                type:'',
                currentPage:1,
                pageSize:5,
                total:0
            },
            //楼栋列表
            tableList:[],
            //编辑对话框
            editDialog:{
                title:'',
                width:'620px',
                visible:false
            },
            //编辑数据
            editModel:{
                editType:"",//编辑状态 0添加 1修改
                buildId:"",
                buildName:"",
                type:"",
                orderNum:""
            }
        };
    },

    mounted() {
        this.getBuildList();
    },

    methods: {
        //查询列表数据
        async getBuildList(){
            let res = await getBuildListApi(this.params);
            if(res && res.code==200){
                this.tableList = res.data.records;
                this.params.total = res.data.total;
            }
        },
        //查询
        searchBtn(){
            this.getBuildList();
        },
        //重置
        resetBtn(){
            this.params.buildName='';
            this.params.type='';
            this.getBuildList();
        },
        //当前页改变
        currentChange(val){
            this.params.currentPage=val;
            this.getBuildList();
        },
        //分页大小改变
        sizeChange(val){
            this.params.pageSize=val;
            this.getBuildList();
        },
        //添加
        addBuild(){
            //清空表单
            this.$resetForm("editForm",this.editModel);
            //设置编辑状态
            this.editModel.editType="0";
            //设置标题
            this.editDialog.title="添加楼栋";
            this.editDialog.visible=true;
        },
        //编辑
        editBuild(row){
            //复制表单
            this.$objCopy(row,this.editModel);
            //设置编辑状态
            this.editModel.editType="1";
            //设置标题
            this.editDialog.title="编辑楼栋";
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
                        res = await addBuildApi(this.editModel);
                    }else {
                        res = await editBuildApi(this.editModel);
                    }
                    if(res && res.code==200){
                        this.getBuildList();
                        this.editDialog.visible=false;
                        this.$message.success(res.msg);
                    }
                }
            })
        },
        //删除楼栋
        async deleteBuild(row){
            let confirm = await this.$myconfirm("你确认删除吗？");
            if(confirm){
                let res = await deleteBuildApi(row.buildId);
                if(res && res.code==200){
                    this.getBuildList();
                    this.$message.success(res.msg);
                }
            }

        }
    },
};
</script>

<style lang="scss" scoped>

</style>