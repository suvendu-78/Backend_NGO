import mongoose from "mongoose";
import DB_NAMME from "../constant.js";
const Data = async () => {
  try {
    const responce = await mongoose.connect(
      `${process.env.MONGODB}/${DB_NAMME}`,
    );
    console.log(`database connect successfully at port${process.env.PORT}`);
    return responce;
  } catch (error) {
    console("ERROR", error);
    process.exit(1);
  }
};
export default Data;
