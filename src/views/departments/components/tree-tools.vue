<template>

  <el-row type="flex" justify="space-between" align="middle" style="width:100%;height:40px;">
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="DeptsCommand">
            <!-- 内容 -->
            <span>操作 <i class="el-icon-arrow-down" /> </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addDepts">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="editDepts">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delDepts">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'TreeTools',
  components: {},
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    // 是否是根节点
    isRoot: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    DeptsCommand(command) {
      if (command === 'addDepts') {
        // 新增部门
        this.$emit('addDepts', this.treeNode)
      } else if (command === 'editDepts') {
        // 修改部门
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除部门
        // 01.准备删除弹框
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 02.执行删除 发送请求
          await delDepartments(this.treeNode.id)
          // 03.通知父组件更新视图
          this.$emit('delDepats')
          // 04.删除成功提醒
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          // 05.取消删除提醒
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
