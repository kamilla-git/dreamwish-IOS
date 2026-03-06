import { io, Socket } from 'socket.io-client';

const API_URL = 'http://localhost:8000';

let token: string | null = null;
let socket: Socket | null = null;

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || `Error ${response.status}`);
    }
    return data;
  } else {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Server error (${response.status}): ${text.slice(0, 100)}`);
    }
    return text;
  }
};

export const api = {
  setToken: (t: string | null) => { token = t; },
  getToken: () => token,

  // --- Auth ---
  login: async (data: any) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.username, password: data.password })
    });
    return handleResponse(response);
  },

  register: async (data: any) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  updateProfile: async (data: any) => {
    const response = await fetch(`${API_URL}/auth/update`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Ошибка обновления профиля');
    return response.json();
  },

  // --- Wishlists ---
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
    return handleResponse(response);
  },

  getPublicWishlist: async (slug: string) => {
    const response = await fetch(`${API_URL}/wishlists/public/${slug}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    return handleResponse(response);
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

  deleteWishlist: async (id: number) => {
    const response = await fetch(`${API_URL}/wishlists/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // --- Friends ---
  getFriends: async () => {
    const response = await fetch(`${API_URL}/friends/list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  getFriendRequests: async () => {
    const response = await fetch(`${API_URL}/friends/requests`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  searchUsers: async (query: string) => {
    const response = await fetch(`${API_URL}/friends/search?query=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  sendFriendRequest: async (userId: number) => {
    const response = await fetch(`${API_URL}/friends/request/${userId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  acceptFriendRequest: async (requestId: number) => {
    const response = await fetch(`${API_URL}/friends/accept/${requestId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  rejectFriendRequest: async (requestId: number) => {
    const response = await fetch(`${API_URL}/friends/reject/${requestId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  getFriendsWishlists: async () => {
    const response = await fetch(`${API_URL}/wishlists/friends`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // --- Gifts ---
  scrapeUrl: async (url: string) => {
    const response = await fetch(`${API_URL}/wishlists/scrape?url=${encodeURIComponent(url)}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Товар не найден');
    return response.json();
  },

  addGift: async (wishlistId: number, data: any) => {
    const giftData = {
      title: String(data.title),
      url: String(data.url || ''),
      price: parseFloat(String(data.price)) || 0.0,
      image_url: String(data.image_url || ''),
      wishlist_id: wishlistId
    };

    const response = await fetch(`${API_URL}/wishlists/${wishlistId}/gifts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(giftData)
    });
    
    if (!response.ok) throw new Error('Ошибка добавления подарка');
    return response.json();
  },

  updateGift: async (giftId: number, data: any) => {
    const response = await fetch(`${API_URL}/wishlists/gifts/${giftId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  deleteGift: async (giftId: number) => {
    const response = await fetch(`${API_URL}/wishlists/gifts/${giftId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Нельзя удалить подарок со сборами');
    }
    return response.json();
  },

  reserveGift: async (giftId: number) => {
    const response = await fetch(`${API_URL}/wishlists/gifts/${giftId}/reserve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ email: 'mobile_user@dreamwish.com' })
    });
    if (!response.ok) throw new Error('Ошибка резервирования');
    return response.json();
  },

  contribute: async (giftId: number, amount: number) => {
    const response = await fetch(`${API_URL}/wishlists/gifts/${giftId}/contribute`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount: parseFloat(String(amount)), contributor_email: 'mobile@dreamwish.com' })
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Ошибка взноса');
    }
    return response.json();
  },

  // --- Realtime ---
  initSocket: (slug: string, onUpdate: () => void) => {
    if (socket) socket.disconnect();
    socket = io(API_URL, { transports: ['websocket'] });
    socket.on('connect', () => socket?.emit('join_wishlist', slug));
    socket.on('wishlist_updated', onUpdate);
    return () => { socket?.disconnect(); };
  }
};
