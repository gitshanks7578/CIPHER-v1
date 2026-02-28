import dotenv from 'dotenv'
import {dbconnect} from "./db/db"
import app from "./app"
dotenv.config()



dbconnect().then(()=>{
    const PORT = process.env.PORT || 8000;
    app.listen(PORT,()=>{
        console.log("server started successfully")
    })
}).catch((err)=>{
    if (err instanceof Error){
        console.log("dbconnect failed, src - index.js   ",err.message)
    }
})