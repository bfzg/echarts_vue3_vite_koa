<template>
    <div class='com-container'>
        <div class="com-chart" ref="hot_ref"></div>
        <span class="iconfont arr-left" @click="toLeft">&#xe6ef;</span>
        <span class="iconfont arr-right" @click="toRight">&#xe6ed;</span>
        <span class="cat-name">{{catName}}</span>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,computed } from 'vue';
import * as echarts from "echarts";
import { getSellerData } from "@/request/api/api.js";
import chalks from '../assets/chalk.json';
import axios from 'axios';
echarts.registerTheme('chalk', chalks);

let hot_ref = ref(null);

onMounted(() => {
    initChart();
    getData();
    window.addEventListener('resize', screenAdapter);
    screenAdapter();
});

onUnmounted(() => {
    window.removeEventListener('resize', screenAdapter);
});

//标题
const catName = computed(()=>{
    if(!allData.value){
        return ''
    }else{
        return allData.value[currentIndex.value].name
    }
})
/** 初始化E_charts */
let chartInstance = null;
const initChart = function () {
    chartInstance = echarts.init(hot_ref.value,'chalk');
    let initOption = {
        title:{
            text:'🔥 热销商品',
            left:20,
            top:20
        },
        legend:{
            top:'5 %',
            icon:'circle'
        },
        tooltip:{
            show:true,
            formatter:arg=>{
               const thirdCategory =arg.data.children;
               //计算所有三级分类的总和
               let total = ref(0);
               thirdCategory.forEach(item=>{
                total.value += item.value
               })
               let retStr = ref('');
               thirdCategory.forEach(item=>{
                retStr.value += `${item.name} : ${parseInt(item.value / total.value * 100)+'%'}<br> `
               })
               return retStr.value
            }
        },
        series: [
            {
                type: 'pie',
                label:{
                    show:true
                }
            }
        ]
    };
    chartInstance.setOption(initOption);
};

/** 请求数据 */
let allData = ref(null);
const getData = async function () {
    let { data: res } = await getSellerData('hotproduct');
    allData.value = res;
    console.log(allData.value);
    updateChart();
}

/** 数据处理 */
let currentIndex = ref(0);    //所展示的饼图
const updateChart = function () {
    const legendData = allData.value[currentIndex.value].children.map(item => {
        return item.name
    });
    const seriesData = allData.value[currentIndex.value].children.map(item => {
        return {
            name: item.name,
            value: item.value,
            children:item.children
        }
    })

    let dataOption = {
        legend: {
            data: {
                data: legendData
            },
        },
        series: [
            {
                data: seriesData
            }
        ]
    };
    chartInstance.setOption(dataOption);
}

/** 监听窗口变化 */
const screenAdapter = function () {
    let titleFontSize = hot_ref.value.offsetWidth / 100 *3.6;
    let adapterOption = {
        title:{
            textSize:{
                fontSize:titleFontSize
            }
        },
        legend:{
            itemWidth:titleFontSize /2,
            itemHeigh:titleFontSize/2,
            itemGap:titleFontSize/2
        },
        series:[
            {
                radius:titleFontSize * 6,
                center:['50%','50%']
            }
        ]
    };
    chartInstance.setOption(adapterOption);
    chartInstance.resize();
}

/** 点击左箭头 */
const toLeft = function(){
    currentIndex.value++;
    if(currentIndex.value > allData.value.length-1){
        currentIndex.value=0;
    }
   
    updateChart();
};

/** 点击右箭头 */
const toRight = function(){
    currentIndex.value--;   
    if(currentIndex.value < 0){
        currentIndex.value=allData.value.length-1;
    } 
    updateChart();
}
</script>

<style lang="less" scoped>
.arr-left {
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: black;
    width: 50px;
    height: 100px;
    font-size: 40px;
    background-color: rgba(255, 255, 255, 0.5);
    line-height: 100px;
    border-radius: 10px;
    text-align: center;
}
            //ps 这里可以搞个公共类我懒得搞了
.arr-right {
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: black;
    width: 50px;
    height: 100px;
    font-size: 40px;
    background-color: rgba(255, 255, 255, 0.5);
    line-height: 100px;
    border-radius: 10px;
    text-align: center;
}
.cat-name{
    position: absolute;
    left: 80%;
    bottom: 30px;
    font-size: 36px;
    color: #fff;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
}
</style>