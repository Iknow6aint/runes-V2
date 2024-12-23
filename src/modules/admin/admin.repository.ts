import { AdminModel, IAdmin } from "./admin.schema";

export class AdminRepository {
  async create(data: Partial<IAdmin>): Promise<IAdmin> {
    return AdminModel.create(data);
  }

  async findAll(): Promise<IAdmin[]> {
    return AdminModel.find();
  }
}
