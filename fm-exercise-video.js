/* ============================================================
 * fm-exercise-video.js - Video/preview de un ejercicio (YouTube+QR)
 * y modal de video. Extraido de jugar.html (refactor Fase 3).
 * Depende de FMVideos, QRCode (CDN) y el DOM.
 * Expone en window: videoUrl, renderExVideo, openVideoModal,
 * closeVideoModal.
 * ============================================================ */
(function () {
  'use strict';

// liga el ejercicio con su video de YouTube + QR (mejorado con fm-videos.js)
function videoUrl(name){
  if(window.FMVideos && window.FMVideos.getExerciseVideoUrl){
    return window.FMVideos.getExerciseVideoUrl(name);
  }
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent('como hacer ' + name + ' ejercicio tecnica');
}
function renderExVideo(name){
  const videoData = window.FMVideos ? window.FMVideos.getExerciseVideoData(name) : null;
  const url = videoData ? videoData.url : videoUrl(name);
  const box = document.getElementById('ex-video');
  
  let thumbnailHTML = '';
  if(videoData && videoData.thumbnail && videoData.hasSpecificVideo){
    thumbnailHTML = `<img src="${videoData.thumbnail}" alt="${name}" class="w-16 h-16 object-cover rounded-lg border-2 border-gray-900 cursor-pointer hover:opacity-80" onclick="openVideoModal('${name}')">`;
  } else {
    thumbnailHTML = `<div class="w-16 h-16 bg-gray-200 rounded-lg border-2 border-gray-900 flex items-center justify-center cursor-pointer hover:opacity-80" onclick="openVideoModal('${name}')">
      <i class="fa-brands fa-youtube text-2xl text-red-500"></i>
    </div>`;
  }
  
  box.innerHTML = `<div class="pop bg-white p-3 flex items-center gap-3" style="box-shadow:4px 4px 0 #111827">
    <a id="ex-qr" href="${url}" target="_blank" rel="noopener" class="shrink-0 bg-white p-1 rounded-md border-2 border-gray-900" title="Escanea para ver el video">
      ${thumbnailHTML}
    </a>
    <div class="text-left leading-tight">
      <p class="fun font-bold text-gray-900 text-[12px]">${name}</p>
      <button onclick="openVideoModal('${name}')" class="inline-flex items-center gap-1 text-[12px] font-bold mt-1" style="color:#ef4444; background:none; border:none; cursor:pointer; padding:0;">
        <i class="fa-brands fa-youtube"></i> Ver video
      </button>
      ${videoData && videoData.channel ? `<p class="text-gray-400 text-[10px] font-semibold mt-0.5">${videoData.channel}</p>` : ''}
      <p class="text-gray-400 text-[10px] font-semibold mt-0.5">o escanea el QR</p>
    </div>
  </div>`;
  box.classList.remove('hidden');
  const qr = document.getElementById('ex-qr'); 
  qr.innerHTML = thumbnailHTML;
  try{ new QRCode(qr,{text:url,width:64,height:64,correctLevel:QRCode.CorrectLevel.M}); }catch(e){}
}

// Modal de video mejorado
function openVideoModal(exerciseName){
  const videoData = window.FMVideos ? window.FMVideos.getExerciseVideoData(exerciseName) : null;
  if(!videoData) return;
  
  // Crear modal si no existe
  let modal = document.getElementById('video-modal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.className = 'fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center hidden z-[100000] p-4';
    modal.innerHTML = `
      <div class="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div class="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 class="text-white font-bold text-lg fun" id="video-modal-title">Ejercicio</h3>
          <button onclick="closeVideoModal()" class="text-gray-400 hover:text-white text-2xl">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="p-4">
          <div id="video-modal-content" class="aspect-video bg-black rounded-lg flex items-center justify-center">
            <!-- Video embed o placeholder -->
          </div>
          <div id="video-modal-info" class="mt-4 text-gray-300">
            <!-- Info del video -->
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Configurar contenido
  document.getElementById('video-modal-title').textContent = exerciseName;
  const content = document.getElementById('video-modal-content');
  const info = document.getElementById('video-modal-info');
  
  if(videoData.hasSpecificVideo && videoData.embedUrl){
    content.innerHTML = `<iframe 
      src="${videoData.embedUrl}?autoplay=1&rel=0" 
      class="w-full h-full rounded-lg"
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>`;
    info.innerHTML = `
      <p class="text-sm"><i class="fa-brands fa-youtube text-red-500 mr-2"></i>Video tutorial de ${videoData.channel}</p>
      <p class="text-xs text-gray-500 mt-1">Aprende la técnica correcta para evitar lesiones</p>
    `;
  } else {
    content.innerHTML = `
      <div class="text-center">
        <i class="fa-brands fa-youtube text-6xl text-red-500 mb-4"></i>
        <p class="text-white mb-4">Video no disponible directamente</p>
        <a href="${videoData.url}" target="_blank" rel="noopener" 
           class="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition">
          <i class="fa-brands fa-youtube"></i> Ver en YouTube
        </a>
      </div>
    `;
    info.innerHTML = `
      <p class="text-sm">Busca en YouTube: "${exerciseName} técnica correcta"</p>
      <p class="text-xs text-gray-500 mt-1">Selecciona un video de un canal confiable</p>
    `;
  }
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal(){
  const modal = document.getElementById('video-modal');
  if(modal){
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    // Limpiar el iframe para detener el video
    const content = document.getElementById('video-modal-content');
    if(content) content.innerHTML = '';
  }
}

  window.videoUrl = videoUrl;
  window.renderExVideo = renderExVideo;
  window.openVideoModal = openVideoModal;
  window.closeVideoModal = closeVideoModal;
})();
