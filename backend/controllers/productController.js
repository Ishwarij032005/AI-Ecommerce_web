const Product = require('../models/productModel');

exports.list = async (req, res) => {
  try {
    const q = req.query.q || '';
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, price, category, tags, stock, seasonalScore } = req.body;
    const tagsArr = tags ? (typeof tags === 'string' ? tags.split(',').map(s => s.trim()) : tags) : [];
    const images = (req.files || []).map(f => '/uploads/' + f.filename);
    const product = new Product({
      name,
      description,
      price,
      category,
      tags: tagsArr,
      stock: stock || 100,
      seasonalScore: seasonalScore || 0,
      images
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    const { name, description, price, category, tags, stock, seasonalScore } = req.body;
    if (name) p.name = name;
    if (description) p.description = description;
    if (price) p.price = price;
    if (category) p.category = category;
    if (tags) p.tags = typeof tags === 'string' ? tags.split(',').map(s => s.trim()) : tags;
    if (stock) p.stock = stock;
    if (seasonalScore) p.seasonalScore = seasonalScore;
    if (req.files && req.files.length) {
      p.images = p.images.concat(req.files.map(f => '/uploads/' + f.filename));
    }
    await p.save();
    res.json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
