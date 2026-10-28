import { INITIAL_PORTFOLIO_ITEMS, INITIAL_PROFILE } from '../data/defaultPortfolio';

const DB_NAME = 'NeonCreatorPortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio_items';
const PROFILE_KEY = 'neon_creator_profile';

// Open or initialize IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.warn('IndexedDB failed to open, using memory/localStorage fallback', request.error);
      resolve(null);
    };
  });
}

// Get all items (initial + custom user uploads)
export async function getAllPortfolioItems() {
  try {
    const db = await openDB();
    if (!db) {
      const stored = localStorage.getItem('custom_portfolio_items');
      const customItems = stored ? JSON.parse(stored) : [];
      return [...customItems, ...INITIAL_PORTFOLIO_ITEMS];
    }

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const customItems = request.result || [];
        // Custom items appear first so newest uploads are on top
        resolve([...customItems, ...INITIAL_PORTFOLIO_ITEMS]);
      };
      request.onerror = () => {
        resolve(INITIAL_PORTFOLIO_ITEMS);
      };
    });
  } catch (err) {
    console.error('Error reading portfolio items:', err);
    return INITIAL_PORTFOLIO_ITEMS;
  }
}

// Save a custom uploaded item
export async function addPortfolioItem(item) {
  try {
    const db = await openDB();
    if (!db) {
      const stored = localStorage.getItem('custom_portfolio_items');
      const customItems = stored ? JSON.parse(stored) : [];
      customItems.unshift(item);
      localStorage.setItem('custom_portfolio_items', JSON.stringify(customItems));
      return item;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(item);
      request.onsuccess = () => resolve(item);
      request.onerror = (e) => reject(e);
    });
  } catch (err) {
    console.error('Error saving portfolio item:', err);
    throw err;
  }
}

// Delete an item
export async function deletePortfolioItem(id) {
  try {
    const db = await openDB();
    if (!db) {
      const stored = localStorage.getItem('custom_portfolio_items');
      if (stored) {
        const customItems = JSON.parse(stored).filter((i) => i.id !== id);
        localStorage.setItem('custom_portfolio_items', JSON.stringify(customItems));
      }
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e);
    });
  } catch (err) {
    console.error('Error deleting portfolio item:', err);
    throw err;
  }
}

// Load profile settings
export function getStoredProfile() {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      return { ...INITIAL_PROFILE, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Could not read profile from localStorage:', e);
  }
  return INITIAL_PROFILE;
}

// Save profile settings
export function saveStoredProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Could not save profile to localStorage:', e);
  }
  return profile;
}

// Convert uploaded file to data URL or object URL
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
