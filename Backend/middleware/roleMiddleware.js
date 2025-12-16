const isSeller = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    next();
  } else {
    res.status(403).json({ message: "Seller access only" });
  }
};

module.exports = { isSeller };
