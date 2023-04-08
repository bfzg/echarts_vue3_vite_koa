<template>
    <div class='com-container'>
        <div class="com-chart" ref="rank_ref"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,defineExpose } from 'vue';
import * as echarts from "echarts";
import { getSellerData } from "@/request/api/api.js";
import chalks from '../assets/chalk.json';
echarts.registerTheme('chalk', chalks);

let rank_ref = ref(null);

onMounted(() => {
    initChart();
    getData();
    window.addEventListener('resize', screenAdapter);
    screenAdapter();
})

onUnmounted(() => {
    window.removeEventListener('resize', screenAdapter);
    clearInterval(timerID.value);
})

/** 初始化E_charts */
let chartInstance = null;
const initChart = function () {
    chartInstance = echarts.init(rank_ref.value, 'chalk');
    let initOption = {
        title: {
            text: '🎢 地区销售排行',
            left: 20,
            top: 20
        },
        grid: {
            top: '40%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        tooltip: {
            show: true
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            type: 'value'
        },
        series: {
            type: 'bar'
        }
    };
    chartInstance.setOption(initOption);
    //监听鼠标移入 移除事件 暂停动画
    chartInstance.on('mouseover',()=>{
        clearInterval(timerID.value);
    });
    chartInstance.on('mouseout',()=>{
        startIntVal();
    })
};

/** 请求数据 */
let allData = ref(null);
const getData = async function () {
    let { data: res } = await getSellerData('rank');
    allData.value = res;
    allData.value.sort((a, b) => {
        return b.value - a.value;
    })
    updateChart();
    startIntVal();
};

/** 数据处理 */
let startValues = ref(0);    //列表起始位置
let endValue = ref(9);       //列表结束位置
const updateChart = function () {
    const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
    ]
    // 所有省形成的数组
    let provinceArr = allData.value.map(item => {
        return item.name
    });
    //所有省所对应的数据
    let valueArr = allData.value.map(item => {
        return item.value
    });
    let dataOption = {
        xAxis: {
            data: provinceArr
        },
        dataZoom: {
            show: false,
            startValue: startValues.value,
            endValue: endValue.value
        },
        series: {
            data: valueArr,
            itemStyle: {
                color: arg => {
                    let targetColorArr = ref(null);
                    if (arg.value > 300) {
                        targetColorArr.value = colorArr[0];
                    } else if (arg.value > 200) {
                        targetColorArr.value = colorArr[1];
                    } else {
                        targetColorArr.value = colorArr[2];
                    }
                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: targetColorArr.value[0]
                        },
                        {
                            offset: 1,
                            color: targetColorArr.value[1]
                        }
                    ]);
                }
            }
        }
    };
    chartInstance.setOption(dataOption);
};

/** 监听窗口变化 */
const screenAdapter = function () {
    const titleFontSize = rank_ref.value.offsetWidth / 100 * 3.6;
    let adapterOption = {
        title:{
            textStyle:{
                fontSize:titleFontSize
            }
        },
        series:[
            {
                type: 'bar',
                barWidth:titleFontSize,
                itemStyle:{
                    barBorderRadius:[titleFontSize / 2  ,titleFontSize / 2, 0, 0]
                }
            }
        ]
    };
    chartInstance.setOption(adapterOption);
    chartInstance.resize();
}
/** 图表自动向右移动 */
let timerID = ref(null); //定时器标识
const startIntVal = function () {
    if(timerID.value){
        clearInterval(timerID.value);
    }
    timerID.value = setInterval(() => {
        startValues.value++;
        endValue.value++;
        if (endValue.value > allData.value.length - 1) {
            startValues.value = 0;
            endValue.value = 9;
        }
        updateChart();
    }, 2300)
}
defineExpose({
    screenAdapter
})
</script>

<style scoped></style>