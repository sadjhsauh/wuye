<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item >房屋管理</el-breadcrumb-item>
            <el-breadcrumb-item >房屋列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <!-- 搜索框 -->
            <el-row :gutter="1">
                <el-col :span="24" >
                    <el-form :model="params" label-width="80px" :inline="true" size="small">
                        <el-form-item label="楼栋名称">
                            <el-input v-model="params.buildName"></el-input>
                        </el-form-item>
                        <el-form-item label="单元名称">
                            <el-input v-model="params.unitName"></el-input>
                        </el-form-item>
                        <el-form-item label="房屋编号">
                            <el-input v-model="params.houseNum"></el-input>
                        </el-form-item>
                        <el-form-item label="使用状态">
                            <el-select v-model="params.status" >
                                <el-option label="未使用" :value="0"></el-option>
                                <el-option label="使用" :value="1"></el-option>
                            </el-select>    
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="resetBtn">重置</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="addHouse">添加</el-button>
                        </el-form-item>
                    </el-form>    
                </el-col>
            </el-row>
            
            <!-- 单元列表 -->
            <el-table :data="tableList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="buildName" label="栋数名称"></el-table-column>
                <el-table-column prop="unitName" label="单元名称"></el-table-column>
                <el-table-column prop="houseNum" label="房屋编号"></el-table-column>
                <el-table-column prop="houseArea" label="使用面积"></el-table-column>
                <el-table-column prop="status" label="使用状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 0" type="danger" size="small">未使用</el-tag>
                        <el-tag v-if="scope.row.status == 1" type="success" size="small">已使用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editHouse(scope.row)">编辑</el-button>
                        <el-button type="primary" icon="el-icon-delete" size="small" @click="deleteHouse(scope.row)">删除</el-button>
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
                    <el-select v-model="editModel.buildId" @change="selectBuild">
                        <el-option v-for="item in buildList"
                            :key="item.buildId"
                            :label="item.buildName"
                            :value="item.buildId">
                        </el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="所属单元">
                    <el-select v-model="editModel.unitId">
                        <el-option v-for="item in unitList"
                            :key="item.unitId"
                            :label="item.unitName"
                            :value="item.unitId">
                        </el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="房屋编号">
                    <el-input v-model="editModel.houseNum"></el-input>
                </el-form-item>
                <el-form-item label="使用面积">
                    <el-input v-model="editModel.houseArea"></el-input>
                </el-form-item>
                <el-form-item label="使用状态">
                    <el-radio-group v-model="editModel.status" >
                        <el-radio :label="0">未使用</el-radio>
                        <el-radio :label="1">已使用</el-radio>
                    </el-radio-group>
                    
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
import {getHouseListApi,addHouseApi,editHouseApi,deleteHouseApi,getBuildFindAllApi,getUnitListByBuildIdApi} from '@/api/house-list'
export default {
    name: 'HouseUnitList',

    data() {
        return {
            //查询数据
            params:{
                buildName:'',
                unitName:'',
                houseNum:'',
                status:'',
                currentPage:1,
                pageSize:5,
                total:0
            },
            //房屋列表
            tableList:[],
            //楼栋列表
            buildList:[],
            //单元列表
            unitList:[],
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
                houseId:"",
                unitId:"",
                houseNum:"",
                houseArea:"",
                status:"",
            }
        };
    },

    mounted() {
        this.getHouseList();
        this.getBuildList();
    },

    methods: {
        //查询列表数据
        async getHouseList(){
            let res = await getHouseListApi(this.params);
            if(res && res.code==200){
                this.tableList = res.data.records;
                this.params.total = res.data.total;
            }
        },
        //查询
        searchBtn(){
            this.getHouseList();
        },
        //重置
        resetBtn(){
            this.params.buildName='';
            this.params.unitName='';
            this.params.houseNum="";
            this.params.status="";
            this.getHouseList();
        },
        //当前页改变
        currentChange(val){
            this.params.currentPage=val;
            this.getHouseList();
        },
        //分页大小改变
        sizeChange(val){
            this.params.pageSize=val;
            this.getHouseList();
        },
        //获取楼栋列表
        async getBuildList(){
            let res = await getBuildFindAllApi();
            if(res && res.code==200){
                this.buildList = res.data;
            }
        },
        //选择楼栋，查询单元列表
        async selectBuild(){
            let res = await getUnitListByBuildIdApi(this.editModel.buildId);
            if(res && res.code==200){
                this.unitList = res.data;
            }
        },
        //添加
        addHouse(){
            //清空表单
            this.$resetForm("editForm",this.editModel);
            //设置编辑状态
            this.editModel.editType="0";
            //设置标题
            this.editDialog.title="添加房屋";
            this.editDialog.visible=true;
        },
        //编辑
        editHouse(row){
            //复制表单
            this.$objCopy(row,this.editModel);
            //设置编辑状态
            this.editModel.editType="1";
            //设置标题
            this.editDialog.title="编辑房屋";
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
                        res = await addHouseApi(this.editModel);
                    }else {
                        res = await editHouseApi(this.editModel);
                    }
                    if(res && res.code==200){
                        this.getHouseList();
                        this.editDialog.visible=false;
                        this.$message.success(res.msg);
                    }
                }
            })
        },
        //删除房屋
        async deleteHouse(row){
            let confirm = await this.$myconfirm("你确认删除吗？");
            if(confirm){
                let res = await deleteHouseApi(row.houseId);
                if(res && res.code==200){
                    this.getHouseList();
                    this.$message.success(res.msg);
                }
            }

        }
    },
};
</script>

<style lang="less" scoped>
</style>