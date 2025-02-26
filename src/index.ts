import express, { Application } from "express";
import dotenv from 'dotenv'

dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
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



