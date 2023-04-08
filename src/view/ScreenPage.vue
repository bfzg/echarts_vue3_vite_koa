<template>
    <div class="screen-container">
        <header class="screen-header">
            <div>
                <img src="/static/img/header_border_dark.png" alt="">
            </div>
            <span class="logo">
                <img src="/static/img/0.png" alt="" />
            </span>
            <span class="title">电商平台实时监控系统</span>
            <div class="title-right">
                <img src="/static/img/qiehuan_dark.png" class="qiehuan">
                <span class="datetime">2049-01-01 00:00:00</span>
            </div>
        </header>
        <div class="screen-body">
            <section class="screen-left">
                <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
                    <Trend ref="trend"></Trend>
                    <div class="resize"  @click="changeSize('trend')">
                        <span class="iconfont icon-compress-alt"></span>
                    </div>
                </div>
                <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
                    <Seller ref="seller"></Seller>
                    <div class="resize"  @click="changeSize('seller')">
                        <span class="iconfont icon-compress-alt"></span>
                    </div>
                </div>
            </section>
            <section class="screen-middle" >
                <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
                    <Map ref="map"></Map>
                    <div class="resize"  @click="changeSize('map')">
                        <span class="iconfont icon-compress-alt"></span>
                    </div>
                </div>
                <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
                    <Rank ref="rank"></Rank>
                    <div class="resize"  @click="changeSize('rank')">
                        <span class="iconfont icon-compress-alt"></span>
                    </div>
                </div>
            </section>
            <section class="screen-right">
                <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
                    <Hot ref="hot"></Hot>
                    <div class="resize"  @click="changeSize('hot')">
                        <span class="iconfont icon-compress-alt"></span>
                    </div>
                </div>
                <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
                    <Stock ref="stock"></Stock>
                    <div class="resize" @click="changeSize('stock')">
                        <span class="iconfont icon-compress-alt"></span>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script setup>
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'

import {reactive,nextTick,ref,getCurrentInstance,onMounted} from 'vue'
//控制图表的放大与缩小
const fullScreenStatus = reactive({
    trend: false,
    seller: false,
    map: false,
    rank: false,
    hot: false,
    stock: false
});
let currentInstance = ref(null);

onMounted(()=>{
    currentInstance.value = getCurrentInstance()
})

let trend =ref(null);
let seller =ref(null);
let map =ref(null);
let rank =ref(null);
let hot =ref(null);
let stock =ref(null);

const refs = reactive({
    trend,seller,map,rank,hot,stock
})

//点击全屏事件
const changeSize = function(value){
    console.log( refs[value]);
  fullScreenStatus[value] = !fullScreenStatus[value]
    nextTick(()=>{
        refs[value].screenAdapter();
    })
}

</script>
<style lang="less" scoped>
.screen-container {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    background-color: #161522;
    color: #fff;
    box-sizing: border-box;
}

.screen-header {
    width: 100%;
    height: 64px;
    font-size: 20px;
    position: relative;

    >div {
        img {
            width: 100%;
        }
    }

    .title {
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: 20px;
        transform: translate(-50%, -50%);
    }

    .title-right {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-80%);
    }

    .qiehuan {
        width: 28px;
        height: 21px;
        cursor: pointer;
    }

    .datetime {
        font-size: 15px;
        margin-left: 10px;
    }

    .logo {
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-80%);

        img {
            height: 35px;
            width: 60px;
        }
    }
}

.screen-body {
    width: 100%;
    height: 100%;
    display: flex;
    margin-top: 10px;

    .screen-left {
        height: 100%;
        width: 27.6%;

        #left-top {
            height: 53%;
            position: relative;
        }

        #left-bottom {
            height: 31%;
            margin-top: 25px;
            position: relative;
        }
    }

    .screen-middle {
        height: 100%;
        width: 41.5%;
        margin-left: 1.6%;
        margin-right: 1.6%;

        #middle-top {
            width: 100%;
            height: 56%;
            position: relative;
        }

        #middle-bottom {
            margin-top: 25px;
            width: 100%;
            height: 28%;
            position: relative;
        }
    }

    .screen-right {
        height: 100%;
        width: 27.6%;

        #right-top {
            height: 46%;
            position: relative;

        }

        #right-bottom {
            height: 38%;
            margin-top: 25px;
            position: relative;

        }
    }
}

.resize {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
}

//全屏样式
.fullscreen {
position: fixed!important;
top: 0 !important;
left: 0 !important;
width: 100% !important;
height: 100% !important;
margin: 0 !important;
z-index: 100;
}

</style>