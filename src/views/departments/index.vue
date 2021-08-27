<template>
  <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
  <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 下面就是树形控件内容了 -->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepats="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增表单 弹出层 -->
    <add-depts ref="edit" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDepts from './components/add-depts.vue'
export default {
  name: 'Departments',
  components: { TreeTools, AddDepts },
  props: {},
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [], // 部门信息
      company: {}, // 公司信息
      showDialog: false, // 弹出框显示控制
      node: null// 存储节点信息
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDepartments()
  },
  mounted() {},
  methods: {
    // 获取部门信息
    async  getDepartments() {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
    },
    // 添加部门
    addDepts(node) {
      this.node = node
      this.showDialog = true
    },
    // 修改部门
    editDepts(node) {
      this.node = node
      this.$refs.edit.getDepartDetail(node.id)
      this.showDialog = true
    }
  }

}
</script>

<style  scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}

</style>
