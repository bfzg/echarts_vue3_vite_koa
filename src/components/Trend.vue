<template>
    <div class='com-container'>
        <div class="title" :style="comStyle">
            <span>🐲这是标题</span>
            <span class="iconfont title-icon" :style="comStyle" @click="showChoice = !showChoice">&#xe6eb;</span>
            <div class="select-con" v-show="showChoice" :style="marginStyle">
                <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
                    {{ item.text }}
                </div>
            </div>
        </div>
        <div class="com-chart" ref="trend_ref"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive,computed } from 'vue';
import * as echarts from "echarts";
import { getSellerData } from "@/request/api/api.js";
import chalks from '../assets/chalk.json';
echarts.registerTheme('chalk', chalks);
let trend_ref = ref(null);    //dom

onMounted(() => {
    initChart();
    getData();
    window.addEventListener('resize', screenAdapter);
    screenAdapter();
});

onUnmounted(() => {
    //组件销毁成功后的生命周期
    window.removeEventListener('resize', screenAdapter);
});

//computed 计算属性
let selectTypes = computed(()=>{
    if(!allData.value) return [];
    return allData.value.type
})

let showChoice = ref(false);      //控制下拉菜单显示与隐藏
let choiceType =ref('map');     //显示数据的类型

/** 初始化E_charts */
let chartInstance = null;
const initChart = function () {
    chartInstance = echarts.init(trend_ref.value, 'chalk');
    const initOption =
    {
        grid: {
            left: "3%",
            right: '4%',
            top: '35%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false
        },
        tooltip: {
            trigger: 'axis'
        },
        yAxis: {
            type: 'value'
        },
        legend: {
            left: 20,
            top: '15%',
            icon: 'circle'
        }
    }
    chartInstance.setOption(initOption);
};
/** 请求数据 */
let allData = ref([]);
const getData = async function () {
    let { data: res } = await getSellerData('trend');
    allData.value = res;
    updateChart();
}
/** 处理数据 */
// 半透明的颜色值
const colorArr1 = [
    'rgba(11, 168, 44, 0.5)',
    'rgba(44, 110, 255, 0.5)',
    'rgba(22, 242, 217, 0.5)',
    'rgba(254, 33, 30, 0.5)',
    'rgba(250, 105, 0, 0.5)'
];
// 全透明的颜色值
const colorArr2 = [
    'rgba(11, 168, 44, 0)',
    'rgba(44, 110, 255, 0)',
    'rgba(22, 242, 217, 0)',
    'rgba(254, 33, 30, 0)',
    'rgba(250, 105, 0, 0)'
];
const updateChart = function () {
    const timeArr = allData.value.common.month;
    const valueArr = allData.value[choiceType.value].data;
    const seriesArr = valueArr.map((item, index) => {
        return {
            name: item.name,
            type: 'line',
            data: item.data,
            stack: 'map',
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: colorArr1[index]
                    },
                    {
                        offset: 1,
                        color: colorArr2[index]
                    }
                ])
            }
        }
    });
    //图例的数据
    const legendArr = valueArr.map(item => {
        return item.name;
    })
    console.log(legendArr);
    let dataOption = reactive({
        xAxis: {
            data: timeArr
        },
        legend: {
            data: legendArr
        },
        series: seriesArr
    });
    chartInstance.setOption(dataOption);
}
/** 监听窗口变化 */
let titleFontSize = ref(0);  //标题的大小
const comStyle = computed(()=>{  //标题大小自适应
    return {
        fontSize: titleFontSize.value + 'px'
    }
})
const marginStyle = computed(()=>{
    return {
        marginLeft:titleFontSize.value
    }
})
const screenAdapter = function () {
    titleFontSize.value = trend_ref.value.offsetWidth / 100 * 3.6;
    const adapterOption = {
        itemWidth: titleFontSize.value,
        itemHeight:titleFontSize.value,
        itemGep: titleFontSize.value,
        textStyle:{
            fontSize:titleFontSize.value
        }
    };
    chartInstance.setOption(adapterOption);
    chartInstance.resize();
}
/** 点击切换城市 */
const handleSelect = function(currentTypes){
    choiceType.value = currentTypes;
    updateChart();
}
</script>

<style lang="less" scoped>
.title{
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color: white;
    cursor: pointer;
    .title-icon{
        cursor: pointer;
    }
}
</style>