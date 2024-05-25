import express, { NextFunction } from "express";
import cors from "cors";
import { config } from "dotenv";
import { dbConnect } from "../lib/dbConnect";
import { compilerRouter } from "./routes/compilerRoutes";
import { userRouter } from "./routes/userRouter";
import cookieParser from "cookie-parser";

const app = express();

//
app.use(express.json());
app.use(cookieParser());

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// const corsOptions ={
//   origin:'*', 
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200,
// }
// app.use(cors(corsOptions)) 

// app.use(cors({
//   origin: "http://localhost:5173", // use your actual domain name (or localhost), using * is not recommended
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
//   credentials: true
// }))


config();
dbConnect();

app.use("/compiler", compilerRouter);
app.use("/user", userRouter);

app.listen(4000, () => {
  console.log("http://localhost:4000");
});
