import morgan from "morgan";
import fs from "fs";
import path from "path";
import { createStream } from "rotating-file-stream";

export const logDirectory = path.join(__dirname, "..", "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const accessLogStream = createStream("access.log", {
  interval: "1d", 
  path: logDirectory, 
  maxFiles: 7, 
});

export const fileLogger = morgan("combined", { stream: accessLogStream });

export const consoleLogger = morgan("dev"); 
