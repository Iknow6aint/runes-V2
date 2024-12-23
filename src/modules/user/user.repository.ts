import { UserModel, IUser } from "./user.schema";

export class UserRepository {
  async create(data: Partial<IUser>): Promise<IUser> {
    return UserModel.create(data);
  }

  async findAll(): Promise<IUser[]> {
    return UserModel.find();
  }
}
