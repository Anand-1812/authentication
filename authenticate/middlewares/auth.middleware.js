import jwt from "jsonwebtoken";

export const authMiddleWare = async function(req, res, next) {
  try {
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) {
      return next();
    }

    if (!tokenHeader.startsWith('Bearer')) {
      return res.status(400)
        .json({ error: `authorization header must start with bearer.` });
    }
    const token = tokenHeader.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_TOKEN);

    req.user = decode;
    next();

  } catch (error) {
    next();
  }
}

export const ensureAuth = async function(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: `You must be authenticated.` });
  }

  next();
}

export const restrcitToRole = function(role) {
  return function(req, res, next) {
    if (req.user.role !== role) {
      return res.status(400)
        .json({ error: `You are not authorized to access this resource.` })
    }
    return next();
  };
}

