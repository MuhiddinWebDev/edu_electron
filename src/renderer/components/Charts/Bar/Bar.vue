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
      kirimData.push(el.kirim)
      chiqimData.push(el.chiqim)
    }
    option.value.series[0].data = kirimData;
    option2.value.series[0].data = chiqimData;
  });
};

const option = ref({
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "bar",
      color: "#3233e4",
    },
    
  ],
});

const option2 = ref({
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "line",
      color: "red",
    },
    
  ],
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

  for (let i = 1; i <= daysInMonth; i++) {
    let el = dayJS(new Date(year, month, i).getTime()).format("YYYY-MM-DD");
    option.value.xAxis.data.push(el);
  }
  getAllKassa(sendData)
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
      Kirim
      <v-chart class="chart" :option="option" autoresize></v-chart>
    </div>
    <div class="d-grid-item">
      Chiqim
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
