// app/api/utils/route.js
const GUEST_ID_KEY = 'app_guest_id';
const CART_KEY_PREFIX = 'app_cart_';

function getOrCreateGuestId() {
  if (typeof window === 'undefined') return 'guest';
  try {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id = 'guest_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    return id;
  } catch (err) {
    console.error('getOrCreateGuestId error', err);
    return 'guest';
  }
}

function storageKeyFor(userKey) {
  const key = userKey || getOrCreateGuestId();
  return CART_KEY_PREFIX + key;
}

export const getCart = (userKey) => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKeyFor(userKey));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('getCart parse error', err);
    return [];
  }
};

/** saveCart: write to localStorage AND dispatch same-tab event */
export const saveCart = (cart, userKey) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKeyFor(userKey), JSON.stringify(cart || []));
    // notify same-tab listeners
    try { window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
  } catch (err) {
    console.error('saveCart error', err);
  }
};

/** addToCart uses saveCart so no extra dispatch needed here */
export function addToCart(product, qty = 1, userKey) {
  if (typeof window === 'undefined') return;
  try {
    const items = getCart(userKey);

    const id = product._id || product.id;
    const idx = items.findIndex((it) => it._id === id);
    if (idx > -1) {
      items[idx].quantity = (parseInt(items[idx].quantity, 10) || 0) + qty;
    } else {
      items.push({
        _id: id,
        productName: product.productName || product.name,
        price: product.todayPrice || product.price || 0,
        quantity: qty,
        imageUrl: product.imageUrl || product.thumbnail || ''
      });
    }

    saveCart(items, userKey);
    console.log('addToCart wrote', storageKeyFor(userKey), items);
  } catch (e) {
    console.error('addToCart error', e);
  }
}

export const removeFromCart = (id, userKey) => {
  if (typeof window === 'undefined') return [];
  try {
    const updated = getCart(userKey).filter((item) => item._id !== id);
    saveCart(updated, userKey); // saveCart now dispatches cartUpdated
    return updated;
  } catch (err) {
    console.error('removeFromCart error', err);
    return [];
  }
};

export const clearCart = (userKey) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(storageKeyFor(userKey));
    // dispatch so same-tab listeners update
    try { window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
  } catch (err) {
    console.error('clearCart error', err);
  }
};

export const setCart = (cart, userKey) => {
  saveCart(cart, userKey);
  return cart;
};
