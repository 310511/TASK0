const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerProfile({
      firebaseUid: req.firebase.uid,
      email: req.firebase.email,
      fullName: req.body.full_name
    });

    return res.status(201).json({
      success: true,
      data: {
        message: 'User profile registered successfully',
        user
      }
    });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUserProfile(req.firebase.uid);

    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    return next(error);
  }
};

const patchRole = async (req, res, next) => {
  try {
    const user = await authService.updateUserRole(req.params.userId, req.body.role);

    return res.status(200).json({
      success: true,
      data: {
        message: 'User role updated successfully',
        user
      }
    });
  } catch (error) {
    return next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();

    return res.status(200).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  me,
  patchRole,
  listUsers
};
