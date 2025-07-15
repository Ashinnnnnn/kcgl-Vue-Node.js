const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

// 生成一个 32 字节的随机 hex 字符串作为 256 bit的密钥
const key = crypto.randomBytes(32).toString('hex')
// .env 文件路径
const envFilePath = path.join(__dirname, '../.env')
// .env 文件内容
const envContent = `SECRET_KEY=${key}\n`;

// 写入 .env 文件
fs.promises.writeFile(envFilePath, envContent).then(() => {
    console.log(`密钥已写入到 ${envFilePath}`)
    console.log(`新生成密钥为 ${envContent}`)
}).catch(err => {
    console.error(err)
})




