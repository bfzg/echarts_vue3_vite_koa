//引入ws 使用 websocket
const webSocket = require('ws');
const path = require('path');
const fileUtils = require('../utils/file_utils.js');
//创建实例
const wss = new webSocket.Server({
    port: 9998
});

//服务监听
module.exports.listen = () => {
    //对客户端的连接事件进行监听
    //client:代表的是客户端的连接socket对象
    wss.on('connection', client => {
        console.log('有客户端连接成功了...');
        //对客户端的连接对象进行message 事件的监听
        //msg: 由客户端发送给后端的数据
        client.on('message',async msg => {
        console.log(JSON.parse(msg));
           let payload = JSON.parse(msg);
           const action = payload.action;
           if(action === 'getData'){
            let filePath = '../data/' + payload.chartName + '.json';
            filePath = path.join(__dirname,filePath);
            const ret = await fileUtils.getFileJsonDate(filePath);
            //在服务器获得数据的基础上，增加一个data字段
            //data所对应的值，就是某个json文件的内容
            payload.data = ret;
            client.send(JSON.stringify(payload))
           }else{
                //转发给每一个建立连接的客户端
                // wss.clients 是所有客户端的连接
                wss.clients.forEach(client=>{
                    client.send(msg);
                })
           }
        })
    })
}

