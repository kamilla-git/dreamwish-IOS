import { io, Socket } from 'socket.io-client';

const API_URL = 'http://127.0.0.1:8000'; 

let token: string | null = null;
let socket: Socket | null = null;

export const api = {
  setToken: (t: string | null) => { token = t; },
  getToken: () => token,
  
  // LOGIN - Исправлено на чистый JSON (убираем x-www-form-urlencoded)
  login: async (data: any) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: data.username, // Почта, которую ввел пользователь
        password: data.password
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Неверный логин или пароль');
    }
    return response.json();
  },

  register: async (data: any) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Ошибка регистрации');
    }
    return response.json();
  },

  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getPublicWishlists: async () => {
    try {
      const response = await fetch(`${API_URL}/wishlists/public/all`);
      return await response.json();
    } catch (e) { return []; }
  },

  getMyWishlists: async () => {
    const response = await fetch(`${API_URL}/wishlists/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getPublicWishlist: async (slug: string) => {
    const response = await fetch(`${API_URL}/wishlists/public/${slug}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    return response.json();
  },

  createWishlist: async (data: any) => {
    const response = await fetch(`${API_URL}/wishlists/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  autoAddGift: async (wishlistId: number, url: string) => {
    const scrapeRes = await fetch(`${API_URL}/wishlists/scrape?url=${encodeURIComponent(url)}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!scrapeRes.ok) throw new Error('Не удалось получить данные о товаре');
    const data = await scrapeRes.json();

    const giftData = {
      title: data.title || "Новое желание",
      url: url,
      price: Number(data.price) || 0,
      image_url: data.image_url || "",
      wishlist_id: wishlistId
    };

    const addRes = await fetch(`${API_URL}/wishlists/${wishlistId}/gifts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(giftData)
    });

    if (!addRes.ok) throw new Error('Бэкенд не принял данные');
    return addRes.json();
  },

  reserveGift: async (giftId: number) => {
    const response = await fetch(`${API_URL}/wishlists/gifts/${giftId}/reserve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ email: 'mobile@dreamwish.com' })
    });
    return response.json();
  },

  contribute: async (giftId: number, amount: number) => {
    const response = await fetch(`${API_URL}/wishlists/gifts/${giftId}/contribute`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount: Number(amount), contributor_email: 'mobile@dreamwish.com' })
    });
    return response.json();
  },

  initSocket: (slug: string, onUpdate: () => void) => {
    if (socket) socket.disconnect();
    socket = io(API_URL, { transports: ['websocket'] });
    socket.on('connect', () => socket?.emit('join_wishlist', slug));
    socket.on('wishlist_updated', onUpdate);
    return () => { socket?.disconnect(); };
  }
};
