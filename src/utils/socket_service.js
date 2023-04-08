export default class SocketService {
    /**
     * 单例设计模式
     */
    static instance = null
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService();
        }
        return this.instance
    }

    //和服务端连接的socket对象
    ws = null
    //存储回调函数
    callBackMapping = {}
    //标识是否连接成功
    connected = false
    //记录尝试连接的次数
    sendRetryCount = 0
    //重新连接尝试的次数
    connectRetryCount = 0

    //定义连接服务器的方法
    // TODO 这里 main.js里面读取不到信息
    connect() {
        //连接服务器
        if (!window.WebSocket) {
            return alert('您的浏览器不支持websocket');
        }
        this.ws = new WebSocket('ws://127.0.0.1:9998');

        //连接成功事件
        this.ws.onopen = () => {
            console.log('连接成功!');
            this.connected = true
            this.connectRetryCount=0
        }

        //连接失败事件
        this.ws.onclose = () => {
            console.log('连接服务器失败!');
            this.connected = false
            this.connectRetryCount++
            setTimeout(()=>{
                this.connect()
            },500*this.connectRetryCount)
        }

        //服务器返回的数据
        this.ws.onmessage = (msg) => {

            const recvData = JSON.parse(msg.data)
            const socketType = recvData.socketType
            //判断回调函数是否存在
            if (this.callBackMapping[socketType]) {
                const action = recvData.action
                if (action === 'getData') {
                    const realData = JSON.parse(recvData.data);
                    this.callBackMapping[socketType].call(this, realData)
                } else if (action === 'fullScreen') {

                } else if (action === 'themeChange') {

                }
            }
        }
    }

    //注册回调函数
    registerCallBack(socketType, callBack) {
        this.callBackMapping[socketType] = callBack
    }
    //清除回调函数
    unRegisterCallBack(socketType) {
        this.callBackMapping[socketType] = null
    }
    //发送数据的原型对象
    send(data) {
        if (this.connected) {
            this.sendRetryCount = 0
            this.ws.send(JSON.stringify(data))
        } else {
            this.sendRetryCount++
            setTimeout(() => {
                this.send(data)
            }, this.sendRetryCount * 500)
        }
    }
}