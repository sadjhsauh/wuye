<template>
    <div class="bg-color">
        <div class="login-container">
            <h2>阳光小区物业系统</h2>
            <el-form :model="loginModel" ref="loginForm" :rules="rules" label-width="80px" label-position="left" :inline="false" size="small">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginModel.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginModel.password"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="captchaCode">
                    <el-input v-model="loginModel.captchaCode" style="width:50%;float:left" ></el-input>
                    <img :src="imgSrc" @click="loadCaptcha" title="看不清请刷新" style="height: 30px;margin-left: 10px;float: left;"/>
                </el-form-item>
                <el-form-item label="账号类型" prop="userType">
                    <el-radio-group v-model="loginModel.userType">
                        <el-radio :label="0" >业主</el-radio>
                        <el-radio :label="1" >物主</el-radio>
                    </el-radio-group>  
                </el-form-item>
                <el-button type="primary" style="width:100%;" @click="login">登录</el-button>
            </el-form> 
        </div>
    </div>
</template>

<script>
import {captchaApi,loginApi} from '@/api/login';
export default {
    name: 'WuyeBkLogin',

    data() {
        return {
            loginModel:{
                username:'',
                password:'',
                cpatchaCode:'',
                capthcaId:'',
                userType:''
            },
            imgSrc:'',
            rules:{
                username:[
                    { required: true, message: '用户名不能为空', trigger: 'blur' },
                ],
                password:[
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                ],
                captchaCode:[
                    { required: true, message: '验证码不能为空', trigger: 'blur' },
                ],
                userType:[
                    { required: true, message: '账号类型不能为空', trigger: 'blur' },
                ],
            }
        };
    },

    created() {
        this.loadCaptcha();
    },

    methods: {
        async loadCaptcha(){
            let res = await captchaApi();
            this.imgSrc = 'data:image/png;base64,'+ res.data.imageBase64;
            this.loginModel.cpatchaCode = res.data.captchaCode;
            this.loginModel.captchaId = res.data.captchaId;
        },
        login(){
            this.$refs.loginForm.validate(async valid=>{
                if(valid){
                    const res = await loginApi(this.loginModel);
                    if(res.code==200){
                        this.$message(res.msg)
                        window.sessionStorage.setItem("authorization",res.data.token);
                        this.$router.push("/home");
                    }

                }        
            })
        }
    },
};
</script>

<style lang="less" scoped>
.bg-color{
    width:100%;
    height:100%;
    background-color: #25AFF3;
    overflow: hidden;
    .login-container{
        width:500px;
        height: 300px;
        background-color: #FFFFFF;
        margin: 100px auto;
        border-radius: 5px;
        padding: 30px;
        h2{
            text-align: center;
            font-size: 21px;
            font-family: '微软雅黑';
            height: 70px;
            line-height: 70px;
            color:#25AFF3;
        }
    }
}
</style>