const tasksService = require('../services/tasks.service');

const listTasks = async (req, res, next) => {
  try {
    const result = await tasksService.listTasks({
      user: req.user,
      filters: req.query
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await tasksService.createTask({
      userId: req.user.id,
      payload: req.body
    });

    return res.status(201).json({
      success: true,
      data: {
        message: 'Task created successfully',
        task
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await tasksService.getTaskById({
      id: req.params.id,
      requester: req.user
    });

    return res.status(200).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await tasksService.updateTask({
      id: req.params.id,
      requester: req.user,
      payload: req.body
    });

    return res.status(200).json({
      success: true,
      data: {
        message: 'Task updated successfully',
        task
      }
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await tasksService.deleteTask({
      id: req.params.id,
      requester: req.user
    });

    return res.status(200).json({
      success: true,
      data: { message: 'Task deleted successfully' }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
};
