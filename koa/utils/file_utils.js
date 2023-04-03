const fs= require('fs');
module.exports.getFileJsonDate = (filePath)=>{
    return new Promise((resolve,reject)=>{
        fs.readFile(filePath,'utf-8',(error,data)=>{
            if(error){
                reject(error);
            }else{
                resolve(data);
            }
        })
    })
}