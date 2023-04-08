<template>
    <div class='com-container'>
        <div class="com-chart" ref="stock_ref"></div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted,defineExpose } from 'vue';
import * as echarts from "echarts";
import { getSellerData } from "@/request/api/api.js";
import chalks from '../assets/chalk.json';
echarts.registerTheme('chalk', chalks);

let stock_ref = ref(null);
let timeId = ref(null);     //定时器 标识

onMounted(() => {
    initChart();
    getData();
    window.addEventListener('resize', screenAdapter);
    screenAdapter();
});

onUnmounted(() => {
    window.removeEventListener('resize', screenAdapter);
    clearInterval(timeId.value);
});

/** 初始化E_charts */
let chartInstance = null;
const initChart = function () {
    chartInstance = echarts.init(stock_ref.value, 'chalk');
    let initOption = {
        title: {
            text: '🌈 库存销量分析',
            left: 20,
            top: 20
        }
    };
    chartInstance.setOption(initOption);
    chartInstance.on('mouseover',()=>{
        clearInterval(timeId.value);
    })
    chartInstance.on('mouseout',()=>{
        startInterval();
    })
};

/** 请求数据 */
let allData = ref(null);
const getData = async function () {
    let { data: res } = await getSellerData('stock');
    allData.value = res;
    console.log(allData.value);
    updateChart();
    startInterval();
}

/** 数据处理 */
let currentIndex = ref(0);          //当前显示的页数
const updateChart = function () {
    const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
    ]
    const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
    ]
    //图表需要的数据
    const start = currentIndex.value * 5;
    const end = (currentIndex.value + 1) * 5;
    const showData = allData.value.slice(start, end);
    const seriesArr = showData.map((item, index) => {
        return {
            type: 'pie',
            center: centerArr[index],
            hoverAnimation: false,       //关闭鼠标移入饼图的效果
            labelLine: {
                show: false
            },
            label: {
                position: 'center',
                formatter: item.name + '\n\n' + item.sales,
                color: colorArr[index][0]
            },
            data: [
                {   
                    value: item.sales,
                    itemStyle:{
                        color: new echarts.graphic.LinearGradient(0,1,0,0,[
                            {
                                offset:0,
                                color:colorArr[index][0]
                            },
                            {
                                offset:1,
                                color:colorArr[index][1]
                            }
                        ])
                    }
                },
                { 
                    value: item.stock,
                    itemStyle:{
                        color:'#333843'
                    }
                }
            ]
        }
    })
    let dataOption = {
        series: seriesArr
    };
    chartInstance.setOption(dataOption);
}

/** 监听窗口变化 */
const screenAdapter = function () {
    const titleFontSize = stock_ref.value.offsetWidth / 100 *3.6;
    const innerRadius = titleFontSize * 3;
    const outterRadius = innerRadius * 1.125;
    let adapterOption = {
        title:{
            textStyle:{
                fontSize:titleFontSize
            }
        },
            series:[
                {
                    type:'pie',
                    radius:[outterRadius,innerRadius],
                    label:{
                        fontSize:titleFontSize /1.3
                    }
                },
                {
                    type:'pie',
                    radius:[outterRadius,innerRadius],
                    label:{
                        fontSize:titleFontSize /1.3
                    }
                },
                {
                    type:'pie',
                    radius:[outterRadius,innerRadius],
                    label:{
                        fontSize:titleFontSize /1.3
                    }
                },
                {
                    type:'pie',
                    radius:[outterRadius,innerRadius],
                    label:{
                        fontSize:titleFontSize /1.3
                    }
                },
                {
                    type:'pie',
                    radius:[outterRadius,innerRadius],
                    label:{
                        fontSize:titleFontSize /1.3
                    }
                },
                
            ]
    };
    chartInstance.setOption(adapterOption);
    chartInstance.resize();
};
/** 定时器 当页数超过10 归零 */
const startInterval = function(){
    if(timeId.value){
        clearInterval(timeId.value);
    }
    timeId.value = setInterval(()=>{
        currentIndex.value++
        if(currentIndex.value > 1){
            currentIndex.value = 0;
        }
        updateChart();
    },5000)
}
defineExpose({
    screenAdapter
})
</script>
  
<style scoped></style>