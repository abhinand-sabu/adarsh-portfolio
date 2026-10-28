/**
 * Media and Mobile utilities for Video & Graphic Designer Portfolio
 */

/**
 * Robust clipboard copy that works in both Secure (HTTPS/localhost)
 * and Insecure contexts (HTTP over LAN on mobile/tablet).
 */
export async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  // Fallback for HTTP LAN access on mobile devices
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Resize and compress an image file to a safe dimension and quality.
 * Prevents LocalStorage QuotaExceededError (5MB limit) when saving avatars.
 */
export function resizeImageFile(file, maxWidth = 512, maxHeight = 512, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Capture the first non-black frame of a video file onto a canvas
 * to generate an authentic image thumbnail for Video cards.
 */
export function captureVideoThumbnail(videoFile, seekTime = 0.5) {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const objectUrl = URL.createObjectURL(videoFile);
      video.src = objectUrl;

      let hasResolved = false;

      const finish = (dataUrl) => {
        if (!hasResolved) {
          hasResolved = true;
          URL.revokeObjectURL(objectUrl);
          resolve(dataUrl);
        }
      };

      // Set timeout in case video codec cannot be decoded in browser
      const timeout = setTimeout(() => {
        finish(null);
      }, 4000);

      video.onloadeddata = () => {
        video.currentTime = seekTime;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          clearTimeout(timeout);
          finish(canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          clearTimeout(timeout);
          finish(null);
        }
      };

      video.onerror = () => {
        clearTimeout(timeout);
        finish(null);
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Convert SVG data URI or image to an authentic, downloadable PNG.
 * Solves the corrupt PNG bug where SVGs were saved with .png extension.
 */
export function exportArtworkAsPng(dataUriOrUrl, fileName = 'artwork.png') {
  return new Promise((resolve, reject) => {
    if (!dataUriOrUrl) {
      reject(new Error('No image URL provided'));
      return;
    }

    // If it's already a PNG data URI or standard bitmap, trigger direct download
    if (dataUriOrUrl.startsWith('data:image/png') || dataUriOrUrl.startsWith('data:image/jpeg')) {
      const link = document.createElement('a');
      link.href = dataUriOrUrl;
      link.download = fileName.endsWith('.png') || fileName.endsWith('.jpg') ? fileName : `${fileName}.png`;
      link.click();
      resolve(true);
      return;
    }

    // If it is SVG, render to canvas at high resolution (1600x2200)
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 2200;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#050814';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
        link.click();
        resolve(true);
      } catch (err) {
        console.error('Canvas export failed, falling back to direct download:', err);
        const link = document.createElement('a');
        link.href = dataUriOrUrl;
        link.download = fileName.endsWith('.svg') ? fileName : `${fileName.replace(/\.png$/, '')}.svg`;
        link.click();
        resolve(true);
      }
    };

    img.onerror = () => {
      // Direct download fallback
      const link = document.createElement('a');
      link.href = dataUriOrUrl;
      link.download = fileName;
      link.click();
      resolve(true);
    };

    img.src = dataUriOrUrl;
  });
}

/**
 * Calculate dynamic video timecode from duration string (e.g. "01:45") and progress percentage (0-100).
 */
export function formatTimecode(durationStr = '01:30', progress = 0) {
  const parts = durationStr.split(':').map((p) => parseInt(p, 10));
  let totalSeconds = 90;
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    totalSeconds = parts[0] * 60 + parts[1];
  } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  const currentSeconds = (totalSeconds * (progress / 100));
  const hrs = Math.floor(currentSeconds / 3600);
  const mins = Math.floor((currentSeconds % 3600) / 60);
  const secs = Math.floor(currentSeconds % 60);
  const frames = Math.floor((currentSeconds % 1) * 30);

  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}
