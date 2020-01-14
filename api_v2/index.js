const express = require('express')
const app = express()

// classes
const InstaBrand = require('./InstaBrand')

// other modules
const cors = require('cors')
const fileUpload = require('express-fileupload')

const PORT = 5000

app.use(cors())
app.use(fileUpload())

app.post('/upload', (req, res)=>{
    InstaBrand.upload(req.files)
    .then(()=>{
        InstaBrand.processImages(req.body, req.files)
    })
})

app.listen(PORT, ()=> {console.log(`App listening on port ${PORT}`)})