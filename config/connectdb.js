import mongoose from "mongoose";

const connectDB=async(DATABASE_URL)=>{
try{
    const DB_OPTIONS={
        dbName:"CyberSafeSpace"
    }
    await mongoose.connect(DATABASE_URL,DB_OPTIONS)
    console.log('Conected sucessfully')
}catch(error){
console.log(error)
}

}
export default connectDB