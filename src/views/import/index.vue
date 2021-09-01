<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="onSuccess" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'Import',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 入职时间和转正时间格式化函数
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },
    async onSuccess({ header, results }) {
      console.log(header)
      console.log(results)
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 转化类型==>将每条数据中文转化成英文
      const newArr = results.map(item => {
        console.log(item)
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
            return
          }
          userInfo[userRelations[key]] = item[key]
        })
        return userInfo
      })
      // 发送请求

      await importEmployee(newArr)
      // 成功提醒
      this.$message.success('导入成功')
      // 返回页面
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped></style>
