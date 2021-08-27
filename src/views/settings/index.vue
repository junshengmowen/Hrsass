<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <!-- -------------------角色管理--------------------- -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- ----------------公司信息-------------------------- -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- --------------------弹框-------------------------- -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, updateRole, getRoleDetail, addRole } from '@/api/settings'
import { mapGetters } from 'vuex'

export default {
  name: 'Settings',
  components: {},
  props: {},
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 2,
        total: 0
      },
      formData: {

      }, //   // 表单信息变量
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '',
        description: ''
      },
      // 验证规则
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  watch: {},
  created() {
    this.loadRoleList()
    this.loadCompany()
  },
  mounted() {},
  methods: {
    // 初始化角色就列表
    async loadRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    // 初始化公司信息
    async loadCompany() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 分页改变
    changePage(val) {
      console.log(val)
      this.page.page = val // 将当前页码赋值给当前的最新页码
      this.loadRoleList() // 重新拉取数据
    },
    // 删除角色
    async delRole(id) {
      try {
        // 弹出框
        await this.$confirm('确定删除该角色?')
        // 发送请求
        await deleteRole(id)
        // 分页
        if (this.page.page !== 1 && this.list.length === 1) {
          this.page.page--
        }
        // 重新拉取列表
        this.loadRoleList()
      } catch (err) {
        console.log(err)
      }
    },
    // 点击编辑按钮
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true // 为了不出现闪烁的问题 先获取数据 再弹出层
    },
    async  btnOk() {
      await this.$refs.roleForm.validate()// 校验通过才能进入下一步
      if (this.roleForm.id) {
        // 修改角色
        await updateRole(this.roleForm)
      } else {
        // 新增角色

        await addRole(this.roleForm)
      }
      // 重新拉取数据
      this.loadRoleList()
      this.$message.success('操作成功')
      // 关闭弹窗
      this.showDialog = false
    },
    // 关闭弹层
    btnCancel() {
      // 重置弹框
      this.roleForm = {
        name: '',
        description: ''
      }
      // 重置表单
      this.$refs.roleForm.resetFields()
      // 关闭弹窗
      this.showDialog = false
    }
  }
}
</script>

<style lang="less" scoped></style>
