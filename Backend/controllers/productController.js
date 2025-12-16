const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

/**
 * ✅ CREATE PRODUCT (SELLER ONLY)
 */
const createProduct = async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    try {
        const {
            title,
            category,
            price,
            description,
            condition,
            location
        } = req.body;

        // ❌ Validation for required fields
        if (!title || !category || !price || !description || !condition || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Robust price parsing
        const numericPrice = Number(price?.toString().trim());
        if (isNaN(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({ message: "Price must be a valid number greater than 0" });
        }

        // ✅ Validate condition enum
        const allowedConditions = ["new", "used", "old"];
        if (!allowedConditions.includes(condition)) {
            return res.status(400).json({ message: `Condition must be one of: ${allowedConditions.join(", ")}` });
        }

        // ❌ Images required
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        // ✅ Upload images to Cloudinary
        const images = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "products"
            });

            images.push({
                url: result.secure_url,
                public_id: result.public_id
            });
        }

        // ✅ Create product
        const product = await Product.create({
            title,
            category,
            price: numericPrice,  // ✅ Use numeric price
            description,
            condition,
            location,
            images,
            seller: req.user._id
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ✅ GET ALL PRODUCTS (PUBLIC)
 */
const getAllProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      location,
      condition,
      sort
    } = req.query;

    let query = {};

    // 🔍 Search by title
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    // 📦 Category filter
    if (category) {
      query.category = category;
    }

    // 📍 Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // ⚙ Condition filter
    if (condition) {
      query.condition = condition;
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 🔃 Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "price_low") sortOption = { price: 1 };
    if (sort === "price_high") sortOption = { price: -1 };

    const products = await Product.find(query)
      .populate("seller", "name email role")
      .sort(sortOption);

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * ✅ UPDATE PRODUCT (SELLER ONLY – OWNER)
 */
/**
 * ✅ UPDATE PRODUCT (SELLER ONLY – OWNER)
 */
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const {
            title,
            category,
            price,
            description,
            condition,
            location,
            existingImages // We expect this from frontend now
        } = req.body;

        // Update Text Fields
        if (title) product.title = title;
        if (category) product.category = category;
        if (description) product.description = description;
        if (location) product.location = location;
        if (condition) product.condition = condition;
        if (price) product.price = Number(price);

        // 🔥 HANDLE IMAGES (Delete removed ones + Add new ones)
        
        // 1. Handle Existing Images (Determine what to keep/delete)
        if (existingImages) {
            const keepImages = JSON.parse(existingImages); // Frontend sends as JSON string

            // Find images that are in DB but NOT in keepImages list -> Delete them
            const imagesToDelete = product.images.filter(
                (img) => !keepImages.some((keep) => keep.public_id === img.public_id)
            );

            // Delete from Cloudinary
            for (const img of imagesToDelete) {
                await cloudinary.uploader.destroy(img.public_id);
            }

            // Update product images to only contain the ones we kept
            product.images = keepImages;
        }

        // 2. Handle NEW Images (Upload and Append)
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products"
                });

                product.images.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        await product.save();
        res.json(product);

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: error.message });
    }
};




/**
 * ✅ DELETE PRODUCT (SELLER ONLY – OWNER)
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // ❌ Only owner can delete
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // 🗑 Delete images from Cloudinary
        for (const img of product.images) {
            await cloudinary.uploader.destroy(img.public_id);
        }

        await product.deleteOne();

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ✅ GET LOGGED-IN SELLER PRODUCTS (SELLER ONLY)
 */
const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({
            seller: req.user._id
        }).sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductById,
    getSellerProducts
};
