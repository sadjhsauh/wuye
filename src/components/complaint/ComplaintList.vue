<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item >投诉管理</el-breadcrumb-item>
            <el-breadcrumb-item >投诉列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="18" >
                    <el-form :model="params" label-width="80px" :inline="true" size="small">
                        <el-form-item label="标题">
                            <el-input v-model="params.title"></el-input>
                        </el-form-item>
                        <el-form-item label="内容">
                            <el-input v-model="params.content"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="resetBtn">重置</el-button>
                        </el-form-item>
                    </el-form>    
                </el-col>
            </el-row>
            
            <!-- 投诉列表 -->
            <el-table :data="tableList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="status" label="处理状态">
                    <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==0" type="success" size="small">未处理</el-tag>
                    <el-tag v-if="scope.row.status==1" type="danger" size="small">已处理</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="doComplaint(scope.row)">处理</el-button>
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
        
        
        
    </div>
</template>

<script>
import {getListApi,editComplaintApi} from '@/api/complaint'
export default {
    name: 'ComplaintList',

    data() {
        return {
            //查询数据
            params:{
                title:'',
                content:'',
                currentPage:1,
                pageSize:5,
                total:0
            },
            //投诉列表
            tableList:[]
        };
    },

    mounted() {
        this.getList();
    },

    methods: {
        //查询列表数据
        async getList(){
            let res = await getListApi(this.params);
            if(res && res.code==200){
                this.tableList = res.data.list;
                this.params.total = res.data.total;
            }
        },
        //查询
        searchBtn(){
            this.getList();
        },
        //重置
        resetBtn(){
            this.params.title='';
            this.params.content='';
            this.getList();
        },
        //当前页改变
        currentChange(val){
            this.params.currentPage=val;
            this.getList();
        },
        //分页大小改变
        sizeChange(val){
            this.params.pageSize=val;
            this.getList();
        },
        //处理
        async doComplaint(row){
            let confirm = await this.$myconfirm("你确认处理完该投诉了吗");
            if(confirm){
                let res = await editComplaintApi({id:row.id,status:1})
                if(res && res.code==200){
                    this.getList();
                    this.$message.success(res.msg);
                }
            }
            
        }
    },
};
</script>

<style lang="scss" scoped>

</style>