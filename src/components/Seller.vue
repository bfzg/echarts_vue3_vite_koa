<template>
  <div class='com-container'>
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted, reactive, onUnmounted,defineExpose} from "vue";
import { getSellerData } from "@/request/api/api.js";
import chalks from '../assets/chalk.json';
echarts.registerTheme('chalk', chalks);

onMounted(() => {
  initChart();
  getDate();
  window.addEventListener('resize', screenAdapter)
  screenAdapter();
})

//销毁之前生命周期
onUnmounted(() => {
  clearInterval(timerId.value);    //清除定时器
  window.removeEventListener('resize', screenAdapter);   //清除屏幕监听器
})

//分页参数
let pageParams = reactive({
  currentPage: 1,  //当前显示的页数
  totalPage: 0     //一共多少页
})

/** 初始化echartInstance对象*/
var chartInstance = null;    //echarts对象实例
let seller_ref = ref(null);     //需要被渲染的dom


const initChart = () => {

  chartInstance = echarts.init(seller_ref.value, 'chalk');

  //对图标初始化配置的控制
  const initOption = reactive({
    title: {
      text: '📈 商家销售统计',
      left: 20,
      top: 20
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '6%',
      bottom: '3%',
      containLabel: true    //距离包含坐标轴上的文字
    },
    xAxis: {
      type: "value"
    },
    yAxis: {
      type: "category",

    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        z: 0,
        shadowStyle: {
          color: '#2D5546'
        }
      }
    },
    series: [
      {
        type: 'bar',
        label: {
          show: true,
          position: 'right',
          textStyle: {
            color: 'white'
          }
        },
        itemStyle: {
          barBorderRadius: [0, 35, 35, 0],
          //线性渐变  颜色渐变的方向  不同百分比下的值
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            //百分之0的颜色
            { offset: 0, color: '#5052ee' },
            //百分之一百的颜色
            { offset: 1, color: '#ab6ee5' }
          ])
        }
      }
    ]
  })
  chartInstance.setOption(initOption)

  //对图表鼠标 移入 移出 事件进行监听
  chartInstance.on('mouseover', () => {
    clearInterval(timerId.value)
  });
  chartInstance.on('mouseout', () => {
    startInterval();
  })
};

/** 获取服务器数据 */
var allData = ref(null);
const getDate = async () => {
  let { data: res } = await getSellerData('seller');
  allData.value = res.sort((a, b) => {
    return a.value - b.value;    //从小到大排序
  });
  //每5个显示一页
  pageParams.totalPage = allData.value.length % 5 === 0 ? allData.value.length / 5 : allData.value.length / 5 + 1;
  updateChart();
  startInterval();
};

/** 更新图表*/
const updateChart = () => {
  //对显示数据进行处理
  let sliceParams = reactive({
    start: (pageParams.currentPage - 1) * 5,
    end: pageParams.currentPage * 5
  });
  const showData = ref(allData.value.slice(sliceParams.start, sliceParams.end));
  //渲染
  const sellerNames = showData.value.map((item) => {
    return item.name
  });
  const sellerValues = showData.value.map((item) => {
    return item.value
  })
  const dataOption = {
    yAxis: {
      data: sellerNames
    },
    series: [
      {
        data: sellerValues,
      }
    ]
  };
  chartInstance.setOption(dataOption)
}

/** 每隔3秒翻页*/
let timerId = ref(null);    //定时器标示
const startInterval = () => {
  if (timerId.value) {
    clearInterval(timerId.value);
  }
  timerId.value = setInterval(() => {
    pageParams.currentPage++;
    if (pageParams.currentPage > pageParams.totalPage) pageParams.currentPage = 1;
    updateChart();
  }, 3000);
}
/** 当浏览器的大小发生变化时调用的事件 用来适配屏幕 */
const screenAdapter = () => {
  let titleFontSize = seller_ref.value.offsetWidth / 100 * 3.6;
  //和屏幕分辨率的配置项
  const adapterOption = reactive({
    title: {
      textStyle: {
        fontSize: titleFontSize*1.2
      },
    },
    tooltip: {
      axisPointer: {
        shadowStyle: {
          width: titleFontSize,
        }
      }
    },
    series: [
      {
        barWidth: titleFontSize,
        itemStyle: {
          barBorderRadius: [0, titleFontSize/2, titleFontSize/2, 0],
        }
      }
    ]
  })
  chartInstance.setOption(adapterOption);
  //  手动调用图表的对象resize 才能产生效果
  chartInstance.resize();
}
defineExpose({
    screenAdapter
})
</script>

<style scoped></style>