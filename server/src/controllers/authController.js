// AI assistance: Google Gemini (Antigravity) helped scaffold this auth controller.
import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository.js';
import { auditRepository } from '../repositories/auditRepository.js';
import { success, error } from '../utils/response.js';

export const authController = {
  async register(req, res) {
    const { username, displayName, email, password } = req.body;

    // Check for existing username/email
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      return error(res, 'An account with this email address already exists', 409);
    }
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      return error(res, 'This username is already taken', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.create({ username, displayName, email, passwordHash });

    // Establish session after registration
    req.session.regenerate((err2) => {
      if (err2) return error(res, 'Session error', 500);
      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.save((err3) => {
        if (err3) return error(res, 'Session save error', 500);
        auditRepository.log({ actorUserId: user.id, action: 'REGISTER' }).catch(console.error);
        return success(res, {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          email: user.email,
          role: user.role,
        }, 201);
      });
    });
  },

  async login(req, res) {
    const { identifier, password } = req.body;

    const user = await userRepository.findByIdentifier(identifier);
    if (!user) {
      return error(res, 'Invalid email/username or password', 401);
    }
    if (user.status !== 'active') {
      return error(res, 'Your account has been suspended. Please contact support.', 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return error(res, 'Invalid email/username or password', 401);
    }

    // Regenerate session to prevent session fixation
    req.session.regenerate((err) => {
      if (err) return error(res, 'Session error', 500);
      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.save(async (err2) => {
        if (err2) return error(res, 'Session save error', 500);
        await userRepository.updateLastLogin(user.id);
        auditRepository.log({ actorUserId: user.id, action: 'LOGIN' }).catch(console.error);
        return success(res, {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          email: user.email,
          role: user.role,
        });
      });
    });
  },

  async logout(req, res) {
    const userId = req.session?.userId;
    req.session.destroy((err) => {
      if (err) return error(res, 'Failed to end session', 500);
      res.clearCookie('connect.sid');
      if (userId) {
        auditRepository.log({ actorUserId: userId, action: 'LOGOUT' }).catch(console.error);
      }
      return success(res, { message: 'Logged out successfully' });
    });
  },

  async me(req, res) {
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

  async changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.userId;

    const hash = await userRepository.getPasswordHash(userId);
    if (!hash) return error(res, 'User not found', 404);

    const match = await bcrypt.compare(currentPassword, hash);
    if (!match) return error(res, 'Current password is incorrect', 401);

    const newHash = await bcrypt.hash(newPassword, 12);
    await userRepository.updatePassword(userId, newHash);
    auditRepository.log({ actorUserId: userId, action: 'CHANGE_PASSWORD' }).catch(console.error);

    return success(res, { message: 'Password updated successfully' });
  },
};

