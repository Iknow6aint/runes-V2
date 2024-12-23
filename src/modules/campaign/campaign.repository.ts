import { CampaignModel, ICampaign } from "./campaign.schema";

export class CampaignRepository {
  async create(data: Partial<ICampaign>): Promise<ICampaign> {
    return CampaignModel.create(data);
  }

  async findAll(): Promise<ICampaign[]> {
    return CampaignModel.find().populate("createdBy", "name email");
  }
}
