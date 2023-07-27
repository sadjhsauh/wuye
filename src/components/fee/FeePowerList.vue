<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item >收费管理</el-breadcrumb-item>
            <el-breadcrumb-item >电费列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="18" >
                    <el-form :model="params" label-width="80px" :inline="true" size="small">
                        <el-form-item label="用户名">
                            <el-input v-model="params.username"></el-input>
                        </el-form-item>
                        <el-form-item label="房屋编号">
                            <el-input v-model="params.houseNum"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="resetBtn">重置</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="addFeePower">添加</el-button>
                        </el-form-item>
                    </el-form>    
                </el-col>
            </el-row>
            
            <!-- 电费列表 -->
            <el-table :data="tableList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="buildName" label="楼栋"></el-table-column>
                <el-table-column prop="unitName" label="单元"></el-table-column>
                <el-table-column prop="houseNum" label="房屋编号"></el-table-column>
                <el-table-column prop="payPowerMoney" label="缴费金额"></el-table-column>
                <el-table-column prop="payPowerMonth" label="所属年月"></el-table-column>
                <el-table-column prop="powerNum" label="表显"></el-table-column>
                <el-table-column prop="payPowerStatus" label="缴费状态">
                    <template slot-scope="scope">
                    <el-tag v-if="scope.row.payPowerStatus == '0'" type="success" size="small">未缴费</el-tag>
                    <el-tag v-if="scope.row.payPowerStatus == '1'" type="danger" size="small">已缴费</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editFeePower(scope.row)">编辑</el-button>
                        <el-button type="primary" icon="el-icon-delete" size="small" @click="deleteFeePower(scope.row)">删除</el-button>
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="payFeePower(scope.row)">缴费</el-button>
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
                    <el-select v-model="editModel.buildId" @change="selectBuild">
                        <el-option v-for="item in buildList"
                            :key="item.buildId"
                            :label="item.buildName"
                            :value="item.buildId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单元">
                    <el-select v-model="editModel.unitId" @change="selectUnit">
                        <el-option v-for="item in unitList"
                            :key="item.unitId"
                            :label="item.unitName"
                            :value="item.unitId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="房屋编号">
                    <el-select v-model="editModel.houseId">
                        <el-option v-for="item in houseList"
                            :key="item.houseId"
                            :label="item.houseNum"
                            :value="item.houseId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属月份">
                    <el-date-picker v-model="editModel.payPowerMonth" format="yyyy-MM" type="month" ></el-date-picker>   
                </el-form-item>
                <el-form-item label="缴费金额" size="small">
                    <el-input v-model="editModel.payPowerMoney"></el-input>
                </el-form-item>
                <el-form-item label="表显" size="small">
                    <el-input v-model="editModel.powerNum"></el-input>
                </el-form-item>
                <el-form-item label="缴费状态" size="small">
                    <el-radio-group v-model="editModel.payPowerStatus">
                    <el-radio :label="'0'">未缴费</el-radio>
                    <el-radio :label="'1'">已缴费</el-radio>
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
import {
    getFeePowerListApi,
    addFeePowerApi,
    editFeePowerApi,
    deleteFeePowerApi,
    payFeePowerApi,
    getBuildFindAllApi,
    getUnitListByBuildIdApi,
    getHouseListByUnitIdApi} from '@/api/fee-power'
export default {
    name: 'FeePowerList',

    data() {
        return {
            //查询数据
            params:{
                username:'',
                houseNum:'',
                currentPage:1,
                pageSize:5,
                total:0
            },
            //电费列表
            tableList:[],
            //编辑对话框
            editDialog:{
                title:'',
                width:'720px',
                visible:false
            },
            buildList:[],
            unitList:[],
            houseList:[],
            //编辑数据
            editModel:{
                editType:"",//编辑状态 0添加 1修改
                houseId:"",
                unitId:"",
                buildId:"",
                powerId:"",
                payPowerMonth:"",
                payPowerMoney:"",
                powerNum:"",
                payPowerStatus:""
            }
        };
    },

    mounted() {
        this.getBuildList();
        this.getFeePowerList();
    },

    methods: {
        //查询列表数据
        async getFeePowerList(){
            let res = await getFeePowerListApi(this.params);
            if(res && res.code==200){
                this.tableList = res.data.records;
                this.params.total = res.data.total;
            }
        },
        //查询
        searchBtn(){
            this.getFeePowerList();
        },
        //重置
        resetBtn(){
            this.params.username='';
            this.params.houseNum='';
            this.getFeePowerList();
        },
        //当前页改变
        currentChange(val){
            this.params.currentPage=val;
            this.getFeePowerList();
        },
        //分页大小改变
        sizeChange(val){
            this.params.pageSize=val;
            this.getFeePowerList();
        },
        //添加
        addFeePower(){
            //清空表单
            this.$resetForm("editForm",this.editModel);
            //设置编辑状态
            this.editModel.editType="0";
            //设置标题
            this.editDialog.title="添加电费";
            this.editDialog.visible=true;
        },
        //编辑
        editFeePower(row){
            //查看单元列表
            this.getUnitList(row.buildId);
            //查看房屋列表
            this.getHouseByUnitId(row.unitId);
            //设置编辑状态
            this.editModel.editType="1";
            //设置标题
            this.editDialog.title="编辑电费";
            this.editDialog.visible=true;
            this.$objCopy(row,this.editModel);
        },
        //获取楼栋列表
        async getBuildList(){
            let res = await getBuildFindAllApi();
            this.buildList = res.data;
        },
        //楼栋选择事件
        selectBuild(val){
            this.editModel.unitId='';
            this.editModel.houseId='';
            this.getUnitList(val);
        },
        //获取单元列表
        async getUnitList(buildId){
            let res = await getUnitListByBuildIdApi(buildId);
            if(res && res.code==200){
                this.unitList = res.data;
            }
        },
        //单元选择事件
        selectUnit(val){
            this.getHouseByUnitId(val);
        },
        //获取房屋列表
        async getHouseByUnitId(unitId){
            let res = await getHouseListByUnitIdApi(unitId);
            if(res && res.code==200){
                this.houseList=res.data;
            }
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
                        res = await addFeePowerApi(this.editModel);
                    }else {
                        res = await editFeePowerApi(this.editModel);
                    }
                    if(res && res.code==200){
                        this.getFeePowerList();
                        this.editDialog.visible=false;
                        this.$message.success(res.msg);
                    }
                }
            })
        },
        //删除电费
        async deleteFeePower(row){
            let confirm = await this.$myconfirm("你确认删除吗？");
            if(confirm){
                let res = await deleteFeePowerApi(row.powerId);
                if(res && res.code==200){
                    this.getFeePowerList();
                    this.$message.success(res.msg);
                }
            }

        },
        //缴费
        async payFeePower(row){
            let confirm = await this.$myconfirm("确认缴费码？");
            if(confirm){
                let param = {
                    powerId:row.powerId,
                    payPowerStatus:"1"
                }
                let res = await payFeePowerApi(param);
                if(res && res.code==200){
                    this.$message.success(res.msg);
                    this.getFeePowerList();
                }
            }
        }
    },
};
</script>

<style lang="scss" scoped>

</style>