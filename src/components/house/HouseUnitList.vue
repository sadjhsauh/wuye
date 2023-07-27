<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item >单元管理</el-breadcrumb-item>
            <el-breadcrumb-item >单元列表</el-breadcrumb-item>
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
                        <el-form-item label="单元名称">
                            <el-input v-model="params.unitName"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="resetBtn">重置</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="addUnit">添加</el-button>
                        </el-form-item>
                    </el-form>    
                </el-col>
            </el-row>
            
            <!-- 单元列表 -->
            <el-table :data="tableList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="buildName" label="栋数名称"></el-table-column>
                <el-table-column prop="unitName" label="单元名称"></el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editUnit(scope.row)">编辑</el-button>
                        <el-button type="primary" icon="el-icon-delete" size="small" @click="deleteUnit(scope.row)">删除</el-button>
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
                <el-form-item label="所属楼栋">
                    <el-select v-model="editModel.buildId">
                        <el-option v-for="item in buildTableList"
                            :key="item.buildId"
                            :label="item.buildName"
                            :value="item.buildId">
                        </el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="单元名称">
                    <el-input v-model="editModel.unitName"></el-input>
                </el-form-item>
                <el-form-item label="单元序号">
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
import {getUnitListApi,addUnitApi,editUnitApi,deleteUnitApi,getBuildFindAllApi} from '@/api/house-unit'
export default {
    name: 'HouseUnitList',

    data() {
        return {
            //查询数据
            params:{
                buildName:'',
                unitName:'',
                currentPage:1,
                pageSize:5,
                total:0
            },
            //单元列表
            tableList:[],
            //楼栋列表
            buildTableList:[],
            //编辑对话框
            editDialog:{
                title:'',
                width:'620px',
                visible:false
            },
            //编辑数据
            editModel:{
                editType:"",//编辑状态 0添加 1修改
                unitId:"",
                buildId:"",
                unitName:"",
                orderNum:""
            }
        };
    },

    mounted() {
        this.getUnitList();
        this.getBuildList();
    },

    methods: {
        //查询列表数据
        async getUnitList(){
            let res = await getUnitListApi(this.params);
            if(res && res.code==200){
                this.tableList = res.data.records;
                this.params.total = res.data.total;
            }
        },
        //查询
        searchBtn(){
            this.getUnitList();
        },
        //重置
        resetBtn(){
            this.params.buildName='';
            this.params.unitName='';
            this.getUnitList();
        },
        //当前页改变
        currentChange(val){
            this.params.currentPage=val;
            this.getUnitList();
        },
        //分页大小改变
        sizeChange(val){
            this.params.pageSize=val;
            this.getUnitList();
        },
        //获取楼栋列表
        async getBuildList(){
            let res = await getBuildFindAllApi();
            if(res && res.code==200){
                this.buildTableList = res.data;
            }
        },
        //添加
        addUnit(){
            //清空表单
            this.$resetForm("editForm",this.editModel);
            //设置编辑状态
            this.editModel.editType="0";
            //设置标题
            this.editDialog.title="添加单元";
            this.editDialog.visible=true;
        },
        //编辑
        editUnit(row){
            //复制表单
            this.$objCopy(row,this.editModel);
            //设置编辑状态
            this.editModel.editType="1";
            //设置标题
            this.editDialog.title="编辑单元";
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
                        res = await addUnitApi(this.editModel);
                    }else {
                        res = await editUnitApi(this.editModel);
                    }
                    if(res && res.code==200){
                        this.getUnitList();
                        this.editDialog.visible=false;
                        this.$message.success(res.msg);
                    }
                }
            })
        },
        //删除单元
        async deleteUnit(row){
            let confirm = await this.$myconfirm("你确认删除吗？");
            if(confirm){
                let res = await deleteUnitApi(row.unitId);
                if(res && res.code==200){
                    this.getUnitList();
                    this.$message.success(res.msg);
                }
            }

        }
    },
};
</script>

<style lang="scss" scoped>

</style>