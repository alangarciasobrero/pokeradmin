import User from '../models/User';

export class UserRepository {
  async findByUsername(username: string) {
    return User.findOne({ where: { username } });
  }

  async createUser(data: { username: string; password_hash: string; full_name?: string; role?: 'admin' | 'user' }) {
    return User.create(data);
  }

  async findAllOrderedByPoints(): Promise<User[]> {
    return User.findAll({ order: [['current_points', 'DESC']] });
  }
}

export default new UserRepository();
