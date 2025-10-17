export const getCart = () => {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
};
export const setCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));
