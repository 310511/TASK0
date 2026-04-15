const supabase = require('../config/supabase');

const mapUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  full_name: user.full_name,
  firebase_uid: user.firebase_uid,
  created_at: user.created_at
});

const registerProfile = async ({ firebaseUid, email, fullName }) => {
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .maybeSingle();

  if (existingUser) {
    const err = new Error('User profile already exists');
    err.status = 409;
    err.code = 'CONFLICT';
    throw err;
  }

  const { data, error } = await supabase
    .from('users')
    .insert({
      firebase_uid: firebaseUid,
      email,
      full_name: fullName
    })
    .select('*')
    .single();

  if (error) {
    const err = new Error(error.message);
    if (error.code === '23505') {
      err.status = 409;
      err.code = 'CONFLICT';
      err.message = 'User profile already exists';
    } else {
      err.status = 400;
      err.code = 'BAD_REQUEST';
    }
    throw err;
  }

  return mapUser(data);
};

const getCurrentUserProfile = async (firebaseUid) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .single();

  if (error || !data) {
    const err = new Error('User not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  return mapUser(data);
};

const updateUserRole = async (userId, role) => {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select('*')
    .single();

  if (error || !data) {
    const err = new Error('User not found or role update failed');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  return mapUser(data);
};

const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    const err = new Error(error.message);
    err.status = 500;
    err.code = 'INTERNAL_ERROR';
    throw err;
  }

  return data;
};

module.exports = {
  registerProfile,
  getCurrentUserProfile,
  updateUserRole,
  getAllUsers
};
