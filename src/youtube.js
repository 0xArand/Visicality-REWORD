// YouTube Player Module
// Handles YouTube URL parsing and audio extraction

export class YouTubePlayer {
  constructor(audioElement) {
    this.audioElement = audioElement;
    this.corsProxies = [
      'https://cors.eu.org/',
      'https://api.allorigins.win/raw?url=',
    ];
    this.currentProxyIndex = 0;
  }

  /**
   * Extract video ID from YouTube URL or return if already an ID
   */
  extractVideoId(input) {
    if (!input) return null;

    input = input.trim();

    // Check if it's already a video ID (11 characters, alphanumeric with - and _)
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
      return input;
    }

    // Try to extract from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Get the direct audio stream URL from YouTube
   */
  getAudioStreamUrl(videoId) {
    // Use invidious instance or nitter-like service for audio extraction
    // Fallback: use YouTube iframe and try to extract audio via MediaStream or similar
    
    // Option 1: Use a free proxy service (may be unreliable)
    // Return the URL for the proxy to fetch
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  /**
   * Try to load YouTube video audio into the audio element
   */
  async loadYouTubeVideo(urlOrId) {
    try {
      const videoId = this.extractVideoId(urlOrId);
      
      if (!videoId) {
        console.error('[v0] Invalid YouTube URL or ID');
        return false;
      }

      console.log('[v0] Loading YouTube video:', videoId);

      // Try using an audio-focused YouTube proxy service
      // Services like: invidious, piped, or youtube-nocookie variations
      const audioUrls = [
        // Try invidious instances
        `https://invidious.projectsegfau.lt/api/v1/videos/${videoId}?fields=formatStreams`,
        // Fallback to direct approach with cors proxy
        this.tryDirectYouTubeExtraction(videoId),
      ];

      // Try to fetch from the API
      for (const url of audioUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            console.log('[v0] Got video data:', data);
            
            if (data.formatStreams && data.formatStreams.length > 0) {
              // Find audio-only or best audio stream
              const audioStream = data.formatStreams.find(
                (s) => s.type && s.type.includes('audio')
              );
              
              if (audioStream && audioStream.url) {
                console.log('[v0] Found audio stream');
                this.audioElement.src = audioStream.url;
                this.audioElement.crossOrigin = 'anonymous';
                return true;
              }
            }
          }
        } catch (err) {
          console.log('[v0] Attempt failed:', err.message);
          continue;
        }
      }

      // Fallback: Try to use the video directly with a CORS proxy
      return this.tryWithCorsProxy(videoId);
    } catch (err) {
      console.error('[v0] YouTube loading error:', err);
      return false;
    }
  }

  /**
   * Try direct YouTube extraction with CORS proxy
   */
  tryDirectYouTubeExtraction(videoId) {
    // This is a placeholder - direct YouTube extraction is complex due to CORS
    // In practice, you'd need a backend service or use a third-party API
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  /**
   * Try using a CORS proxy service
   */
  async tryWithCorsProxy(videoId) {
    // Note: This method may not work due to YouTube's restrictions
    // A proper solution would require a backend service
    console.log('[v0] CORS proxy method requires backend support');
    
    // For now, return false as client-side YouTube audio extraction is blocked
    return false;
  }

  /**
   * Alternative: Use YouTube Shorts or simple embedding approach
   * This would require user interaction and won't work in visualizer directly
   */
  setupYouTubeIframe(videoId) {
    // This creates an invisible iframe that can be used to extract audio
    // However, due to CORS and YouTube's restrictions, this is limited
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.style.display = 'none';
    iframe.allow = 'cross-origin-isolated';
    
    // Note: Audio extraction from YouTube iframe is restricted
    // This would require a more sophisticated approach with a backend service
    return iframe;
  }
}

/**
 * Alternative approach using a free YouTube audio extraction API
 * Services like: yt-dlp service, YouTube Music API proxy, etc.
 */
export async function getYouTubeAudioUrl(videoId) {
  // This would connect to a backend service that uses yt-dlp or similar
  // Example endpoints (these need to be created):
  // GET /api/youtube/audio?v={videoId}
  
  try {
    // This is a placeholder for a backend endpoint you'd need to create
    const response = await fetch(`/api/youtube/audio?v=${videoId}`);
    if (response.ok) {
      const data = await response.json();
      return data.audioUrl;
    }
  } catch (err) {
    console.error('[v0] Could not get audio URL:', err);
  }
  
  return null;
}
