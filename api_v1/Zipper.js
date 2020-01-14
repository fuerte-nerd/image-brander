const archiver = require('archiver')
const fs = require('fs')

class Zipper {
    constructor(dir){
        this.dirpath = dir 
        this.output
        this.archive
        this.init()
    }

    init(){
        this.ouput = fs.createWriteStream(this.dirpath + '/download.zip')
        this.archive = archiver('zip', {
            zlib: { level: 9 }
        })
    }

    zip(){
        return new Promise((res, rej)=>{
            this.archive.directory(this.dirpath, false)
            res(this.dirpath + '/download.zip')
        })
    }
}

module.exports = Zipper