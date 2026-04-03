import { jwtToken } from '#utils/jwt.js';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const authUser = jwtToken.verify(token);
    req.user = authUser;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requiredRole = role => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const userRole = req.user.role;

    if (Array.isArray(role)) {
      if (!role.includes(userRole)) {
        return res
          .status(403)
          .json({ error: 'Forbidden: Insufficient permissions' });
      }
    } else if (userRole !== role) {
      return res
        .status(403)
        .json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
