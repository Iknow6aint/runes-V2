import { Request, Response } from "express";
import { AdminRepository } from "./admin.repository";

export class AdminController {
  private adminRepository = new AdminRepository();

  async createAdmin(req: Request, res: Response) {
    try {
      const admin = await this.adminRepository.create(req.body);
      res.status(201).json(admin);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAdmins(req: Request, res: Response) {
    try {
      const admins = await this.adminRepository.findAll();
      res.status(200).json(admins);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }
}
