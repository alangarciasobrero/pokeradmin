import User from '../models/User';

export class UserRepository {
  async findByUsername(username: string) {
    return User.findOne({ where: { username } });
  }

  async createUser(data: { username: string; password_hash: string; full_name?: string; role?: 'admin' | 'user' }) {
    return User.create(data);
  }
}

export default new UserRepository();
