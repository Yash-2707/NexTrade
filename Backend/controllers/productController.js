const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            title,
            category,
            brand,
            price,
            description,
            condition,
            location
        } = req.body;

        // 1. Validate required fields
        if (!title || !category || !price || !description || !condition || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Validate Price
        const numericPrice = Number(price?.toString().trim());
        if (isNaN(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({ message: "Price must be a valid number greater than 0" });
        }

        // 3. Validate Images
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        // 4. Upload Images (Parallel execution for speed)
        const uploadPromises = req.files.map(file =>
            cloudinary.uploader.upload(file.path, { folder: "products" })
        );
        const uploadResults = await Promise.all(uploadPromises);

        const images = uploadResults.map(result => ({
            url: result.secure_url,
            public_id: result.public_id
        }));

        // 5. Save to Database
        const product = await Product.create({
            title,
            category,
            brand, // Saves brand if provided
            price: numericPrice,
            description,
            condition,
            location,
            images,
            seller: req.user._id
        });

        res.status(201).json(product);

    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET ALL PRODUCTS (With Filtering & Sorting)
// ✅ GET ALL PRODUCTS (PUBLIC)
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

        // 🔍 Search by title (Case-insensitive)
        if (keyword) {
            query.title = { $regex: keyword, $options: "i" };
        }

        // 📦 Category filter (✅ FIXED: Case-insensitive)
        // This allows "electronics" to find "Electronics", "ELECTRONICS", etc.
        if (category) {
            query.category = { $regex: category, $options: "i" };
        }

        // 📍 Location filter (Case-insensitive)
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

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Authorization Check
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this product" });
        }

        const {
            title,
            category,
            brand,
            price,
            description,
            condition,
            location,
            existingImages
        } = req.body;

        // Update Fields
        if (title) product.title = title;
        if (category) product.category = category;
        if (brand) product.brand = brand;
        if (description) product.description = description;
        if (location) product.location = location;
        if (condition) product.condition = condition;
        if (price) product.price = Number(price);

        // Image Management
        // 1. Remove deleted images from Cloudinary
        if (existingImages) {
            const keepImages = JSON.parse(existingImages);
            const imagesToDelete = product.images.filter(
                (img) => !keepImages.some((keep) => keep.public_id === img.public_id)
            );

            // Parallel delete
            await Promise.all(imagesToDelete.map(img => cloudinary.uploader.destroy(img.public_id)));

            product.images = keepImages;
        }

        // 2. Upload new images (Parallel)
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path, { folder: "products" })
            );
            const uploadResults = await Promise.all(uploadPromises);

            const newImages = uploadResults.map(result => ({
                url: result.secure_url,
                public_id: result.public_id
            }));

            product.images.push(...newImages);
        }

        await product.save();
        res.status(200).json(product);

    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Delete images from Cloudinary in parallel
        if (product.images && product.images.length > 0) {
            await Promise.all(product.images.map(img => cloudinary.uploader.destroy(img.public_id)));
        }

        await product.deleteOne();

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ message: "Failed to delete product" });
    }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("seller", "name profilePic createdAt email phone");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product details" });
    }
};

// GET SELLER PRODUCTS
const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching seller products" });
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