<template>
<!-- 用户列表组件 -->
<!-- 卡片容器 -->
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row>
        <el-col :span="24" class="qaq">
            <el-input clearable v-model="searchVal" placeholder="请输入内容" class="input-with-select">
                <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>

        </el-col>
        <el-button @click="showDiaAddUser()" type="success">添加用户</el-button>
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
            <el-form :model="formData">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="formData.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="formData.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="formData.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="formData.mobile" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="this.dialogFormVisibleAdduser = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>

    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" style="width: 100%">
        <el-table-column type="index" label="#" width="80">
        </el-table-column>

        <el-table-column prop="username" label="姓名" width="120">
        </el-table-column>

        <el-table-column prop="email" label="邮箱">
        </el-table-column>

        <el-table-column prop="mobile" label="电话">
        </el-table-column>

        <!-- filter {{ msg | 过滤器 }}  或 v-bind=""  不能这么写:prop="create_time | fmtDate" -->
        <el-table-column label="创建日期">
            <template slot-scope="scope">
                {{scope.row.create_time | fmtDate}}
            </template>
        </el-table-column>

        <!-- 开关 -->
        <el-table-column label="用户状态">
            <!-- 这列中的内容并不是prop得到的值,而是一些组件 比如开关按钮:<el-switch>,
                 此时需要给这些组件  加容器 template
                 template容器 slot-scope 属性作用就是传值
                 slot-scope="scope" 此时"scope"就是list数组
                 scope.row 就是数组中的每个对象  其中 row 是固定的
                 比如: el-switch 的值 来源于 list.item.mg_state 
                 slot-scope是Vue自带的一个属性
             -->
            <template slot-scope="scope">
                <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>

        <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
                <!-- <el-row> -->
                <el-button plain size="mini" type="primary" icon="el-icon-edit" circle @click="showEditdia(scope.row)"></el-button>
                <el-button plain size="mini" type="success" icon="el-icon-check" circle @click="showRoledia(scope.row)"></el-button>
                <el-button plain size="mini" type="danger" icon="el-icon-delete" circle @click="showDelefirm(scope.row)"></el-button>
                <!-- </el-row> -->

            </template>
        </el-table-column>
    </el-table>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="this.dialogFormVisibleEdituser = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRoleuser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <!-- 需要一个用户名 -->
                {{currUserName}}
            </el-form-item>
            <!--用对话框和选择器-->
            <el-form-item label="角色" :label-width="formLabelWidth">
                <el-select v-model="currRoleId">
                  <!--上面这行里的 v-model绑定的值 和 下面这行 el-option的value值 如果一样, 当前显示的就是该option的 Label值 -->
                    <el-option disabled label="请选择" :value="-1"></el-option>
                    <el-option 
                    v-for="(item,index) in roles" 
                    :key="index" 
                    :label="item.roleName" 
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRoleuser = false">取 消</el-button>
            <el-button type="primary" @click="setRole()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange" 
     :current-page="pagenum" 
     :page-sizes="[2, 4, 6, 8, 10]" 
     :page-size="pagesize" 
     layout="total, sizes, prev, pager, next, jumper" 
     :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    // async mounted() {
    //     //需要设置请求头: 在请求头中使用 Authorization 字段提供 token 令牌
    //     // 在gitHub上搜索axios,然后搜索 Authorization 这个字段
    //     // 然后得到这句: axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

    //     const AUTH_TOKEN = sessionStorage.getItem('token')
    //     this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;

    //     const res = await this.$http.get('users?pagenum=1&pagesize=10')
    //     // console.log(res)
    //     const {meta,data} = res.data
    //     if (meta.status===200) {
    //         this.list = data.users
    //     }
    // },
    mounted() {
        this.loadTableData()
    },
    methods: {
        //分配角色 - 修改角色
        async setRole(user){
            //关闭对话框
           this.dialogFormVisibleRoleuser = false
           //发送请求  users/:id/role
           const res = await this.$http.put(`users/${this.getRoleByUserId}/role`,{rid:this.currRoleId})
          // console.log(res)
          const {meta:{status,msg}} = res.data
          if(status===200) {
              this.$message.success(msg)
          }
        },



        //分配角色 - 显示对话框
        async showRoledia(user) {
            // console.log(user)  //role_name
            this.getRoleByUserId = user.id

            this.dialogFormVisibleRoleuser = true
            this.currUserName = user.username

            const res = await this.$http.get('roles')
            // console.log(res)
            this.roles = res.data.data
            //当前用户的角色
            //要通过users/:id请求 获取当前用户的role_id
            const res1 = await this.$http.get(`users/${user.id}`)
            console.log(res1)
            this.currRoleId = res1.data.data.rid
        },

        //编辑用户: (确定按钮事件)发送表单
        async editUser() {
            //关闭对话框
            this.dialogFormVisibleEdituser = false
            // console.log(this.currUserId)
            //发送请求
            const res = await this.$http.put(`users/${this.currUserId}`, this.formData)
            console.log(res)
            //提示编辑功能
            const {
                meta: {
                    msg,
                    status
                }
            } = res.data
            if (status === 200) {
                this.$message.success(msg)
                this.loadTableData()
            }
        },
        //编辑用户: 显示对话框
        showEditdia(user) {
            // console.log(user)
            this.dialogFormVisibleEdituser = true,
                this.formData = user
            this.currUserId = user.id
        },

        //添加用户 表单提交
        async addUser() {
            //关闭对话框
            this.dialogFormVisibleAdduser = false
            //发送post 传数据
            const res = await this.$http.post('users', this.formData)
            // console.log(res)
            // 提示框
            const {
                meta: {
                    msg,
                    status
                }
            } = res.data
            // console.log(res)
            if (status === 201) {
                //提交完后的数据下次再添加的话还会有,所以需要清空表单数据
                // 清空方法一:
                // this.formData.user = '',
                // this.formData.password = '',
                // 清空方法二: 但是老师说在这不能使用, 因为data()中的数据是响应式数据 数组[]和对象{}是不能响应式
                this.formData = {},
                    // 清空方法三:
                    // for(const key in this.formData) {
                    //     if(this.formData.hasOwnProperty(key)) {
                    //         this.formData[key] = ''
                    //     }
                    // }

                    this.$message.success(msg)
                this.loadTableData()
            }
        },

        //添加用户 显示对话框
        showDiaAddUser() {
            this.dialogFormVisibleAdduser = true
        },

        //弹出删除提示框
        showDelefirm(user) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                //发送请求  users/:id
                const res = await this.$http.delete(`users/${user.id}`)
                // console.log(res);
                const {
                    meta: {
                        msg,
                        status
                    }
                } = res.data
                if (status === 200) {
                    this.pagenum = 1
                    this.loadTableData()
                    //     this.$message({
                    //     type: 'success',
                    //     message: '删除成功!'
                    //   });

                    this.$message.success(msg)
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        //修改用户状态
        async changeMgState(user) {
            //发送请求  users/:uId/state/:type
            const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
            // console.log(res)
            const {
                meta: {
                    msg,
                    status
                }
            } = res.data
            if (status === 200) {
                //提示框
                this.$message.success(msg);
            }
        },

        //搜索用户
        async searchUser() {
            this.loadTableData()
        },

        //分页的相关方法
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.loadTableData()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            // this.pagenum = 2 = val
            this.pagenum = val
            this.loadTableData()
        },

        async loadTableData() {
            //加载前的 加载动画
            // this.loading = true

            //需要设置请求头: 在请求头中使用 Authorization 字段提供 token 令牌
            // 在gitHub上搜索axios,然后搜索 Authorization 这个字段
            // 然后得到这句: axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

            const AUTH_TOKEN = sessionStorage.getItem('token')
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;

            const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
            // const res = await this.$http.get('users?pagenum=' + this.pagenum + '&pagesize='+ this.pagesize + '&query=' + this.searchVal);
            // console.log(res)
            const {
                meta,
                data
            } = res.data
            if (meta.status === 200) {
                this.total = res.data.data.total
                //加载完后停止加载动画
                // this.loading = false
                this.list = data.users
            }
        }
    },
    data() {
        return {
            list: [],
            //加载动画
            loading: false,
            //分页相关的数据
            currentPage: 1,
            //每页的条数
            pagesize: 2,
            //总数
            total: 10,
            pagenum: 1,
            //搜索关键字
            searchVal: '',
            //添加用户的对话框
            dialogFormVisibleAdduser: false,
            //添加用户的表单数据
            formData: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            formLabelWidth: '140px',
            //编辑用户的对话框
            dialogFormVisibleEdituser: false,
            //发送编辑确定按钮时的用户id
            currUserId: -1,
            //分配角色的对话框按钮
            dialogFormVisibleRoleuser: false,
            //当前的用户名
            currUserName:'',
            //v-model绑定的值 和 el-option的value值 如果一样, 
            // 当前显示的就是该option的 Label值
            //当前角色id
            currRoleId: -1,
            //roles:[]是放[角色,测试角色,超级管理员等]
            roles:[],
            //分配角色 - 修改角色需要获取的id
            getRoleByUserId:-1
        }
    }
}
</script>

<style>
.qaq {
    width: 400px;
    margin-top: 10px;
}
</style>
