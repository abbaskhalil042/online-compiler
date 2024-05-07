// Import required modules
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { saveCode } from "./compilerController";


// Controller function for user signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!(username && email && password)) {
      res.status(400).send({ message: "all fields are compulsory" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists!" });
    }
    if (!usernameRegex.test(username)) {
      return res
        .status(400)
        .send({ message: "Some characters are not allowed!" });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const jwtToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", jwtToken, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).send({
      username: user.username,
      picture: user.picture,
      email: user.email,
      savedCodes: user.saveCode,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
    console.log(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // let existingUser = undefined;

    if (!(email && password)) {
      res.status(400).send({ message: "All fields are required !" });
    }

    // if (!userId)  {
    const existingUser = await User.findOne({
      $or: [
        { email: email }, 
        { username: email }, 
      ],
    });
    // }

    if (!existingUser) {
      return res.status(400).send({ message: "User not found" });
    }

    //& match the password
    const passwordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatched) {
      return res.status(400).send({ message: "wrong password" });
    }

    const jwtToken = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", jwtToken, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).send({
      username: existingUser.username,
      picture: existingUser.picture,
      email: existingUser.email,
      savedCodes: existingUser.saveCode,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error log in!", error: error });
    // console.log(error)
  }
};

// Controller function for user logout
export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};
