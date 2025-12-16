const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { isSeller } = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getSellerProducts
} = require("../controllers/productController");

// ================== PUBLIC ==================
router.get("/", getAllProducts);

// ================== SELLER ==================
// ⚠️ MUST BE BEFORE :id
router.get(
  "/seller/my-products",
  protect,
  isSeller,
  getSellerProducts
);

// ================== SINGLE PRODUCT ==================
router.get("/:id", getProductById);

// ================== CREATE PRODUCT ==================
router.post(
  "/",
  protect,
  isSeller,
  upload.array("images", 5),
  createProduct
);

// ================== UPDATE / DELETE ==================
router.put("/:id", protect, isSeller, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, isSeller, deleteProduct);

module.exports = router;
