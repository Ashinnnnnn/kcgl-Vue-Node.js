<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { getUserSexCount, getUserRegisterMonthCount } from '@/api/dashboard'

const genderChart = ref(null)
const registerChart = ref(null)

const genderChartOption = {
  title: {
    text: '用户性别统计',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      // 2.2配置项中的具体数据
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}
const registerChartOption = {
  title: {
    text: '每月用户注册数统计',
    left: 'center',
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
    },
  ],
}

onMounted(() => {
  // 2.饼图-性别统计
  getUserSexCount().then((res) => {
    // console.log(res) // 查看返回结果, 决定如果赋值
    // 将接口返回的数据赋值给饼图配置项
    genderChartOption.series[0].data = res.data.data.data
    // 渲染饼图
    echarts.init(genderChart.value).setOption(genderChartOption)
  })

  // 3.线图-注册月份统计
  getUserRegisterMonthCount().then((res) => {
    // console.log(res) // 查看返回结果, 决定如果赋值
    // 将接口返回的数据赋值给线图配置项
    registerChartOption.xAxis.data = res.data.data.data.months
    registerChartOption.series[0].data = res.data.data.data.values
    // 渲染线图
    echarts.init(registerChart.value).setOption(registerChartOption)
  })
})
</script>

<template>
  <!-- 1.模板部分 -->
  <div class="dashboard-container">
    <div ref="genderChart" class="chart"></div>
    <!-- 饼图div -->
    <div ref="registerChart" class="chart"></div>
    <!-- 拆线图div -->
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.chart {
  width: 600px;
  height: 400px;
  margin: 20px;
}
</style>
