<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <tree-tools :tree-node="company" :is-root="true" />
        <!-- 下面就是树形控件内容了 -->
        <el-tree :data="departs" :props="defaultProps">
          <tree-tools slot-scope="{ data }" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Departments',
  components: { TreeTools },
  props: {},
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [
      ],
      company: { }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDepartments()
  },
  mounted() {},
  methods: {
    async  getDepartments() {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(res.depts, '')
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
