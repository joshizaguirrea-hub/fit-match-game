/* ============================================================
   Fit Match · Sistema de Videos de Ejercicios
   ------------------------------------------------------------
   POR AHORA: todos los ejercicios usan BUSQUEDA de YouTube
   (siempre funciona y muestra resultados reales y actuales).

   A FUTURO: cuando tengas videos REALES y VERIFICADOS (propios
   del equipo o IDs que abriste tu mismo en YouTube), agregalos
   en EXERCISE_VIDEOS con este formato EXACTO:

     "nombre del ejercicio en minusculas": {
        videoId: "XXXXXXXXXXX",   // 11 caracteres EXACTOS del link de YouTube
        channel: "Nombre del canal"
     }

   Como sacar el videoId: en el link
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   el videoId es lo que va despues de "v=" -> dQw4w9WgXcQ

   Mientras este vacio, todo cae limpio a la busqueda de YouTube.
   ============================================================ */

const EXERCISE_VIDEOS = {
  // (vacio a proposito: agrega aqui solo videos REALES verificados)
};

// Construye la URL de busqueda de YouTube para un ejercicio (siempre funciona)
function buildSearchUrl(exerciseName) {
  return 'https://www.youtube.com/results?search_query=' +
    encodeURIComponent('como hacer ' + exerciseName + ' ejercicio tecnica');
}

// URL del video (especifico si existe y es valido; si no, busqueda)
function getExerciseVideoUrl(exerciseName) {
  const data = getExerciseVideoData(exerciseName);
  return data.url;
}

// Thumbnail de YouTube a partir de un videoId
function getYouTubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// URL para incrustar (embed) un video de YouTube
function getYouTubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

// Datos del video de un ejercicio.
// Solo se considera "video especifico" si el videoId tiene EXACTAMENTE
// 11 caracteres (formato valido de YouTube). Si no, usa busqueda.
function getExerciseVideoData(exerciseName) {
  const normalized = (exerciseName || '').toLowerCase().trim();
  const videoData = EXERCISE_VIDEOS[normalized];
  const idValido = videoData && typeof videoData.videoId === 'string' && videoData.videoId.length === 11;

  if (idValido) {
    return {
      videoId: videoData.videoId,
      url: `https://www.youtube.com/watch?v=${videoData.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoData.videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoData.videoId}/hqdefault.jpg`,
      channel: videoData.channel || 'YouTube',
      hasSpecificVideo: true
    };
  }

  // Fallback: busqueda de YouTube (siempre funciona)
  return {
    videoId: null,
    url: buildSearchUrl(exerciseName),
    embedUrl: null,
    thumbnail: null,
    channel: 'YouTube',
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
