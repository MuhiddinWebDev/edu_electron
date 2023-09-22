<template>
  <div class="main">
    <div class="chart">
      Kunlik eng ko'p sotilgan taomlar
      <BarChart :width="50" :chartData="testData"></BarChart>
    </div>
    <div class="chart">
      Kunlik faol ofitsantlar
      <BarChart :width="50" :chartData="waiters"></BarChart>
    </div>
    <div class="chartRight">
      Savdo xajmi
      <LineChart :chartData="rightData"></LineChart>
    </div>
  </div>
</template>

<script setup>
import { Chart, registerables } from 'chart.js';
import { DoughnutChart , BarChart, RadarChart, PolarAreaChart, LineChart, PieChart } from 'vue-chart-3';

Chart.register(...registerables);
const testData = {
  labels: ['Osh', "Lag'mon", 'Manti', 'Shavla'],
  datasets: [
    {
      data: [30, 40, 60, 70],
      backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4'],
    },
  ],
};
const rightData = {
  labels: ['Mart', "Aprel", 'May', 'Iyun'],
  datasets: [
    {
      data: [30, 40, 60, 55],
      backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4'],
    },
  ],
};

const waiters = {
  labels: ['Shuhratbek', "Abubakir", 'Eldorbek', 'Muhiddin'],
  datasets: [
    {
      data: [10, 30, 60, 80],
      backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4'],
    },
  ],
}
</script>

<style scoped>
.main {
  height: calc(100vh - 130px);
  display: flex;
  width: 100%;
  /* justify-content: space-between; */
}
.chart {
  width: 300px;
  margin-left: 20px;
}

.chartRight {
  width: 300px;
  margin-left: 100px;
}
</style>
