import { Request, Response } from "express";
import { Code } from "../models/Code";

export const saveCode = async (req: Request, res: Response) => {
  const { fullCode } = req.body;

  try {
    const newCode = await Code.create({
      fullCode: fullCode,
    });

    return res.status(201).send({ url: newCode._id, status: "saved !" }); //*got url
  } catch (error) {
    res.status(500).send({ message: "error saving code", error });
  }
};


//&load code 

export const loadCode = async (req: Request, res: Response) => {
  const { urlId } = req.body;
  // console.log("url not fount",urlId)//^undefined 

  try {
    const existingCode = await Code.findById(urlId);
    // console.log("existing code not found ",existingCode)//^null
    if (!existingCode) {
      return res.status(404).send({ message: "Code not found" });
    }

    return res.status(200).send({ fullCode: existingCode.fullCode });
  } catch (error) {
    // Handle any errors and return 500 status code
    console.error("Error loading code:", error);
    return res.status(500).send({ message: "Error loading code", error });
  }
};