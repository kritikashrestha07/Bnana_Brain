// AI assistance: Google Gemini (Antigravity) helped scaffold this profile controller.
import { userRepository } from '../repositories/userRepository.js';
import { success, error } from '../utils/response.js';

export const profileController = {
  async getMe(req, res) {
    const user = await userRepository.findById(req.session.userId);
    if (!user) return error(res, 'User not found', 404);
    return success(res, {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
    });
  },

  async updateMe(req, res) {
    const { displayName } = req.body;
    const updated = await userRepository.updateProfile(req.session.userId, { displayName });
    if (!updated) return error(res, 'User not found', 404);
    return success(res, {
      id: updated.id,
      username: updated.username,
      displayName: updated.display_name,
      email: updated.email,
    });
  },
};

