const isSeller = (req, res, next) => {
  // Check if user exists (from protect middleware) and has the correct role
  if (req.user && req.user.role === "seller") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Seller privileges required." });
  }
};

module.exports = { isSeller };