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
                            <el-button type="primary" icon="el-icon-plus" @click="addRepair">添加</el-button>
                        </el-form-item>
                    </el-form>    
                </el-col>
            </el-row>
            
            <!-- 我的列表 -->
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
                        <el-button type="primary" icon="el-icon-close" size="small" @click="deleteRepair(scope.row)">删除</el-button>
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editRepair(scope.row)">编辑</el-button>
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
                <el-form-item label="维修内容" size="small">
                    <el-input v-model="editModel.content"></el-input>
                </el-form-item>
                <el-form-item label="电话" size="small">
                    <el-input v-model="editModel.phone"></el-input>
                </el-form-item>
                <el-form-item label="地址" size="small">
                    <el-input v-model="editModel.address"></el-input>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="12" >
                        <el-form-item label="上传视频" size="small">
                            <el-upload
                                :before-upload="beforeUpload"
                                :headers="headers"
                                :on-remove="onRemove"
                                :on-success="onSuccess"
                                :action="url"
                                name="video"
                                :file-list="fileList"
                                list-type="text">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">上传视频，描述报修问题</div>
                            </el-upload>
                        </el-form-item>
                       
                    </el-col>
                </el-row>
            </el-form>
            
            <span slot="footer">
                <el-button @click="onClose">取 消</el-button>
                <el-button type="primary" @click="onConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getMyListApi,addRepairApi,editRepairApi,deleteRepairApi,deleteVideoApi} from '@/api/repair'
export default {
    name: 'MyRepairList',

    data() {
        return {
            //查询数据
            params:{
                content:'',
                currentPage:1,
                pageSize:5,
                total:0
            },
            //投诉列表
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
                id:"",
                userId:"",
                content:"",
                phone:"",
                address:"",
                videoId:""
            },
            //上传回显数据
            fileList: [],
            //携带头部信息
            headers:{
                "authorization":""
            },
            url:'http://127.0.0.1:8888/api/video/upload'

        };
    },

    mounted() {
        this.getList();
    },

    methods: {
        //查询列表数据
        async getList(){
            let res = await getMyListApi(this.params);
            console.log(res);
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
        //添加投诉
        addRepair(){
            //清空表单
            this.$resetForm("editForm",this.editModel);
            //设置编辑
            this.editModel.editType="0";
            //设置标题
            this.editDialog.title="添加维修";
            this.fileList=[]
            this.editDialog.visible=true;
            
        },
        //编辑投诉
        editRepair(row){
            //复制表单
            this.$objCopy(row,this.editModel);
            //设置编辑属性
            this.editModel.editType="1";
            this.editDialog.title="编辑维修";
            this.editDialog.visible=true;
        },
        //取消
        onClose(){
            this.editDialog.visible=false;
        },
        //确认
        onConfirm(){
            this.$refs.editForm.validate(async valid=>{
                if(valid){
                    let res;
                    if(this.editModel.editType=="0"){
                        res = await addRepairApi(this.editModel);
                    }else {
                        res = await editRepairApi(this.editModel);
                    }
                    if(res && res.code==200){
                        this.editDialog.visible=false;
                        this.getList();
                        this.$message.success(res.msg);
                    }
                }
            })
        },
        //删除投诉
        async deleteRepair(row){
            let confirm = await this.$myconfirm("你确认删除吗");
            if(confirm){
                let res = await deleteRepairApi(row.id);
                console.log(res);
                if(res && res.code==200){
                    this.getList();
                    this.$message.success(res.msg);
                }
            }
        },
        //上传之前触发事件
        beforeUpload(file){
            this.headers.authorization=sessionStorage.getItem("authorization");
            return true;
        },
        //上传成功触发事件
        onSuccess(response){
            this.editModel.videoId=response.data.videoId;
        },
        //删除上传选项触发事件
        async onRemove(file){
            let res = await deleteVideoApi(file.response.data.videoId);
            if(res && res.code==200){
                this.$message.success(res.msg);
            }

        }
    },
};
</script>

<style lang="less" scoped>
</style>