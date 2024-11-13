import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({});
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedUser.userId) {
      req.userId = decodedUser.userId;
      next();
    } else {
      return res.status(403).json({});
    }
  } catch (error) {
    res.status(403).json({});
  }
};

export default authMiddleware;
