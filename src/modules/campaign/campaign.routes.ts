import { Router } from "express";
import { CampaignController } from "./campaign.controller";

const router = Router();
const campaignController = new CampaignController();

router.post("/", campaignController.createCampaign.bind(campaignController));
router.get("/", campaignController.getCampaigns.bind(campaignController));

export default router;
