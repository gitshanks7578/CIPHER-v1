import mongoose from "mongoose";
//async funcs always return a promise so we wrote Promise<void>  a promise that doesnt really have any value
export const dbconnect = async():Promise<void> =>{
    try {
        const dbinstance = await mongoose.connect(`${process.env.MONGODB_ATLAS_KEY}`)
        console.log("db connection successful")

    } catch (error) {
        if(error instanceof Error){
        console.log(`db connection failed || message : ${error.message}`)
        }
        process.exit(1)
       
    }
}

