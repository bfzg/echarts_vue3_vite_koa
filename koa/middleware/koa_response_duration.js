//响应时间中间件 第一层
module.exports = async (ctx,next)=>{
    //记录开始时间
    const startTime = Date.now();
    //让内层中间件执行
    await next();
    //记录结束时间
    const endTime = Date.now();
    //设置响应头
    const duration = endTime - startTime;
    ctx.set('X-Response-Time',duration+'ms');
}