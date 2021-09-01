<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 上面导航 -->
      <PageTools>
        <span slot="before">共有{{ page.total }}条记录 </span>
        <div slot="after">
          <el-button icon="el-icon-plus" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button icon="el-icon-plus" type="primary" @click="exportData">excel导出</el-button>
          <el-button icon="el-icon-plus" type="warning" @click="addEmployee">新增员工</el-button>
        </div>
      </PageTools>
      <!-- 下面表单 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column align="center" sortable="" label="序号" type="index" />
          <el-table-column align="center" sortable="" label="姓名" prop="username" />
          <el-table-column align="center" sortable="" label="手机号" prop="mobile" />
          <el-table-column align="center" sortable="" label="工号" prop="workNumber" />
          <el-table-column align="center" sortable="" label="聘用形式" prop="formOfEmployment" :formatter="employeesFormatter" />
          <el-table-column align="center" sortable="" label="部门" prop="departmentName" />
          <el-table-column align="center" sortable="" label="入职时间">
            <template slot-scope="{row}">
              {{ row.timeOfEntry|formatDate }}
            </template>
          </el-table-column>
          <el-table-column align="center" sortable="" label="操作" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 新增|修改弹出层 -->
    <add-employee ref="add" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeConstant from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
export default {
  name: 'Employees',
  components: { AddEmployee },
  props: {},
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadEmployee()
  },
  mounted() {},
  methods: {
    async loadEmployee() {
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
    },
    // 页码变化
    pageChange(val) {
      this.page.page = val
      this.loadEmployee(

      )
    },
    // 格式化聘用形式
    employeesFormatter(row, column, cellValue, index) {
      // row 每行的详细数据
      // column {order: "", id: "el-table_1_column_5", type: "default", property: "formOfEmployment", align: null,
      // cellValue==>表单中的值
      // index==>索引
      // 找 cellValue所对应的值
      const obj = EmployeeConstant.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工信息
    async delEmployee(id) {
      try {
        // 01.提醒框
        await this.$confirm('是否确定删除?')
        // 02.发送删除请求
        await delEmployee(id)
        // 02.1.页码问题
        if (this.page.page !== 1 && this.list.length === 1) {
          this.page.page--
        }
        // 03.成功提醒
        this.$message('删除成功')
        // 04.重新拉取
        this.loadEmployee()
      } catch (err) {
        console.log(err)
      }
    },
    // 添加员工信息
    addEmployee() {
      this.$refs.add.showDialog = true// 打开弹窗
    },
    // 导出员工信息
    exportData() {
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      /*
       * data==>[[]] ==>['姓名', '薪资'],
       * header==>[] ==>[['张三', 12000], ['李四', 5000]],
       */
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)// 将[{}]转化成[[]]
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data, // 具体数据 必填
          filename: '员工信息表', // 非必填
          // autoWidth: true, // 非必填==>单元格是否要自适应宽度
          // bookType: 'xlsx' // 非必填==>导出文件类型
          multiHeader,
          merges
        })
      })
    },
    // 类型转化==>二维数组
    formatJson(headers, rows) {
      return rows.map(item => {
        // Object.keys(headers)==>["姓名", "手机号",...]
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeConstant.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          console.log(item[headers[key]])
          return item[headers[key]]// [张三'，'13589898989'，...]
        })
      })
    }

  }
}
</script>

<style lang="less" scoped></style>
