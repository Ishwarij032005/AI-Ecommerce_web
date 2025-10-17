const { Configuration, OpenAIApi } = require('openai');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const { recommend } = require('../utils/recommendation');

const openaiKey = process.env.OPENAI_API_KEY || null;
let openai = null;
if (openaiKey) {
  const cfg = new Configuration({ apiKey: openaiKey });
  openai = new OpenAIApi(cfg);
}

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'message required' });

    if (openai) {
      const resp = await openai.createChatCompletion({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful e-commerce assistant. Keep answers concise and actionable.' },
          { role: 'user', content: message }
        ],
        max_tokens: 300
      });
      const text = resp.data?.choices?.[0]?.message?.content || 'Sorry, I could not reply.';
      return res.json({ reply: text });
    } else {
      const lower = message.toLowerCase();
      if (lower.includes('recommend')) {
        const prods = await Product.find().limit(3);
        return res.json({ reply: 'Top picks: ' + prods.map(p => p.name).join(' | ') });
      }
      return res.json({ reply: 'Hello! Ask me about products, offers, or orders.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
};

exports.recommendations = async (req, res) => {
  try {
    const productId = req.params.productId || null;
    let userPurchased = [];
    if (req.user) {
      const orders = await Order.find({ user: req.user._id });
      userPurchased = orders.flatMap(o => (o.items || []).map(it => String(it.product)));
      userPurchased = [...new Set(userPurchased)];
    }
    const recs = await recommend({ productId, userPurchased, topN: 6 });
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.projection = async (req, res) => {
  try {
    const products = await Product.find();
    const projection = products.map(p => {
      const ageDays = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const projected = Math.max(0, ((100 - ageDays) * 0.5 + (p.stock ? 100 - p.stock : 50)) * (p.seasonalScore || 1));
      return { productId: p._id, projectedSales: Math.round(projected) };
    });
    res.json({ projection });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
