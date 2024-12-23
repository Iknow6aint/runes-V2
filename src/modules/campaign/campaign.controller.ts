import { Request, Response } from "express";
import { CampaignRepository } from "./campaign.repository";

export class CampaignController {
  private campaignRepository = new CampaignRepository();

  async createCampaign(req: Request, res: Response) {
    try {
      const campaign = await this.campaignRepository.create(req.body);
      res.status(201).json(campaign);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCampaigns(req: Request, res: Response) {
    try {
      const campaigns = await this.campaignRepository.findAll();
      res.status(200).json(campaigns);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }
}
