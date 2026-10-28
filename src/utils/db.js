import { INITIAL_PORTFOLIO_ITEMS, INITIAL_PROFILE } from '../data/defaultPortfolio.js';
import { supabase, isSupabaseConfigured, STORAGE_BUCKET } from './supabaseClient.js';

const DB_NAME = 'AdarshPortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio_items';
const PROFILE_KEY = 'adarsh_portfolio_profile';
const CUSTOM_ITEMS_KEY = 'custom_portfolio_items';
const DELETED_ITEMS_KEY = 'deleted_portfolio_items';
const PASSWORD_STORAGE_KEY = 'adarsh_studio_password';

export const DEFAULT_ADMIN_PASSWORD = 'AdarshStudio#2026!';

export const LEGACY_PLACEHOLDER_IDS = new Set([
  'vid-1', 'vid-2', 'vid-3', 'vid-4',
  'pos-1', 'pos-2', 'pos-3', 'pos-4', 'pos-5'
]);

export function isPlaceholderItem(item) {
  if (!item) return false;
  const id = typeof item === 'string' ? item : item.id;
  if (!id) return false;
  return LEGACY_PLACEHOLDER_IDS.has(id) || /^(vid|pos)-\d+$/i.test(id);
}

// In-memory fallback for environments without browser storage (e.g. Node.js unit tests / SSR)
const memoryStore = {
  customItems: [],
  deletedIds: new Set(),
  profile: null,
  password: null,
};

function logStorageNotice(msg, detail) {
  if (typeof window !== 'undefined' && window.__DEBUG_STORAGE__) {
    console.debug(`[Portfolio Storage] ${msg}`, detail);
  }
}

// ============================================================================
// INDEXEDDB LOCAL STORAGE HELPERS
// ============================================================================

function openDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        logStorageNotice('IndexedDB failed to open, using fallback', request.error);
        resolve(null);
      };
    } catch (e) {
      logStorageNotice('IndexedDB initialization notice', e);
      resolve(null);
    }
  });
}

// Read local custom items from IndexedDB / localStorage / memoryStore
export async function getLocalPortfolioItems() {
  try {
    let deletedIds = [];
    if (typeof localStorage !== 'undefined') {
      try {
        const storedDeleted = localStorage.getItem(DELETED_ITEMS_KEY);
        if (storedDeleted) deletedIds = JSON.parse(storedDeleted);
      } catch {
        deletedIds = [];
      }
    } else {
      deletedIds = Array.from(memoryStore.deletedIds);
    }

    let customItems = [];
    const db = await openDB();
    if (db) {
      try {
        customItems = await new Promise((resolve) => {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => resolve([]);
        });
      } catch {
        customItems = [];
      }
    }

    // If IndexedDB returned no custom items, check localStorage or memory fallback
    if (!customItems || customItems.length === 0) {
      if (typeof localStorage !== 'undefined') {
        try {
          const stored = localStorage.getItem(CUSTOM_ITEMS_KEY);
          if (stored) {
            customItems = JSON.parse(stored);
          }
        } catch (e) {
          logStorageNotice('Could not read custom items from localStorage', e);
        }
      } else {
        customItems = memoryStore.customItems;
      }
    }

    const all = [...(customItems || []), ...INITIAL_PORTFOLIO_ITEMS];
    const deletedSet = new Set(Array.isArray(deletedIds) ? deletedIds : []);
    return all.filter((item) => item && !deletedSet.has(item.id) && !isPlaceholderItem(item));
  } catch (err) {
    logStorageNotice('Error reading local portfolio items', err);
    return [];
  }
}

// Save an item locally
export async function addLocalPortfolioItem(item) {
  try {
    // Unmark from deleted IDs if previously deleted
    if (typeof localStorage !== 'undefined') {
      try {
        const storedDeleted = localStorage.getItem(DELETED_ITEMS_KEY);
        if (storedDeleted) {
          const deletedIds = JSON.parse(storedDeleted).filter((dId) => dId !== item.id);
          localStorage.setItem(DELETED_ITEMS_KEY, JSON.stringify(deletedIds));
        }
      } catch {}

      try {
        const stored = localStorage.getItem(CUSTOM_ITEMS_KEY);
        const customItems = stored ? JSON.parse(stored) : [];
        const filtered = customItems.filter((i) => i.id !== item.id);
        filtered.unshift(item);
        localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(filtered));
      } catch (e) {
        logStorageNotice('LocalStorage save notice', e);
      }
    } else {
      memoryStore.deletedIds.delete(item.id);
      memoryStore.customItems = memoryStore.customItems.filter((i) => i.id !== item.id);
      memoryStore.customItems.unshift(item);
    }

    const db = await openDB();
    if (db) {
      await new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const request = store.put(item);
          request.onsuccess = () => resolve(item);
          request.onerror = (e) => reject(e);
        } catch (e) {
          reject(e);
        }
      });
    }

    return item;
  } catch (err) {
    logStorageNotice('Error saving local portfolio item', err);
    return item;
  }
}

// Delete an item locally
export async function deleteLocalPortfolioItem(id) {
  try {
    if (typeof localStorage !== 'undefined') {
      try {
        const storedDeleted = localStorage.getItem(DELETED_ITEMS_KEY);
        const deletedIds = storedDeleted ? JSON.parse(storedDeleted) : [];
        if (!deletedIds.includes(id)) {
          deletedIds.push(id);
          localStorage.setItem(DELETED_ITEMS_KEY, JSON.stringify(deletedIds));
        }
      } catch (e) {
        logStorageNotice('Could not record deleted item ID', e);
      }

      try {
        const stored = localStorage.getItem(CUSTOM_ITEMS_KEY);
        if (stored) {
          const customItems = JSON.parse(stored).filter((i) => i.id !== id);
          localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(customItems));
        }
      } catch {}
    } else {
      memoryStore.deletedIds.add(id);
      memoryStore.customItems = memoryStore.customItems.filter((i) => i.id !== id);
    }

    const db = await openDB();
    if (db) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const request = store.delete(id);
          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(true);
        } catch {
          resolve(true);
        }
      });
    }

    return true;
  } catch (err) {
    logStorageNotice('Error deleting local portfolio item', err);
    return false;
  }
}

// Update an item locally
export async function updateLocalPortfolioItem(id, updatedFields) {
  try {
    let updatedItem = null;

    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(CUSTOM_ITEMS_KEY);
        const customItems = stored ? JSON.parse(stored) : [];
        const index = customItems.findIndex((i) => i.id === id);
        if (index !== -1) {
          customItems[index] = { ...customItems[index], ...updatedFields, id };
          updatedItem = customItems[index];
        } else {
          updatedItem = { ...updatedFields, id, isCustom: true };
          customItems.unshift(updatedItem);
        }
        localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(customItems));
      } catch (e) {
        logStorageNotice('LocalStorage update notice', e);
      }
    } else {
      const index = memoryStore.customItems.findIndex((i) => i.id === id);
      if (index !== -1) {
        memoryStore.customItems[index] = { ...memoryStore.customItems[index], ...updatedFields, id };
        updatedItem = memoryStore.customItems[index];
      } else {
        updatedItem = { ...updatedFields, id, isCustom: true };
        memoryStore.customItems.unshift(updatedItem);
      }
    }

    const db = await openDB();
    if (db && updatedItem) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const request = store.put(updatedItem);
          request.onsuccess = () => resolve(updatedItem);
          request.onerror = () => resolve(updatedItem);
        } catch {
          resolve(updatedItem);
        }
      });
    }

    return updatedItem;
  } catch (err) {
    logStorageNotice('Error updating local portfolio item', err);
    return { ...updatedFields, id };
  }
}

// Cache cloud items to local storage
async function syncItemsToLocal(items) {
  if (!Array.isArray(items)) return;
  const customOnly = items.filter(
    (i) => !isPlaceholderItem(i) && (i.isCustom || i.id?.startsWith('custom-') || i.id?.startsWith('upload-'))
  );

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(customOnly));
    } catch (e) {
      logStorageNotice('Could not cache custom items to localStorage', e);
    }
  }

  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const item of customOnly) {
        store.put(item);
      }
    }
  } catch {
    // Ignore IndexedDB sync errors
  }
}

// ============================================================================
// DATA CONVERSION & MAPPING (CamelCase <-> SnakeCase)
// ============================================================================

export function rowToItem(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    category: row.category,
    subCategory: row.sub_category || row.subCategory || '',
    aspectRatio: row.aspect_ratio || row.aspectRatio || '16:9',
    duration: row.duration || undefined,
    dimensions: row.dimensions || undefined,
    dpi: row.dpi || undefined,
    resolution: row.resolution || undefined,
    software: Array.isArray(row.software) ? row.software : [],
    client: row.client || '',
    year: row.year || '2026',
    description: row.description || '',
    thumbnailUrl: row.thumbnail_url || row.thumbnailUrl || '',
    verticalThumbUrl: row.vertical_thumb_url || row.verticalThumbUrl || null,
    videoUrl: row.video_url || row.videoUrl || null,
    imageUrl: row.image_url || row.imageUrl || null,
    featured: Boolean(row.featured),
    accent: row.accent || 'gold',
    isCustom: Boolean(row.is_custom !== undefined ? row.is_custom : row.isCustom),
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

export function itemToRow(item) {
  if (!item) return null;
  const isCustom = item.isCustom !== undefined
    ? Boolean(item.isCustom)
    : (item.is_custom !== undefined
      ? Boolean(item.is_custom)
      : Boolean(item.id && (item.id.startsWith('custom-') || item.id.startsWith('upload-'))));

  const inferredType = item.type || (item.category && item.category.toLowerCase().includes('poster') ? 'poster' : 'video');

  return {
    id: item.id || `custom-${Date.now()}`,
    type: inferredType,
    title: item.title || 'Untitled Project',
    category: item.category || (inferredType === 'video' ? 'Video Editing' : 'Poster Designing'),
    sub_category: item.subCategory || item.sub_category || null,
    aspect_ratio: item.aspectRatio || item.aspect_ratio || (inferredType === 'video' ? '16:9' : '4:5'),
    duration: item.duration || null,
    dimensions: item.dimensions || null,
    dpi: item.dpi || null,
    resolution: item.resolution || null,
    software: Array.isArray(item.software) ? item.software : [],
    client: item.client || null,
    year: item.year || new Date().getFullYear().toString(),
    description: item.description || null,
    thumbnail_url: item.thumbnailUrl || item.thumbnail_url || null,
    vertical_thumb_url: item.verticalThumbUrl || item.vertical_thumb_url || null,
    video_url: item.videoUrl || item.video_url || null,
    image_url: item.imageUrl || item.image_url || null,
    featured: Boolean(item.featured),
    accent: item.accent || (inferredType === 'video' ? 'gold' : 'silver'),
    is_custom: isCustom,
    created_at: item.createdAt || item.created_at || new Date().toISOString(),
  };
}

export function rowToProfile(row, fallbackProfile = INITIAL_PROFILE) {
  if (!row) return fallbackProfile;
  return {
    ...fallbackProfile,
    name: row.name != null ? row.name : fallbackProfile.name,
    roles: Array.isArray(row.roles) ? row.roles : fallbackProfile.roles,
    tagline: row.tagline != null ? row.tagline : fallbackProfile.tagline,
    bio: row.bio != null ? row.bio : fallbackProfile.bio,
    avatarUrl: row.avatar_url || row.avatarUrl || fallbackProfile.avatarUrl,
    location: row.location != null ? row.location : fallbackProfile.location,
    experienceYears: row.experience_years != null ? row.experience_years : (row.experienceYears != null ? row.experienceYears : fallbackProfile.experienceYears),
    projectsCompleted: row.projects_completed != null ? row.projects_completed : (row.projectsCompleted != null ? row.projectsCompleted : fallbackProfile.projectsCompleted),
    clientsSatisfied: row.clients_satisfied != null ? row.clients_satisfied : (row.clientsSatisfied != null ? row.clientsSatisfied : fallbackProfile.clientsSatisfied),
    socials: row.socials ? { ...fallbackProfile.socials, ...row.socials } : fallbackProfile.socials,
    skills: Array.isArray(row.skills) ? row.skills : fallbackProfile.skills,
    adminPassword: row.admin_password || row.adminPassword || row.socials?.adminPassword || fallbackProfile.adminPassword || DEFAULT_ADMIN_PASSWORD,
  };
}

export function profileToRow(profile) {
  return {
    id: 'profile-main',
    name: profile.name || 'Adarsh A L',
    roles: profile.roles || ['Graphic Designer', 'Video Editor'],
    tagline: profile.tagline || 'Graphic Designer & Video Editor',
    bio: profile.bio || '',
    avatar_url: profile.avatarUrl || '/assets/neon-creator.png',
    location: profile.location || 'Open for Gigs & Freelance',
    experience_years: profile.experienceYears || 'Active',
    projects_completed: profile.projectsCompleted || '50+',
    clients_satisfied: profile.clientsSatisfied || '100%',
    socials: profile.socials || {},
    skills: profile.skills || [],
    admin_password: profile.adminPassword || profile.admin_password || DEFAULT_ADMIN_PASSWORD,
    updated_at: new Date().toISOString(),
  };
}

// ============================================================================
// CLOUD MEDIA STORAGE UPLOAD
// ============================================================================

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/x-m4v': 'm4v',
};

/**
 * Uploads a file (File, Blob, or base64 data URL) to Supabase Storage bucket.
 * Returns public CDN URL or null if upload fails (with graceful fallback).
 */
export async function uploadPortfolioMedia(fileOrDataUrl, folder = 'media') {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    let fileBody = null;
    let fileExt = 'png';
    let mimeType = 'image/png';

    if (typeof fileOrDataUrl === 'string') {
      // If already a remote CDN URL or local asset, return as is
      if (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://') || fileOrDataUrl.startsWith('/assets/')) {
        return fileOrDataUrl;
      }

      if (fileOrDataUrl.startsWith('data:')) {
        // Robust multiline base64 data URI parser with optional media parameters
        const base64Match = fileOrDataUrl.match(/^data:([^;,]+)(?:;[^,]*)?;base64,([\s\S]+)$/);
        if (base64Match) {
          mimeType = base64Match[1].trim().toLowerCase();
          const rawBase64 = base64Match[2].replace(/\s+/g, '');
          
          let bytes;
          if (typeof Buffer !== 'undefined') {
            bytes = Buffer.from(rawBase64, 'base64');
          } else {
            const binaryString = atob(rawBase64);
            bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
          }
          fileBody = new Blob([bytes], { type: mimeType });
          fileExt = MIME_TO_EXT[mimeType] || (mimeType.startsWith('video/') ? 'mp4' : 'png');
        } else if (fileOrDataUrl.startsWith('data:image/svg+xml')) {
          mimeType = 'image/svg+xml';
          fileExt = 'svg';
          const commaIdx = fileOrDataUrl.indexOf(',');
          if (commaIdx !== -1) {
            try {
              const rawSvg = decodeURIComponent(fileOrDataUrl.slice(commaIdx + 1));
              fileBody = new Blob([rawSvg], { type: mimeType });
            } catch {
              return fileOrDataUrl;
            }
          } else {
            return fileOrDataUrl;
          }
        } else {
          return fileOrDataUrl;
        }
      } else {
        return fileOrDataUrl;
      }
    } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
      fileBody = fileOrDataUrl;
      mimeType = (fileOrDataUrl.type || 'image/png').toLowerCase();
      const nameParts = fileOrDataUrl.name ? fileOrDataUrl.name.split('.') : [];
      if (nameParts.length > 1) {
        fileExt = nameParts.pop().toLowerCase();
      } else {
        fileExt = MIME_TO_EXT[mimeType] || (mimeType.startsWith('video/') ? 'mp4' : 'png');
      }
    }

    if (!fileBody) {
      return null;
    }

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const filePath = `${folder}/${uniqueId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileBody, {
        contentType: mimeType,
        cacheControl: '31536000',
        upsert: true,
      });

    if (uploadError) {
      logStorageNotice('Supabase storage media upload notice', uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return urlData?.publicUrl || null;
  } catch (err) {
    logStorageNotice('Supabase storage media upload notice', err.message);
    return null;
  }
}

// ============================================================================
// MAIN DATA LAYER API WITH SUPABASE SYNC & GRACEFUL FALLBACK
// ============================================================================

/**
 * Get all portfolio items.
 * Fetches from Supabase if configured and reachable; seamlessly falls back
 * to local items / INITIAL_PORTFOLIO_ITEMS on any network or database schema error.
 */
export async function getAllPortfolioItems() {
  let deletedIds = [];
  if (typeof localStorage !== 'undefined') {
    try {
      const storedDeleted = localStorage.getItem(DELETED_ITEMS_KEY);
      if (storedDeleted) deletedIds = JSON.parse(storedDeleted);
    } catch {
      deletedIds = [];
    }
  } else {
    deletedIds = Array.from(memoryStore.deletedIds);
  }
  const deletedSet = new Set(Array.isArray(deletedIds) ? deletedIds : []);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const cloudItems = data
          .map(rowToItem)
          .filter((item) => item && !deletedSet.has(item.id) && !isPlaceholderItem(item));
        syncItemsToLocal(cloudItems);
        return cloudItems;
      }

      if (error) {
        logStorageNotice('Supabase items query notice', error.message);
      }
    } catch (err) {
      logStorageNotice('Supabase fetch items notice', err.message);
    }
  }

  return getLocalPortfolioItems();
}

/**
 * Save a custom uploaded portfolio item.
 * Uploads media assets to Supabase Storage, saves item to Supabase table,
 * and maintains local caching.
 */
export async function addPortfolioItem(item) {
  let processedItem = { ...item };
  const inferredType = processedItem.type || (processedItem.category?.toLowerCase().includes('poster') ? 'poster' : 'video');
  processedItem.type = inferredType;

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Upload mediaFile if present
      if (processedItem.mediaFile) {
        const isVideoFile = processedItem.mediaFile.type ? processedItem.mediaFile.type.startsWith('video/') : false;
        const pathPrefix = isVideoFile ? 'videos' : (processedItem.type === 'video' ? 'thumbnails' : 'artworks');
        const uploadedUrl = await uploadPortfolioMedia(processedItem.mediaFile, pathPrefix);
        if (uploadedUrl) {
          if (isVideoFile) {
            processedItem.videoUrl = uploadedUrl;
          } else if (processedItem.type === 'video') {
            processedItem.thumbnailUrl = uploadedUrl;
            if (processedItem.aspectRatio === '9:16') {
              processedItem.verticalThumbUrl = uploadedUrl;
            }
          } else {
            processedItem.imageUrl = uploadedUrl;
            if (!processedItem.thumbnailUrl || processedItem.thumbnailUrl.startsWith('data:')) {
              processedItem.thumbnailUrl = uploadedUrl;
            }
          }
        }
      }

      // 2. Upload thumbnail data URL if present
      if (processedItem.thumbnailUrl && processedItem.thumbnailUrl.startsWith('data:')) {
        const thumbUrl = await uploadPortfolioMedia(processedItem.thumbnailUrl, 'thumbnails');
        if (thumbUrl) {
          processedItem.thumbnailUrl = thumbUrl;
        }
      }

      // 3. Upload vertical thumbnail data URL if present
      if (processedItem.verticalThumbUrl && processedItem.verticalThumbUrl.startsWith('data:')) {
        const vThumbUrl = await uploadPortfolioMedia(processedItem.verticalThumbUrl, 'vertical');
        if (vThumbUrl) {
          processedItem.verticalThumbUrl = vThumbUrl;
        }
      }

      // 4. Upload full image data URL if present
      if (processedItem.imageUrl && processedItem.imageUrl.startsWith('data:')) {
        const imgUrl = await uploadPortfolioMedia(processedItem.imageUrl, 'artworks');
        if (imgUrl) {
          processedItem.imageUrl = imgUrl;
        }
      }

      // 5. Persist to Supabase table
      const row = itemToRow(processedItem);
      const { error } = await supabase.from('portfolio_items').upsert(row);
      if (error) {
        logStorageNotice('Supabase insert item notice', error.message);
      }
    } catch (err) {
      logStorageNotice('Supabase sync item notice', err.message);
    }
  }

  // Ensure raw File object is not retained in local storage / serializable state
  delete processedItem.mediaFile;

  // Always persist locally
  await addLocalPortfolioItem(processedItem);
  return processedItem;
}

/**
 * Update an existing portfolio item.
 * Handles media uploads, updates Supabase table and syncs to local storage.
 */
export async function updatePortfolioItem(id, updatedFields) {
  const inferredType = updatedFields.type || (updatedFields.category?.toLowerCase().includes('poster') ? 'poster' : 'video');
  let processed = { ...updatedFields, id, type: inferredType };

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Upload mediaFile if a new file was provided
      if (processed.mediaFile) {
        const isVideoFile = processed.mediaFile.type ? processed.mediaFile.type.startsWith('video/') : false;
        const pathPrefix = isVideoFile ? 'videos' : (processed.type === 'video' ? 'thumbnails' : 'artworks');
        const uploadedUrl = await uploadPortfolioMedia(processed.mediaFile, pathPrefix);
        if (uploadedUrl) {
          if (isVideoFile) {
            processed.videoUrl = uploadedUrl;
          } else if (processed.type === 'video') {
            processed.thumbnailUrl = uploadedUrl;
            if (processed.aspectRatio === '9:16') {
              processed.verticalThumbUrl = uploadedUrl;
            }
          } else {
            processed.imageUrl = uploadedUrl;
            if (!processed.thumbnailUrl || processed.thumbnailUrl.startsWith('data:')) {
              processed.thumbnailUrl = uploadedUrl;
            }
          }
        }
      }

      // 2. Upload thumbnail data URL if changed
      if (processed.thumbnailUrl && processed.thumbnailUrl.startsWith('data:')) {
        const thumbUrl = await uploadPortfolioMedia(processed.thumbnailUrl, 'thumbnails');
        if (thumbUrl) {
          processed.thumbnailUrl = thumbUrl;
        }
      }

      // 3. Upload vertical thumbnail data URL if changed
      if (processed.verticalThumbUrl && processed.verticalThumbUrl.startsWith('data:')) {
        const vThumbUrl = await uploadPortfolioMedia(processed.verticalThumbUrl, 'vertical');
        if (vThumbUrl) {
          processed.verticalThumbUrl = vThumbUrl;
        }
      }

      // 4. Upload full image data URL if changed
      if (processed.imageUrl && processed.imageUrl.startsWith('data:')) {
        const imgUrl = await uploadPortfolioMedia(processed.imageUrl, 'artworks');
        if (imgUrl) {
          processed.imageUrl = imgUrl;
        }
      }

      // 5. Persist update to Supabase
      const row = itemToRow(processed);
      const { error } = await supabase.from('portfolio_items').update(row).eq('id', id);
      if (error) {
        logStorageNotice('Supabase update item notice', error.message);
      }
    } catch (err) {
      logStorageNotice('Supabase sync update notice', err.message);
    }
  }

  delete processed.mediaFile;
  const finalUpdated = await updateLocalPortfolioItem(id, processed);
  return finalUpdated || processed;
}

/**
 * Delete a portfolio item.
 * Deletes from Supabase and local storage.
 */
export async function deletePortfolioItem(id) {
  await deleteLocalPortfolioItem(id);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) {
        logStorageNotice('Supabase delete item notice', error.message);
      }
    } catch (err) {
      logStorageNotice('Supabase deletion error notice', err.message);
    }
  }

  return true;
}

/**
 * Synchronous local profile reader for immediate initial render without flicker.
 */
export function getLocalStoredProfile() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('neon_creator_profile');
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name && parsed.name !== 'Neon Creator') {
          return { ...INITIAL_PROFILE, ...parsed };
        }
      }
    } else if (memoryStore.profile) {
      return { ...INITIAL_PROFILE, ...memoryStore.profile };
    }
  } catch (e) {
    logStorageNotice('Could not read profile from localStorage', e);
  }
  return INITIAL_PROFILE;
}

/**
 * Load profile settings.
 * Supports both immediate synchronous fallback and asynchronous Supabase query.
 */
export async function getStoredProfile() {
  const local = getLocalStoredProfile();
  if (!isSupabaseConfigured || !supabase) {
    return local;
  }

  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      const cloudProfile = rowToProfile(data, local);
      saveLocalStoredProfile(cloudProfile);
      if (cloudProfile.adminPassword && typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(PASSWORD_STORAGE_KEY, cloudProfile.adminPassword);
        } catch {}
      }
      return cloudProfile;
    }

    if (error) {
      logStorageNotice('Supabase profile query notice', error.message);
    }
  } catch (err) {
    logStorageNotice('Supabase cloud profile fetch notice', err.message);
  }

  return local;
}

export function saveLocalStoredProfile(profile) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } else {
      memoryStore.profile = profile;
    }
  } catch (e) {
    logStorageNotice('Could not save profile to localStorage', e);
  }
}

/**
 * Save profile settings.
 * Uploads custom avatar to Supabase Storage if needed, updates Supabase profile table,
 * and saves to localStorage.
 */
export async function saveStoredProfile(profile) {
  let updatedProfile = { ...profile };

  if (isSupabaseConfigured && supabase) {
    try {
      // If avatar is newly uploaded base64 data URL, upload to storage bucket
      if (updatedProfile.avatarUrl && updatedProfile.avatarUrl.startsWith('data:')) {
        const uploadedAvatar = await uploadPortfolioMedia(updatedProfile.avatarUrl, 'avatars');
        if (uploadedAvatar) {
          updatedProfile.avatarUrl = uploadedAvatar;
        }
      }

      // Persist to Supabase profile table
      const row = profileToRow(updatedProfile);
      let { error } = await supabase.from('profile').upsert(row);
      if (error && (error.message?.includes('admin_password') || error.code === '42703' || error.message?.includes('does not exist'))) {
        const fallbackRow = { ...row };
        delete fallbackRow.admin_password;
        fallbackRow.socials = { ...(fallbackRow.socials || {}), adminPassword: updatedProfile.adminPassword || getAdminPassword() };
        const res = await supabase.from('profile').upsert(fallbackRow);
        error = res.error;
      }
      if (error) {
        logStorageNotice('Supabase update profile notice', error.message);
      }
    } catch (err) {
      logStorageNotice('Supabase cloud profile save notice', err.message);
    }
  }

  saveLocalStoredProfile(updatedProfile);
  return updatedProfile;
}

// Convert uploaded file to data URL
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// ADMIN AUTHENTICATION & PASSWORD MANAGEMENT
// ============================================================================

export function getAdminPassword() {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(PASSWORD_STORAGE_KEY);
      if (stored && stored.trim().length > 0) {
        return stored.trim();
      }
    } else if (memoryStore.password) {
      return memoryStore.password;
    }
    const profile = getLocalStoredProfile();
    if (profile && (profile.adminPassword || profile.admin_password || profile.socials?.adminPassword)) {
      return (profile.adminPassword || profile.admin_password || profile.socials?.adminPassword).trim();
    }
  } catch (e) {
    logStorageNotice('Could not read admin password', e);
  }
  return DEFAULT_ADMIN_PASSWORD;
}

export function verifyAdminPassword(inputPassword) {
  if (!inputPassword || typeof inputPassword !== 'string') return false;
  const currentPassword = getAdminPassword();
  return inputPassword.trim() === currentPassword;
}

export async function updateAdminPassword(newPassword) {
  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const cleanPass = newPassword.trim();

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(PASSWORD_STORAGE_KEY, cleanPass);
    } catch (e) {
      logStorageNotice('Could not save password to localStorage', e);
    }
  } else {
    memoryStore.password = cleanPass;
  }

  try {
    const profile = getLocalStoredProfile();
    const updatedProfile = {
      ...profile,
      adminPassword: cleanPass,
      admin_password: cleanPass,
      socials: { ...(profile.socials || {}), adminPassword: cleanPass },
    };
    saveLocalStoredProfile(updatedProfile);

    if (isSupabaseConfigured && supabase) {
      try {
        const row = profileToRow(updatedProfile);
        let { error } = await supabase.from('profile').upsert(row);
        if (error && (error.message?.includes('admin_password') || error.code === '42703' || error.message?.includes('does not exist'))) {
          const fallbackRow = { ...row };
          delete fallbackRow.admin_password;
          fallbackRow.socials = { ...(fallbackRow.socials || {}), adminPassword: cleanPass };
          await supabase.from('profile').upsert(fallbackRow);
        }
      } catch (err) {
        logStorageNotice('Supabase cloud password update notice', err.message);
      }
    }
  } catch (err) {
    logStorageNotice('Profile password update notice', err);
  }

  return true;
}

