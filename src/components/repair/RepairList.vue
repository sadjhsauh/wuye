<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item >维修管理</el-breadcrumb-item>
            <el-breadcrumb-item >维修列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="18" >
                    <el-form :model="params" label-width="80px" :inline="true" size="small">
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
            
            <!-- 维系列表 -->
            <el-table :data="tableList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>   
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="commitTime" label="维修时间"></el-table-column>
                <el-table-column prop="videoId" label="视频id"></el-table-column>
                <el-table-column prop="status" label="维修状态">
                    <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==0" type="success" size="small">未维修</el-tag>
                    <el-tag v-if="scope.row.status==1" type="danger" size="small">已维修</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="doRepair(scope.row)">处理</el-button>
                        <el-button type="primary" icon="el-icon-caret-right" size="small" @click="playRepair(scope.row)">故障播放</el-button>
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
            :title="videoDialog.title"
            :visible.sync="videoDialog.visible"
            :width="videoDialog.width"
            >
            <video :src="url" style="width:100%;height:100%" controls autoplay> </video>
        </el-dialog>
        
        
    </div>
</template>

<script>
import {getListApi,editRepairApi} from '@/api/repair'
export default {
    name: 'RepairList',

    data() {
        return {
            //查询数据
            params:{
                content:'',
                currentPage:1,
                pageSize:5,
                total:0
            },
            //维修列表
            tableList:[],
            //视频对话框
            videoDialog:{
                title:'故障播放',
                visible:false,
                width:'800px'
            },
            url:''
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
        async doRepair(row){
            let confirm = await this.$myconfirm("你确认处理完该故障了吗");
            if(confirm){
                let res = await editRepairApi({id:row.id,status:1})
                if(res && res.code==200){
                    this.getList();
                    this.$message.success(res.msg);
                }
            }
            
        },
        playRepair(row){
            this.videoDialog.visible=true;
            this.url = "http://127.0.0.1:8888/api/video/"+row.videoId+"?authorization="+sessionStorage.getItem("authorization");
        }

    },
};
</script>

<style lang="scss" scoped>

</style>