import express from "express";
import { login, logout, signup } from "../controllers/userController";
// import { loadCode,saveCode} from "../controllers/compilerController";


export const userRouter=express.Router()

// compilerRouter.post("/save",saveCode)
// compilerRouter.post("/load",loadCode)
userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.post("/logout",logout)