<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="userForm" label-width="120px" style="margin-left: 120px; margin-top:30px" :model="userInfo" :rules="rules">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <component :is="userInfoComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import userInfo from '@/views/employees/components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  name: 'EmployeeDetail',
  components: { userInfo, JobInfo },
  props: {},
  data() {
    return {
      userInfoComponent: 'userInfo',
      userId: this.$route.params.id,
      userInfo: {
        userInfo: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }

    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.loadUser()
  },
  methods: {
    // 数据回显
    async loadUser() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 修改表单
    async saveUser() {
      try {
        // 校验通过
        await this.$refs.userForm.validate()
        // 发送请求
        await saveUserDetailById({ id: this.userId, username: this.userInfo.username, password: this.userInfo.password2 })
        // 保存成功
        this.$message.success('保存成功')
      } catch (err) {
        console.log(err)
      }
    }

  }
}
</script>

<style lang="less" scoped></style>
