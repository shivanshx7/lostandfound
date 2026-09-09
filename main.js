const express = require('express')
const app = express()
const fs = require("fs")
const path = require("path")

const crypto = require('crypto');

const filePath = path.join(__dirname,"items.json")
app.use(express.json())

app.post('/api/items',(req,res)=>{
    const {itemName,type,place,date,contact}=req.body;

    fs.readFile(filePath,'utf-8',(err,data)=>{
        if (err){
            return res.status(400).json({error:"failed to fetch data"})
        }
        if(!itemName || !type || !place || !date || !contact){
            return res.status(400).json({error:"Missing any required field"})
        }
        // if (type !== "lost" || type !== "found"){
        //     return res.status(400).json({error:`type is not "lost" or "found"`})
        // }
        let writer = {id : Date.now(),status:"open",...req.body}

        let parsed = JSON.parse(data)
        parsed.push(writer)

        fs.writeFile(filePath,JSON.stringify(parsed,null,2),'utf-8',(err)=>{
            if (err){
                return res.status(400).json({error:"writing operation failed"})
                
            }
        })
        return res.status(200).json({success:"created"})
    })
})

app.get("/api/items", (req, res) => {
    const query = req.query
    const checker = ["place", "id", "itemName", "type", "date", "contact", "status"]

    const queryKeys = Object.keys(query)

    if (!queryKeys.every((key) => checker.includes(key))) {
        return res.status(400).json({ error: "no such query exists as a key" })
    }

    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            return res.status(400).json({
                error: "error while reading file and this error is written by a human"
            })
        }

        let parsed

        try {
            parsed = JSON.parse(data)
        } catch (err) {
            return res.status(500).json({ error: "failed to parse data" })
        }

        let filteredData = parsed.filter((item) => {
            return queryKeys.every((key) => {
                return String(item[key]) === String(query[key])
            })
        })

        return res.status(200).json(filteredData)
    })
})

app.listen(3000,()=>{
    console.log('server is running on 3000')
})