// AI assistance: Google Gemini (Antigravity) helped scaffold this admin controller.
import { userRepository } from '../repositories/userRepository.js';
import { gameRepository } from '../repositories/gameRepository.js';
import { auditRepository } from '../repositories/auditRepository.js';
import { success, error } from '../utils/response.js';

export const adminController = {
  async getDashboard(req, res) {
    const [stats, recentGames] = await Promise.all([
      gameRepository.getAdminStats(),
      gameRepository.getRecentGames({ limit: 10 }),
    ]);
    return success(res, { stats, recentGames });
  },

  async getUsers(req, res) {
    const { page = 1, limit = 20, search = '' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      userRepository.findAll({ limit: limitNum, offset, search }),
      userRepository.count(search),
    ]);

    return success(res, {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  },

  async updateUserStatus(req, res) {
    const targetId = parseInt(req.params.id, 10);
    const { status } = req.body;
    const actorId = req.session.userId;

    if (targetId === actorId) {
      return error(res, 'You cannot change your own status', 400);
    }

    const updated = await userRepository.updateStatus(targetId, status);
    if (!updated) return error(res, 'User not found', 404);

    await auditRepository.log({
      actorUserId: actorId,
      action: `SET_USER_STATUS_${status.toUpperCase()}`,
      targetType: 'user',
      targetId,
    });

    return success(res, updated);
  },

  async getGames(req, res) {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const games = await gameRepository.getAllGames({ limit: limitNum, offset });
    return success(res, { games });
  },

  async getAuditLogs(req, res) {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      auditRepository.find({ limit: limitNum, offset }),
      auditRepository.count(),
    ]);

    return success(res, {
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  },
};

