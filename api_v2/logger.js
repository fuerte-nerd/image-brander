const colors = require('colors')

module.exports = (msg, color)=>{
    const date = new Date()
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    console.log(`${time} ${msg}`[color])
}