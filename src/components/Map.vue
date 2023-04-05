<template>
    <div class='com-container' @dblclick="revertMap">
        <div class="com-chart" ref="map_ref"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from "vue";
import * as echarts from "echarts";
import { getSellerData } from "@/request/api/api.js";
import axios from 'axios';
import chalks from '../assets/chalk.json';
import { getProvinceMapInfo } from '@/utils/map_utils.js'
echarts.registerTheme('chalk', chalks);
let map_ref = ref(null);

onMounted(() => {
    initChart();
    getData();
    window.addEventListener('resize', screenAdapter);
    screenAdapter();
})

onUnmounted(() => {
    window.removeEventListener('resize', screenAdapter);
})

/** 初始化E_charts */
let chartInstance = null;
let mapData = reactive({});     //所获取的省份的地图矢量数据
const initChart = async function () {
    chartInstance = echarts.init(map_ref.value, 'chalk');
    let ret = await axios.get('http://127.0.0.1:5173/static/map/china.json');
    echarts.registerMap('china', ret.data);
    let initOption = {
        title: {
            text: '🐬 商家分布',
            left: 20,
            top: 20
        },
        geo: {
            type: 'map',
            map: 'china',
            top: '5%',
            bottom: '5%',
            itemStyle: {
                areaColor: '#2E72BF',
                borderColor: '#333'
            }
        },
        legend: {
            left: '5%',
            bottom: '5%',
            orient: 'vertical'
        }
    }
    chartInstance.setOption(initOption);
    //监听点击省份 并跳转到当前省份的地图
    chartInstance.on('click', async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name);
        //判断当前点击的这个省份的地图数据是否存在
        if (!mapData[provinceInfo.key]) {
            let ret = await axios.get('http://127.0.0.1:5173' + provinceInfo.path);
            mapData[provinceInfo.key] = ret.data;
            echarts.registerMap(provinceInfo.key, ret.data);
        }
        const changeOption = {
            geo: {
                map: provinceInfo.key
            }
        }
        chartInstance.setOption(changeOption);
    })
};

/** 请求数据 */
let allData = ref(null);
const getData = async function () {
    let { data: res } = await getSellerData('map');
    allData.value = res;
    updateChart();
};

/** 数据处理 */
const updateChart = function () {
    //地图配置数据
    const legendArr = allData.value.map(item => {
        return item.name
    });
    const seriesArr = allData.value.map(item => {
        //想要给地图中添加一个散点 需要添加配置想coordinateSystem
        return {
            type: 'effectScatter',
            rippleEffect: {
                scale: 5,
                brushType: 'stroke'
            },
            name: item.name,
            data: item.children,
            coordinateSystem: 'geo'
        }
    });
    let dataOption = {
        legend: {
            data: legendArr
        },
        series: seriesArr
    };
    chartInstance.setOption(dataOption);
};

/** 监听窗口变化 */
const screenAdapter = function () {
    const titleFontSize = map_ref.value.offsetWidth / 100 * 3.5;
    let adapterOption = {
        title: {
            textStyle: {
                fontSize: titleFontSize
            }
        },
        legend: {
            itemWidth: titleFontSize / 2,
            itemHeight: titleFontSize / 2,
            itemGap: titleFontSize / 2,
            textStyle: {
                fontSize: titleFontSize / 2
            }
        }
    }
    chartInstance.setOption(adapterOption);
    chartInstance.resize();
}

/** 双击返回中国地图 */
const revertMap = function () {
    const revertOption = {
        geo: {
            map: 'china'
        }
    }
    chartInstance.setOption(revertOption);
}
</script>

<style scoped></style>