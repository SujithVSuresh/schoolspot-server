import express, { Application } from "express";
import dotenv from 'dotenv'
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";


dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();


    this.intitalizeStorage()
  }


  private intitalizeStorage(): void {
    connectDB();
    connectRedis()
  }


  public listen(): void {
    this.app.listen(process.env.PORT, () => {
      console.log(
        `🔥 Authentication service listening to port ${process.env.PORT}`
      );
    });
  }
}



const app = new App();
app.listen();



