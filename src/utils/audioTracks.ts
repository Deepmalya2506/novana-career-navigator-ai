
export interface Track {
  id: string;
  name: string;
  url: string;
  fallbackUrls?: string[];
  type: 'lofi' | 'ambient' | 'piano' | 'nature';
}

// Using more reliable audio sources with fallbacks
export const tracks: Track[] = [
  {
    id: '1',
    name: 'Lunar Lo-fi',
    url: 'https://www.soundjay.com/misc/sounds/beep-07a.mp3',
    fallbackUrls: [
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      'https://sample-music.netlify.app/lofi-1.mp3'
    ],
    type: 'lofi'
  },
  {
    id: '2',
    name: 'Midnight Motivation',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    fallbackUrls: [
      'https://www.soundjay.com/misc/sounds/beep-07a.mp3',
      'https://sample-music.netlify.app/ambient-1.mp3'
    ],
    type: 'ambient'
  },
  {
    id: '3',
    name: 'Focus Flow',
    url: 'https://sample-music.netlify.app/piano-1.mp3',
    fallbackUrls: [
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      'https://www.soundjay.com/misc/sounds/beep-07a.mp3'
    ],
    type: 'piano'
  },
  {
    id: '4',
    name: 'Rainfall Calm',
    url: 'https://sample-music.netlify.app/nature-1.mp3',
    fallbackUrls: [
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
      'https://www.soundjay.com/misc/sounds/beep-07a.mp3'
    ],
    type: 'nature'
  }
];

export const loadAudioWithFallback = async (track: Track): Promise<string> => {
  const urlsToTry = [track.url, ...(track.fallbackUrls || [])];
  
  for (const url of urlsToTry) {
    try {
      // Test if the URL is accessible
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return url;
      }
    } catch (error) {
      console.log(`Failed to load ${url}, trying next fallback...`);
      continue;
    }
  }
  
  throw new Error(`All audio sources failed for track: ${track.name}`);
};

export const preloadAudio = (url: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    
    const onLoadedMetadata = () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
      resolve(audio);
    };
    
    const onError = () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
      reject(new Error(`Failed to preload audio: ${url}`));
    };
    
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('error', onError);
    audio.src = url;
  });
};
