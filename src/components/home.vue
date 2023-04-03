<template>
  <div>
    <div id="main" ref="main" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
// import {getDataList} from '../request/api/api';
let message = ref("");
let main = ref(null);
onMounted( async ()=>{
  init();
})

//使用echarts
const init = function() {
  var myChart = echarts.init(main.value);
  var option = {
    title: {
      text: "ECharts 入门示例"
    },
    tooltip: {},
    legend: {
      data: ["销量"]
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
};
</script>

<style scoped>
</style>
