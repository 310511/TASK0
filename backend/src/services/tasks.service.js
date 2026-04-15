const supabase = require('../config/supabase');

const buildTaskQuery = ({ status, priority, role, userId }) => {
  let query = supabase
    .from('tasks')
    .select('id, user_id, title, description, status, priority, created_at, updated_at, users!tasks_user_id_fkey(id, email, full_name, role)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (priority) query = query.eq('priority', priority);
  if (role !== 'admin') query = query.eq('user_id', userId);

  return query;
};

const listTasks = async ({ user, filters }) => {
  const page = Number(filters.page || 1);
  const limit = Number(filters.limit || 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const query = buildTaskQuery({
    status: filters.status,
    priority: filters.priority,
    role: user.role,
    userId: user.id
  }).range(from, to);

  const { data, count, error } = await query;

  if (error) {
    const err = new Error(error.message);
    err.status = 500;
    err.code = 'INTERNAL_ERROR';
    throw err;
  }

  return { tasks: data || [], total: count || 0, page, limit };
};

const createTask = async ({ userId, payload }) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: payload.title,
      description: payload.description || null,
      priority: payload.priority || 'medium'
    })
    .select('*')
    .single();

  if (error) {
    const err = new Error(error.message);
    err.status = 400;
    err.code = 'BAD_REQUEST';
    throw err;
  }

  return data;
};

const getTaskById = async ({ id, requester }) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    const err = new Error('Task not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  if (requester.role !== 'admin' && data.user_id !== requester.id) {
    const err = new Error('You are not allowed to access this task');
    err.status = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  return data;
};

const updateTask = async ({ id, requester, payload }) => {
  const existing = await getTaskById({ id, requester });

  const updateData = {
    updated_at: new Date().toISOString()
  };

  ['title', 'description', 'status', 'priority'].forEach((key) => {
    if (payload[key] !== undefined) {
      updateData[key] = payload[key];
    }
  });

  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', existing.id)
    .select('*')
    .single();

  if (error) {
    const err = new Error(error.message);
    err.status = 400;
    err.code = 'BAD_REQUEST';
    throw err;
  }

  return data;
};

const deleteTask = async ({ id, requester }) => {
  const existing = await getTaskById({ id, requester });

  const { error } = await supabase.from('tasks').delete().eq('id', existing.id);

  if (error) {
    const err = new Error(error.message);
    err.status = 500;
    err.code = 'INTERNAL_ERROR';
    throw err;
  }
};

module.exports = {
  listTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
};
