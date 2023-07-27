<template>
    <el-container class="home-container">
        <el-header>
            <h2>阳光小区物业系统</h2>
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><span @click="logout">退出</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                        unique-opened
                        background-color="#404147"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        :router="true"
                        >
                    
                    <!-- <el-submenu index="-1">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>首页</span>
                        </template>
                        <el-menu-item index="/welcome">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>首页</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                    
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>系统管理</span>
                        </template>
                        <el-menu-item index="/user/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>用户管理</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/role/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>角色管理</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/menu/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>菜单管理</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>房屋管理</span>
                        </template>
                        <el-menu-item index="/build/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>楼栋管理</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/unit/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>单元管理</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/house/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>房屋管理</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>业主管理</span>
                        </template>
                        <el-menu-item index="/liveUser/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>业主管理</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>收费管理</span>
                        </template>
                        <el-menu-item index="/feePower/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>电费管理</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/feeWater/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>水费管理</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                     <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>投诉管理</span>
                        </template>
                        <el-menu-item index="/complaint/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>投诉列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/complaint/myList">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>我的列表</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="6">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>维修管理</span>
                        </template>

                        <el-menu-item index="/repair/list">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>维修列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/repair/myList">

                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>我的维修</span>
                            </template>
                        </el-menu-item>
                    </el-submenu> -->
                    
                    <el-submenu v-if="menuCodes.includes(firstMenu.menuCode)" :index="firstMenu.menuId+''" v-for="(firstMenu,index) in menuList">
                        <template slot="title">
                            <i :class="firstMenu.icon"></i>
                            <span>{{firstMenu.moduleLabel}}</span>
                        </template>
                        <el-menu-item v-if="menuCodes.includes(secondMenu.menuCode)" :index="secondMenu.url" v-for="(secondMenu,index) in firstMenu.children">
                            <template slot="title">
                                <i :class="secondMenu.icon"></i>
                                <span>{{secondMenu.moduleLabel}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main><router-view></router-view></el-main>
        </el-container>
    </el-container>
</template>

<script>
import {logoutApi,getInfoApi} from '@/api/login'
import {getMenuListApi} from '@/api/sys-menu'
export default {
    name: 'Home',

    data() {
        return {
            username:'',
            isCollapse:false,
            //菜单数据
            menuList:[],
            //权限码
            menuCodes:[]
        };
    },

    mounted() {
        this.getInfo();
        this.loadMenuList();
    },

    methods: {
        async logout(){          
            let res = await logoutApi();
            if(res.code==200){
                this.$message(res.msg);
                window.sessionStorage.clear();
                this.$router.push("/");
            }    
        },
        async getInfo(){
            let res = await getInfoApi();
            if(res.code==200){
                this.username = res.data.username;
                this.menuCodes = res.data.menus;
            }
        },
        toggleCollapse(){
            this.isCollapse=!this.isCollapse;
        },
        async loadMenuList(){
            let res = await getMenuListApi();
            if(res && res.code==200){
                this.menuList = res.data;
            }
        }
    },
};
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
    .el-header{
        background-color: #373C41;
        h2{
            color:#FFFFFF;
            font-size: 21px;
            font-family: '楷体';
            line-height: 60px;
            float: left;
        }
        .el-dropdown{
            float: right;
            margin-right: 70px;
            line-height: 60px;
            color:#FFFFFF;
        }
    }
    .el-aside{
        background-color: #404147;
        .el-menu{
            border-right: none;
        } 
        .toggle-button{
            background-color: #4a5064;
            font-size: 10px;
            line-height: 24px;
            color:#fff;
            text-align: center;
            letter-spacing: 0.2em;
            cursor: pointer;
        }
    }
    .el-main{
        background-color: #EAEDF2;
    }
}
.el-submenu {
    text-align: left;
}
</style>