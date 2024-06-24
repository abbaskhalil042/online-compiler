import { Request, Response } from "express";
import { Code } from "../models/Code";
// import { fullCodeType } from "../types/compilerTypes";
import { AuthRequest } from "../middlewares/verifyToken";
import { User } from "../models/user";
import { fullCodeType } from "../types/fullCodeType";
// import { User } from "../models/User";

export const saveCode = async (req: AuthRequest, res: Response) => {
  const { fullCode, title }: { fullCode: fullCodeType; title: string } =
    req.body;
  let ownerName = "Anonymous";
  let user = undefined;
  let ownerInfo = undefined;
  let isAuthenticated = false;

  if (req._id) {
    user = await User.findById(req._id);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    ownerName = user?.username;
    ownerInfo = user._id;
    isAuthenticated = true;
  }

  if (!fullCode.html && !fullCode.css && !fullCode.javascript) {
    return res.status(400).send({ message: "Code cannot be blank!" });
  }
  try {
    const newCode = await Code.create({
      fullCode: fullCode,
      ownerName: ownerName,
      ownerInfo: ownerInfo,
      title: title,
    });
    if (isAuthenticated && user) {
      user.saveCode.push(newCode._id);
      await user.save();
    }
    return res.status(201).send({ url: newCode._id, status: "saved!" });
  } catch (error) {
    return res.status(500).send({ message: "Error saving code", error });
  }
};

export const loadCode = async (req: AuthRequest, res: Response) => {
  const { urlId } = req.body;
  const userId = req._id;
  let isOwner = false;
  try {
    const existingCode = await Code.findById(urlId);
    if (!existingCode) {
      return res.status(404).send({ message: "Code not found" });
    }
    const user = await User.findById(userId);
    if (user?.username === existingCode.ownerName) {
      isOwner = true;
    }
    return res.status(200).send({ fullCode: existingCode.fullCode, isOwner });
  } catch (error) {
    return res.status(500).send({ message: "Error loading code", error });
  }
};

//*getMyCodes

export const getMyCodes = async (req: AuthRequest, res: Response) => {
  const userId = req._id;
  try {

    const user=await User.findById(userId).populate({
      path:"saveCode",
      options:{sort:{createdAt:-1}}
    })

    if(!user)
      {
        return res.status(404).send({message:"cannot find user!"})

      }

      return res.status(200).send(user.saveCode)
      
  } catch (error) {
    return res.status(500).send({ message: "error loading my codes", error });
  }
};


export const deleteCode=async (req:AuthRequest,res:Response)=>{
  const userId=req._id
  const {_id}=req.params
  try {

    const owner=await User.findById(userId)

    if(!owner){
      return res.status(404).send({message:"owner not found !"})
    }
    
    return res.status(200).send({_id})
  } catch (error) {

    return res.status(500).send({message:"error while deleting code !",error})
    
  }
}


export const EditCode=async (req:AuthRequest,res:Response)=>{
  try {
    
  } catch (error) {

    return res.status(500).send({message:"Error while editing code !",error})
    
  }
}