const admin = require('../config/firebase');
const supabase = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization token'
        }
      });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, firebase_uid, email, role')
      .eq('firebase_uid', decodedToken.uid)
      .single();

    if (error || !user) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'USER_NOT_REGISTERED',
          message: 'Authenticated user is not registered in application database'
        }
      });
    }

    req.user = user;
    req.firebase = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired authentication token',
        details: error.message
      }
    });
  }
};

module.exports = authenticate;
