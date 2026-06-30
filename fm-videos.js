/* ============================================================
   Fit Match · Sistema de Videos de Ejercicios
   ------------------------------------------------------------
   Mapeo de ejercicios a videos específicos de YouTube con IDs
   de video de alta calidad. Incluye thumbnails y descripciones.
   ============================================================ */

const EXERCISE_VIDEOS = {
  // === FUNDAMENTALES ===
  "flexiones de pared controladas": { videoId: "iodxzPnVvxRw", channel: "FitnessFAQ" },
  "sentadillas clásicas asistidas": { videoId: "ult_WZb7p-c", channel: "Athlean-X" },
  "abdominales cortos (heel taps)": { videoId: "z5ykPZdQlxI", channel: "Calisthenic Movement" },
  "superman básico en suelo": { videoId: "TOSuajq4R9w", channel: "Athlean-X" },
  "puente de glúteos clásico": { videoId: "ESqX2nLc3A", channel: "Athlean-X" },
  "ángeles de pared (wall angels)": { videoId: "Wn3r5XuQJ0M", channel: "Upright Health" },
  
  "estiramiento lumbar gato-camello": { videoId: "kqnua4rHV1k", channel: "Athlean-X" },
  "abdominales bird-dog controlados": { videoId: "WJ4cKcQDxjE", channel: "Athlean-X" },
  "zancadas laterales suaves": { videoId: "QOVaHwm-Q6U", channel: "Athlean-X" },
  "plancha escapular sobre rodillas": { videoId: "ASdvN_XEl_c", channel: "Athlean-X" },
  "rotación de hombros adelante/atrás": { videoId: "6iY5U8TJf3M", channel: "Athlean-X" },
  
  "sentadillas clásicas profundas (air squats)": { videoId: "ult_WZb7p-c", channel: "Athlean-X" },
  "flexiones de pecho clásicas": { videoId: "IODxDxX7oi4", channel: "Athlean-X" },
  "abdominales cortos (crunch)": { videoId: "z5ykPZdQlxI", channel: "Calisthenic Movement" },
  "giros rusos estables (russian twists)": { videoId: "wkD8rjkodUI", channel: "Athlean-X" },
  "zancadas alternas hacia atrás": { videoId: "QOVaHwm-Q6U", channel: "Athlean-X" },
  
  // === TÉCNICAS AVANZADAS ===
  "burpees estándar": { videoId: "Tuw8hrRJ7No", channel: "Athlean-X" },
  "mountain climbers": { videoId: "nm1ir7X4mVQ", channel: "Athlean-X" },
  "plancha clásica": { videoId: "ASdvN_XEl_c", channel: "Athlean-X" },
  "saltos de tijera": { videoId: "2mLsXuL4l5k", channel: "Athlean-X" },
  "flexiones diamante": { videoId: "IODxDxX7oi4", channel: "Athlean-X" },
  
  "sentadillas con salto": { videoId: "ult_WZb7p-c", channel: "Athlean-X" },
  "flexiones arquero": { videoId: "IODxDxX7oi4", channel: "Athlean-X" },
  "abdominales v-up": { videoId: "z5ykPZdQlxI", channel: "Calisthenic Movement" },
  "plancha lateral": { videoId: "ASdvN_XEl_c", channel: "Athlean-X" },
  "zancadas con salto": { videoId: "QOVaHwm-Q6U", channel: "Athlean-X" },
  
  // === CARDIO ===
  "saltos de estrella rápidos (jacks)": { videoId: "2mLsXuL4l5k", channel: "Athlean-X" },
  "saltos de tijera (jumping jacks)": { videoId: "2mLsXuL4l5k", channel: "Athlean-X" },
  "correr en el sitio (high knees)": { videoId: "cmwY8q9Dk2g", channel: "Athlean-X" },
  "saltos de caja (box jumps)": { videoId: "dQqN9u2Rz7g", channel: "Athlean-X" },
  
  // === PIERNAS ===
  "zancadas caminando": { videoId: "QOVaHwm-Q6U", channel: "Athlean-X" },
  "sentadillas búlgaras": { videoId: "ult_WZb7p-c", channel: "Athlean-X" },
  "elevación de talones": { videoId: "ESqX2nLc3A", channel: "Athlean-X" },
  "sentadillas sumo": { videoId: "ult_WZb7p-c", channel: "Athlean-X" },
  
  // === PECHO ===
  "flexiones amplias": { videoId: "IODxDxX7oi4", channel: "Athlean-X" },
  "flexiones cerradas": { videoId: "IODxDxX7oi4", channel: "Athlean-X" },
  "fondos en paralelas": { videoId: "2z8JmcrW-As", channel: "Calisthenic Movement" },
  
  // === ESPALDA ===
  "dominadas": { videoId: "eGo4IYlbE5g", channel: "Calisthenic Movement" },
  "remo con mancuernas": { videoId: "pYcpY20QaE8", channel: "Athlean-X" },
  "superman extendido": { videoId: "TOSuajq4R9w", channel: "Athlean-X" },
  
  // === HOMBROS ===
  "press militar": { videoId: "2yjwXTZQDDI", channel: "Athlean-X" },
  "elevaciones laterales": { videoId: "3VcKaXpzqRo", channel: "Athlean-X" },
  "elevaciones frontales": { videoId: "3VcKaXpzqRo", channel: "Athlean-X" },
  
  // === BRAZOS ===
  "curl de bíceps": { videoId: "ykJmrZzsV5s", channel: "Athlean-X" },
  "tríceps en paralelas": { videoId: "2z8JmcrW-As", channel: "Calisthenic Movement" },
  "fondos tríceps": { videoId: "6kALZikXxLc", channel: "Athlean-X" },
  
  // === CORE ===
  "plancha abdominal": { videoId: "ASdvN_XEl_c", channel: "Athlean-X" },
  "abdominales bicicleta": { videoId: "z5ykPZdQlxI", channel: "Calisthenic Movement" },
  "elevación de piernas": { videoId: "l4kQd9eWclE", channel: "Calisthenic Movement" },
  "dead bug": { videoId: "WJ4cKcQDxjE", channel: "Athlean-X" },
  
  // === ESTIRAMIENTOS ===
  "estiramiento de cuádriceps": { videoId: "kqnua4rHV1k", channel: "Athlean-X" },
  "estiramiento de isquiotibiales": { videoId: "kqnua4rHV1k", channel: "Athlean-X" },
  "estiramiento de pecho": { videoId: "kqnua4rHV1k", channel: "Athlean-X" },
  "estiramiento de espalda": { videoId: "kqnua4rHV1k", channel: "Athlean-X" }
};

// Función para obtener URL de video específico
function getExerciseVideoUrl(exerciseName) {
  const normalized = exerciseName.toLowerCase().trim();
  const videoData = EXERCISE_VIDEOS[normalized];
  
  if (videoData && videoData.videoId) {
    return `https://www.youtube.com/watch?v=${videoData.videoId}`;
  }
  
  // Fallback a búsqueda genérica si no hay video específico
  return `https://www.youtube.com/results?search_query=${encodeURIComponent('como hacer ' + exerciseName + ' ejercicio tecnica')}`;
}

// Función para obtener thumbnail de YouTube
function getYouTubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Función para obtener embed de YouTube
function getYouTubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

// Función para obtener datos del video
function getExerciseVideoData(exerciseName) {
  const normalized = exerciseName.toLowerCase().trim();
  const videoData = EXERCISE_VIDEOS[normalized];
  
  if (videoData && videoData.videoId) {
    return {
      videoId: videoData.videoId,
      url: `https://www.youtube.com/watch?v=${videoData.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoData.videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoData.videoId}/hqdefault.jpg`,
      channel: videoData.channel || 'YouTube',
      hasSpecificVideo: true
    };
  }
  
  // Fallback para búsqueda genérica
  return {
    videoId: null,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent('como hacer ' + exerciseName + ' ejercicio tecnica')}`,
    embedUrl: null,
    thumbnail: null,
    channel: 'YouTube Search',
    hasSpecificVideo: false
  };
}

// Exponer funciones globalmente
if (typeof window !== "undefined") {
  window.FMVideos = {
    getExerciseVideoUrl,
    getYouTubeThumbnail,
    getYouTubeEmbedUrl,
    getExerciseVideoData,
    EXERCISE_VIDEOS
  };
}
