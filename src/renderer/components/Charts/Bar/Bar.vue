<script setup>
import * as echarts from "echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, watch, onMounted, inject } from "vue";
import ReportService from "../../../services/report.service";
import { useCounterStore } from "../../../stores/counter";
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
const counter = useCounterStore();
const autoTheme = ref("dark");
const dayJS = inject("dayJS");
const props = defineProps(["data"]);

provide(THEME_KEY, autoTheme);

watch(
  () => counter.theme,
  (val) => {
    if (val) {
      autoTheme.value = "dark";
    } else {
      autoTheme.value = "light";
    }
  }
);

const getAllKassa = (data) => {
  let kirimData = [];
  let chiqimData = [];
  ReportService.kassaSverka(data).then((res) => {
    for (let i = 0; i < res.data.length; i++) {
      let el = res.data[i];
      kirimData.push(el.kirim);
      chiqimData.push(el.chiqim);
    }
    // option.value.series[0].data = kirimData;
    // option2.value.series[0].data = chiqimData;
  });
};

const option = ref({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#000",
      },
    },
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  legend: {
    data: ["Kirim", "Chiqim"],
  },
  xAxis: [
    {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "Kassa",
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: "{value} so'm",
      },
    },
  
  ],
  series: [
    {
      name: "Kirim",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " so'm";
        },
      },
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
      ],
    },
    {
      name: "Chiqim",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " so'm";
        },
      },
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
      ],
    },
    
  ],
});

const option2 = ref({
  // title: {
  //   text: 'Referer of a Website',
  //   subtext: 'Fake Data',
  //   left: 'center'
  // },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'right'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});

const days = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const thisMonth = new Date(today.getFullYear(), today.getMonth());
  const range_date = [thisMonth.getTime(), today.getTime()];
  let sendData = {
    start_date: Math.floor(range_date[0] / 1000),
    end_date: Math.floor(range_date[1] / 1000),
    filial_id: JSON.parse(localStorage.getItem("filial_id")),
    pay_type_id: null,
  };

  const lastDayOfMonth = new Date(year, month, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // for (let i = 1; i <= daysInMonth; i++) {
  //   let el = dayJS(new Date(year, month, i).getTime()).format("YYYY-MM-DD");
  //   option.value.xAxis.data.push(el);
  // }
  getAllKassa(sendData);
};
onMounted(() => {
  days();
  if (counter.theme) {
    autoTheme.value = "dark";
  } else {
    autoTheme.value = "light";
  }
  counter.theme = JSON.parse(localStorage.getItem("theme"));
});
</script>
<template>
  <div class="d-grid">
    <div class="d-grid-item">
      <v-chart class="chart" :option="option" autoresize></v-chart>
    </div>
    <div class="d-grid-item">
      <v-chart class="chart" :option="option2" autoresize></v-chart>
    </div>
  </div>
</template>
<style scoped>
.chart {
  height: 500px;
  margin: 10px 0px;
}
.d-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
</style>
