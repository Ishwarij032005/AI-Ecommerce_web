const Order = require('../models/orderModel');
const Product = require('../models/productModel');

async function buildCoOccurrence() {
  const orders = await Order.find().lean();
  const co = {};
  for (const o of orders) {
    const pids = (o.items || []).map(it => String(it.product));
    for (let i = 0; i < pids.length; i++) {
      for (let j = 0; j < pids.length; j++) {
        if (i === j) continue;
        co[pids[i]] = co[pids[i]] || {};
        co[pids[i]][pids[j]] = (co[pids[i]][pids[j]] || 0) + 1;
      }
    }
  }
  return co;
}

async function recommend({ productId = null, userPurchased = [], topN = 6 }) {
  const co = await buildCoOccurrence();
  const scoreMap = {};
  const seeds = productId ? [String(productId)] : userPurchased.map(String);

  for (const s of seeds) {
    const row = co[s] || {};
    for (const [other, count] of Object.entries(row)) {
      scoreMap[other] = (scoreMap[other] || 0) + count;
    }
  }

  for (const s of seeds) delete scoreMap[s];

  const sorted = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]).slice(0, topN).map(x => x[0]);

  let products = [];
  if (sorted.length) {
    products = await Product.find({ _id: { $in: sorted } });
    products = sorted.map(id => products.find(p => String(p._id) === id)).filter(Boolean);
  }

  if (products.length < topN) {
    const needed = topN - products.length;
    const filler = await Product.find().sort({ seasonalScore: -1 }).limit(needed);
    products = products.concat(filler);
  }

  return products;
}

module.exports = { recommend };
