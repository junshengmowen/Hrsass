<template>
  <!-- //02.准备弹框//03.绘制表单 -->
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:70%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:70%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:70%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:70%" placeholder="请选择">
          <!-- v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value" -->
          <el-option v-for="item in EmployeeConstant.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:70%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:70%" placeholder="请选择部门" @focus="loadTree" />
        <el-tree v-if="showTree" :data="treeNode" default-expand-all="" :props="{ label: 'name' }" @node-click="selectNode" />
      </el-form-item>

      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:70%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
// 01.封装接口和请求方法
import { addEmployee } from '@/api/employees'
import { getDepartments } from '@/api/departments'// 属性部门请求接口
import { tranListToTreeData } from '@/utils'
import EmployeeConstant from '@/api/constant/employees'

export default {
  name: 'AddEmployee',
  components: {},
  props: {

  },
  data() {
    return {
      showDialog: false, // 控制弹出层显示隐藏
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }, // 表单数据
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }, // 验证规则
      treeNode: [], // 树形数据数组
      showTree: false,
      EmployeeConstant: EmployeeConstant
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 树形部门显示
    async loadTree() {
      const { depts } = await getDepartments()
      this.treeNode = tranListToTreeData(depts, '')
      this.showTree = true
    },
    // 选中节点的回调
    selectNode(node) {
      console.log(node)
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 提交表单
    async btnOk() {
      try {
        await this.$refs.addForm.validate()
        // 发送添加请求
        await addEmployee(this.formData)
        // 通知父组件更新视图
        this.$parent.loadEmployee()
        // 关闭弹窗
        this.showDialog = false
        // 成功提醒
        this.$message('添加成功')
      } catch (err) {
        console.log(err)
      }
    },
    // 关闭弹窗
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 关闭弹窗
      this.showDialog = false
      // 重置表单
      this.$refs.addForm.resetFields()
    }

  }
}
</script>

<style lang="less" scoped></style>
