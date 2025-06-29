import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const PORT = 5000;

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://monjur:monjur@cluster0.ib5iccz.mongodb.net/chil"
    );
    console.log("Connected to MongoDB!!");
    server = app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
