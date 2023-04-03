const koa = require('koa');
const app = new koa();

//记录请求时间
const responseDurationMiddleware = require('./middleware/koa_response_duration'); 
app.use(responseDurationMiddleware);
//设置请求头
const resposnseHeaderMiddleware = require('./middleware/koa_response_header');
app.use(resposnseHeaderMiddleware);
//业务中间件
const responseDateMiddleware = require('./middleware/koa_response_data');
app.use(responseDateMiddleware);

app.listen(8888);