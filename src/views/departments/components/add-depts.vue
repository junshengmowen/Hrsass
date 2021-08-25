<template>
  <!-- 新增部门的弹层 -->
  <el-dialog title="新增部门" :visible="showDialog" @close="closeBtn">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="formDepts" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getPeopleTable">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="closeBtn">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addDepartments, getDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDepts',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      const res = await getDepartments()
      console.log(res)
      const isRepeat = res.depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      console.log(isRepeat)
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      const isRepeat = depts.some(item => item.code === value && value)
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍

      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          // 自定义函数的形式校验
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
        ]
      },
      peoples: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 获取负责人列表
    async getPeopleTable() {
      this.peoples = await getEmployeeSimple()
    },
    // 提交表单,新增部门
    btnOk() {
      this.$refs.formDepts.validate(async valid => {
        if (valid) {
          // 校验成功
          // 发送请求
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
          // 重新拉取列表
          this.$emit('addDepts')
          // 关闭弹窗
          this.$emit('update:showDialog', false)
          //  重置表单
          this.$refs.formDepts.resetFields()
        }
      })
    },
    // 关闭弹窗
    closeBtn() {
      // 关闭弹窗
      this.$emit('update:showDialog', false)
      //  重置表单
      this.$refs.formDepts.resetFields()
    }
  }
}
</script>

<style lang="less" scoped></style>
