import { Request, Response } from "express";
import { UserRepository } from "./user.repository";

export class UserController {
  private userRepository = new UserRepository();

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.create(req.body);
      res.status(201).json(user);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.findAll();
      res.status(200).json(users);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }
}
