import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const initialMandis = [
  {
    id: 'mandi-1',
    name: 'Azadpur Mandi',
    location: 'Delhi',
    capacity: 5000,
    currentQueue: 127,
    crops: ['Wheat', 'Paddy', 'Mustard'],
    contact: '+91-11-2767xxxx',
  },
  {
    id: 'mandi-2',
    name: 'Lasalgaon Mandi',
    location: 'Maharashtra',
    capacity: 3000,
    currentQueue: 89,
    crops: ['Onion', 'Wheat', 'Paddy'],
    contact: '+91-2550-26xxxx',
  },
  {
    id: 'mandi-3',
    name: 'Khanna Mandi',
    location: 'Punjab',
    capacity: 4500,
    currentQueue: 203,
    crops: ['Wheat', 'Paddy', 'Maize'],
    contact: '+91-1628-22xxxx',
  },
  {
    id: 'mandi-4',
    name: 'Davangere Mandi',
    location: 'Karnataka',
    capacity: 2800,
    currentQueue: 56,
    crops: ['Paddy', 'Maize', 'Cotton'],
    contact: '+91-8192-23xxxx',
  },
  {
    id: 'mandi-5',
    name: 'Guntur Mandi',
    location: 'Andhra Pradesh',
    capacity: 3500,
    currentQueue: 142,
    crops: ['Chilli', 'Cotton', 'Paddy'],
    contact: '+91-863-22xxxx',
  },
];

const tokenStatuses = ['Booked', 'Reached', 'Weighed', 'Paid'];

const useStore = create((set, get) => ({
  mandis: initialMandis,
  tokens: [],
  activeToken: null,

  bookSlot: (mandiId, cropType, quantity, dateTime) => {
    const tokenId = `TK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const mandi = get().mandis.find(m => m.id === mandiId);

    const newToken = {
      id: tokenId,
      mandiId,
      mandiName: mandi?.name || 'Unknown Mandi',
      cropType,
      quantity,
      dateTime,
      status: 'Booked',
      statusIndex: 0,
      qrPayload: JSON.stringify({
        tokenId,
        mandiId,
        cropType,
        quantity,
        dateTime,
        farmerId: 'FARMER-001',
      }),
      createdAt: new Date().toISOString(),
    };

    set(state => ({
      tokens: [...state.tokens, newToken],
      mandis: state.mandis.map(m =>
        m.id === mandiId ? { ...m, currentQueue: m.currentQueue + 1 } : m
      ),
      activeToken: newToken,
    }));

    return newToken;
  },

  updateTokenStatus: (tokenId, newStatus) => {
    const statusIndex = tokenStatuses.indexOf(newStatus);
    if (statusIndex === -1) return false;

    set(state => ({
      tokens: state.tokens.map(t =>
        t.id === tokenId ? { ...t, status: newStatus, statusIndex } : t
      ),
      activeToken: state.activeToken?.id === tokenId
        ? { ...state.activeToken, status: newStatus, statusIndex }
        : state.activeToken,
    }));

    return true;
  },

  scanToken: (qrPayload) => {
    try {
      const data = JSON.parse(qrPayload);
      const token = get().tokens.find(t => t.id === data.tokenId);
      if (token && token.status === 'Booked') {
        get().updateTokenStatus(token.id, 'Reached');
        return { success: true, token: { ...token, status: 'Reached' } };
      }
      return { success: false, message: token ? 'Already processed' : 'Invalid token' };
    } catch {
      return { success: false, message: 'Invalid QR code' };
    }
  },

  getTokenById: (tokenId) => {
    return get().tokens.find(t => t.id === tokenId);
  },

  getMandiById: (mandiId) => {
    return get().mandis.find(m => m.id === mandiId);
  },

  setActiveToken: (token) => set({ activeToken: token }),

  getAdminStats: () => {
    const today = new Date().toDateString();
    const todayTokens = get().tokens.filter(t =>
      new Date(t.dateTime).toDateString() === today
    );
    const reachedToday = todayTokens.filter(t => t.statusIndex >= 1).length;
    const weighedToday = todayTokens.filter(t => t.statusIndex >= 2).length;

    return {
      totalExpectedToday: todayTokens.length,
      currentQueueLength: todayTokens.filter(t => t.status === 'Booked').length,
      reachedToday,
      weighedToday,
      totalMandis: get().mandis.length,
    };
  },
}));

export default useStore;