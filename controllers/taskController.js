import Task from '../models/Task.js';
import { Op } from 'sequelize';

const getTasks = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { search, status, page = 1, limit = 12 } = req.query;
    
    const where = { user_id: userId };
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const tasks = await Task.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const task = await Task.findOne({ where: { id, user_id: userId } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title, description, status, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.create({
      user_id: userId,
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'pending',
      due_date: dueDate || null
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const updates = req.body;

    const task = await Task.findOne({ where: { id, user_id: userId } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.update(updates);
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const task = await Task.findOne({ where: { id, user_id: userId } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const total = await Task.count({ where: { user_id: userId } });
    const completed = await Task.count({ where: { user_id: userId, status: 'completed' } });
    const pending = await Task.count({ where: { user_id: userId, status: 'pending' } });
    const in_progress = await Task.count({ where: { user_id: userId, status: 'in-progress' } });
    
    res.json({ total, completed, pending, in_progress });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getStats
};