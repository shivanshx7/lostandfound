const express = require('express')
const app = express()
const fs = require("fs")
const path = require("path")

const crypto = require('crypto');

app.use(express.json())

app.post('/api/items',(req,res)=>{

})


app.listen(3000,()=>{
    console.log('server is running on 3000')
})