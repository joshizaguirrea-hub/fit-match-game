/* ============================================================
   Fit Match · Sistema de Perfil de Usuario
   ------------------------------------------------------------
   Sistema de perfil con estadísticas, logros, fotos de avance,
   mejor FIT-BRO y personalización del sitio.
   ============================================================ */

// Variables globales del perfil
// NOTA: el cliente de Supabase se obtiene DENTRO de cada funcion con
// window.FMAuth.getClient() (window.supabase es solo la libreria, no el cliente).
let userProfile = {
  stats: {
    totalHours: 0,
    totalDays: 0,
    routinesCompleted: 0,
    totalPoints: 0,
    currentStreak: 0,
    bestStreak: 0
  },
  photos: [],
  bestFitBro: null,
  customization: {
    theme: 'default',
    primaryColor: '#ec4899',
    accentColor: '#8b5cf6'
  }
};

// Función para calcular estadísticas del usuario
function calculateUserStats(workouts) {
  if (!workouts || !Array.isArray(workouts)) {
    return {
      totalHours: 0,
      totalDays: 0,
      routinesCompleted: 0,
      totalPoints: 0,
      currentStreak: 0,
      bestStreak: 0
    };
  }

  const totalPoints = workouts.reduce((sum, w) => sum + (w.puntos || 0), 0);
  const routinesCompleted = workouts.length;
  
  // Calcular horas totales (asumiendo duración promedio de 30 min por workout si no tiene duración)
  let totalMinutes = 0;
  workouts.forEach(w => {
    if (w.duration_seconds) {
      totalMinutes += w.duration_seconds / 60;
    } else {
      totalMinutes += 30; // Promedio estimado
    }
  });
  const totalHours = Math.round(totalMinutes / 60);

  // Calcular días únicos de entrenamiento
  const uniqueDays = new Set();
  workouts.forEach(w => {
    if (w.created_at) {
      const date = new Date(w.created_at).toDateString();
      uniqueDays.add(date);
    }
  });
  const totalDays = uniqueDays.size;

  // Calcular streaks
  const currentStreak = window.calculateCurrentStreak ? window.calculateCurrentStreak(workouts) : 0;
  const bestStreak = window.calculateBestStreak ? window.calculateBestStreak(workouts) : 0;

  return {
    totalHours,
    totalDays,
    routinesCompleted,
    totalPoints,
    currentStreak,
    bestStreak
  };
}

// Función para encontrar el mejor FIT-BRO
function findBestFitBro(currentUser, allUsers, workouts) {
  if (!allUsers || !Array.isArray(allUsers) || allUsers.length === 0) {
    return null;
  }

  // Obtener especialidad principal del usuario actual
  const userSpecialty = window.getMainSpecialty ? window.getMainSpecialty(workouts) : null;
  
  let bestMatch = null;
  let bestScore = 0;

  allUsers.forEach(user => {
    if (user.id === currentUser.id) return; // No comparar consigo mismo

    let score = 0;

    // Factor 1: Similaridad de nivel (rango militar cercano)
    const userRank = window.getMilitaryRank ? window.getMilitaryRank(currentUser.total_points || 0) : 'Recluta';
    const otherRank = window.getMilitaryRank ? window.getMilitaryRank(user.total_points || 0) : 'Recluta';
    const rankDifference = Math.abs(
      (currentUser.total_points || 0) - (user.total_points || 0)
    );
    score += Math.max(0, 100 - rankDifference / 10);

    // Factor 2: Similaridad de especialidad
    if (userSpecialty && userSpecialty.specialty) {
      // Si el otro usuario tiene rutinas en la misma especialidad, bonus
      // Esto requeriría datos de workouts del otro usuario
      score += 30;
    }

    // Factor 3: Disponibilidad (si está online recientemente)
    if (user.last_seen) {
      const lastSeen = new Date(user.last_seen);
      const hoursSinceSeen = (Date.now() - lastSeen) / (1000 * 60 * 60);
      if (hoursSinceSeen < 24) score += 20;
      else if (hoursSinceSeen < 72) score += 10;
    }

    // Factor 4: Consistencia (streak del otro usuario)
    if (user.best_streak) {
      score += Math.min(user.best_streak, 20);
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = {
        ...user,
        matchScore: Math.round(score),
        matchReason: getMatchReason(score, userRank, otherRank)
      };
    }
  });

  return bestMatch;
}

function getMatchReason(score, userRank, otherRank) {
  if (score > 80) return "¡Compatibilidad excelente! Niveles y horarios similares";
  if (score > 60) return "¡Buen match! Niveles de entrenamiento compatibles";
  if (score > 40) return "Match moderado - podrían entrenar juntos ocasionalmente";
  return "Match básico - diferentes niveles pero pueden complementarse";
}

// Función para abrir el modal de perfil
// userId opcional: si se pasa, muestra el perfil de ESE usuario (un amigo). Si no, el tuyo.
function openProfileModal(userId) {
  const modal = document.getElementById('profile-modal');
  if (!modal) {
    createProfileModal();
  }
  
  loadProfileData(userId);
  document.getElementById('profile-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  applySavedCustomization();
}

// Función para cerrar el modal de perfil
function closeProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Función para crear el modal de perfil en el DOM
function createProfileModal() {
  const modalHTML = `
    <div id="profile-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center hidden z-[200] p-4">
      <div class="rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style="background:#181c2a;border:1px solid #2c3350;color:#eceefb">
        <!-- Header del Perfil -->
        <div id="profile-header" class="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                <i class="fa-solid fa-user"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold fun" id="profile-nickname">Usuario</h2>
                <p class="text-white/80" id="profile-rank">Recluta</p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="bg-white/20 px-3 py-1 rounded-full text-sm">
                    <i class="fa-solid fa-fire mr-1"></i>
                    <span id="profile-streak">0</span> días racha
                  </span>
                </div>
              </div>
            </div>
            <button onclick="closeProfileModal()" class="text-white/80 hover:text-white text-2xl">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Contenido del Perfil -->
        <div class="p-6">
          <!-- Tabs de Navegación -->
          <div class="flex gap-2 mb-6 border-b overflow-x-auto" style="border-color:#2c3350">
            <button onclick="switchProfileTab('stats')" class="profile-tab active px-4 py-2 font-bold text-sm border-b-2 border-purple-600 text-purple-600" data-tab="stats">
              <i class="fa-solid fa-chart-line mr-2"></i>Estadísticas
            </button>
            <button onclick="switchProfileTab('nutrition')" class="profile-tab px-4 py-2 font-bold text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="nutrition">
              <i class="fa-solid fa-apple-whole mr-2"></i>Nutrición
            </button>
            <button onclick="switchProfileTab('mailbox')" class="profile-tab px-4 py-2 font-bold text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 relative" data-tab="mailbox">
              <i class="fa-solid fa-bell mr-2"></i>Buzón
              <span id="mailbox-badge" class="hidden absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">0</span>
            </button>
            <button onclick="switchProfileTab('achievements')" class="profile-tab px-4 py-2 font-bold text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="achievements">
              <i class="fa-solid fa-trophy mr-2"></i>Logros
            </button>
            <button onclick="switchProfileTab('photos')" class="profile-tab px-4 py-2 font-bold text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="photos">
              <i class="fa-solid fa-camera mr-2"></i>Fotos
            </button>
            <button onclick="switchProfileTab('fitbro')" class="profile-tab px-4 py-2 font-bold text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="fitbro">
              <i class="fa-solid fa-user-group mr-2"></i>Mejor FIT-BRO
            </button>
            <button onclick="switchProfileTab('customization')" class="profile-tab px-4 py-2 font-bold text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="customization">
              <i class="fa-solid fa-palette mr-2"></i>Personalizar
            </button>
          </div>

          <!-- Tab: Estadísticas -->
          <div id="tab-stats" class="profile-tab-content">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="p-4 rounded-2xl text-center" style="background:#222842;border:1px solid #2c3350">
                <i class="fa-solid fa-clock text-2xl mb-2" style="color:#a78bfa"></i>
                <p class="text-3xl font-bold" style="color:#eceefb" id="stat-hours">0</p>
                <p class="text-xs font-semibold" style="color:#8b92b0">Horas Totales</p>
              </div>
              <div class="p-4 rounded-2xl text-center" style="background:#222842;border:1px solid #2c3350">
                <i class="fa-solid fa-calendar-check text-2xl mb-2" style="color:#f472b6"></i>
                <p class="text-3xl font-bold" style="color:#eceefb" id="stat-days">0</p>
                <p class="text-xs font-semibold" style="color:#8b92b0">Días Entrenando</p>
              </div>
              <div class="p-4 rounded-2xl text-center" style="background:#222842;border:1px solid #2c3350">
                <i class="fa-solid fa-dumbbell text-2xl mb-2" style="color:#60a5fa"></i>
                <p class="text-3xl font-bold" style="color:#eceefb" id="stat-routines">0</p>
                <p class="text-xs font-semibold" style="color:#8b92b0">Rutinas Completadas</p>
              </div>
              <div class="p-4 rounded-2xl text-center" style="background:#222842;border:1px solid #2c3350">
                <i class="fa-solid fa-bolt text-2xl mb-2" style="color:#fbbf24"></i>
                <p class="text-3xl font-bold" style="color:#eceefb" id="stat-points">0</p>
                <p class="text-xs font-semibold" style="color:#8b92b0">Puntos Totales</p>
              </div>
            </div>

            <!-- Datos físicos / perfil fitness (para medir avance) -->
            <div id="fitness-profile-block" class="rounded-2xl p-4 mb-6" style="background:#222842;border:1px solid #2c3350"></div>

            <!-- Gráfico de Actividad Reciente -->
            <div class="rounded-2xl p-4" style="background:#222842;border:1px solid #2c3350">
              <h3 class="font-bold mb-4" style="color:#eceefb">Actividad Reciente</h3>
              <div id="activity-chart" class="flex items-end gap-2 h-32">
                <!-- Se llena dinámicamente -->
              </div>
            </div>
          </div>

          <!-- Tab: Nutricion -->
          <div id="tab-nutrition" class="profile-tab-content hidden">
            <div id="nutrition-targets" class="mb-4"></div>
            <div id="nutrition-profile-block" class="rounded-2xl p-4" style="background:#222842;border:1px solid #2c3350"></div>
            <div id="nutrition-recipes" class="mt-4"></div>
            <div id="nutrition-weekplan" class="mt-4"></div>
            <p class="text-[11px] mt-3" style="color:#8b92b0"><i class="fa-solid fa-circle-info mr-1"></i> Esta información nos sirve para sugerirte recetas a tu medida. No sustituye la asesoría de un médico o nutriólogo.</p>
          </div>

          <!-- Tab: Buzon (notificaciones) -->
          <div id="tab-mailbox" class="profile-tab-content hidden">
            <div class="space-y-5">
              <div>
                <h3 class="font-bold mb-3 flex items-center gap-2" style="color:#eceefb"><i class="fa-solid fa-user-plus" style="color:#fbbf24"></i> Solicitudes de amistad</h3>
                <div id="mailbox-friends" class="space-y-2"><p class="text-sm" style="color:#8b92b0">Cargando...</p></div>
              </div>
              <div>
                <h3 class="font-bold mb-3 flex items-center gap-2" style="color:#eceefb"><i class="fa-solid fa-calendar-days" style="color:#a78bfa"></i> Invitaciones a entrenar</h3>
                <div id="mailbox-appts" class="space-y-2"><p class="text-sm" style="color:#8b92b0">Cargando...</p></div>
              </div>
            </div>
          </div>

          <!-- Tab: Logros -->
          <div id="tab-achievements" class="profile-tab-content hidden">
            <div id="achievements-grid" class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Se llena dinámicamente -->
            </div>
          </div>

          <!-- Tab: Fotos de Avance -->
          <div id="tab-photos" class="profile-tab-content hidden">
            <div class="mb-4">
              <button onclick="document.getElementById('photo-upload').click()" class="bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-purple-700 transition">
                <i class="fa-solid fa-upload mr-2"></i>Subir Foto de Avance
              </button>
              <input type="file" id="photo-upload" accept="image/*" class="hidden" onchange="handlePhotoUpload(event)">
            </div>
            <div id="photos-grid" class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Se llena dinámicamente -->
            </div>
          </div>

          <!-- Tab: Mejor FIT-BRO -->
          <div id="tab-fitbro" class="profile-tab-content hidden">
            <div id="fitbro-content" class="text-center">
              <!-- Se llena dinámicamente -->
            </div>
          </div>

          <!-- Tab: Personalización -->
          <div id="tab-customization" class="profile-tab-content hidden">
            <div class="space-y-6">
              <div>
                <h3 class="font-bold mb-3" style="color:#eceefb">Tema del Sitio</h3>
                <div class="flex gap-3">
                  <button onclick="setTheme('default')" data-theme="default" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 border-4 border-transparent hover:border-gray-400"></button>
                  <button onclick="setTheme('dark')" data-theme="dark" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-transparent hover:border-gray-400"></button>
                  <button onclick="setTheme('ocean')" data-theme="ocean" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-transparent hover:border-gray-400"></button>
                  <button onclick="setTheme('forest')" data-theme="forest" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-transparent hover:border-gray-400"></button>
                  <button onclick="setTheme('sunset')" data-theme="sunset" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-4 border-transparent hover:border-gray-400"></button>
                </div>
              </div>

              <div>
                <h3 class="font-bold mb-3" style="color:#eceefb">Color Principal</h3>
                <div class="flex gap-3">
                  <button onclick="setPrimaryColor('#ec4899')" data-color="#ec4899" class="color-swatch w-10 h-10 rounded-full" style="background:#ec4899"></button>
                  <button onclick="setPrimaryColor('#8b5cf6')" data-color="#8b5cf6" class="color-swatch w-10 h-10 rounded-full" style="background:#8b5cf6"></button>
                  <button onclick="setPrimaryColor('#3b82f6')" data-color="#3b82f6" class="color-swatch w-10 h-10 rounded-full" style="background:#3b82f6"></button>
                  <button onclick="setPrimaryColor('#10b981')" data-color="#10b981" class="color-swatch w-10 h-10 rounded-full" style="background:#10b981"></button>
                  <button onclick="setPrimaryColor('#f59e0b')" data-color="#f59e0b" class="color-swatch w-10 h-10 rounded-full" style="background:#f59e0b"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Función para cambiar tabs del perfil
function switchProfileTab(tabName) {
  // Ocultar todos los contenidos
  document.querySelectorAll('.profile-tab-content').forEach(content => {
    content.classList.add('hidden');
  });
  
  // Desactivar todos los tabs
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.classList.remove('border-purple-600', 'text-purple-600');
    tab.classList.add('border-transparent', 'text-gray-500');
  });
  
  // Activar tab seleccionado
  const activeTab = document.querySelector(`.profile-tab[data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.remove('border-transparent', 'text-gray-500');
    activeTab.classList.add('border-purple-600', 'text-purple-600');
  }
  
  // Mostrar contenido correspondiente
  const content = document.getElementById(`tab-${tabName}`);
  if (content) {
    content.classList.remove('hidden');
  }
}

// Función para cargar datos del perfil
async function loadProfileData(targetUserId) {
  try {
    const supabase = window.FMAuth.getClient();
    if (!supabase) return;
    // Usuario logueado
    const { data: { user } } = await supabase.auth.getUser();
    // A quién mostramos: si nos pasan targetUserId es un amigo; si no, soy yo
    const viewingId = targetUserId || (user && user.id);
    if (!viewingId) return;
    const isOwn = !targetUserId || (user && targetUserId === user.id);

    // Ocultar pestañas que solo aplican a TU propio perfil cuando ves a un amigo
    const tabPhotos = document.querySelector('.profile-tab[data-tab="photos"]');
    const tabCustom = document.querySelector('.profile-tab[data-tab="customization"]');
    const tabMailbox = document.querySelector('.profile-tab[data-tab="mailbox"]');
    const tabNutrition = document.querySelector('.profile-tab[data-tab="nutrition"]');
    if (tabPhotos) tabPhotos.style.display = isOwn ? '' : 'none';
    if (tabCustom) tabCustom.style.display = isOwn ? '' : 'none';
    if (tabMailbox) tabMailbox.style.display = isOwn ? '' : 'none';
    if (tabNutrition) tabNutrition.style.display = isOwn ? '' : 'none';

    // Cargar buzon (solo mi propio perfil)
    if (isOwn) loadProfileMailbox(user);

    // Obtener perfil que estamos viendo
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', viewingId)
      .single();

    if (profile) {
      // La base usa 'apodo'; dejamos 'nickname' como respaldo por compatibilidad
      document.getElementById('profile-nickname').textContent = profile.apodo || profile.nickname || 'Usuario';
    }

    // Obtener workouts del usuario que estamos viendo
    const { data: workouts } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', viewingId);

    // Calcular estadísticas (puntos derivados de los workouts)
    const stats = calculateUserStats(workouts || []);

    // El rango sale de los puntos reales acumulados
    const rank = window.getMilitaryRank ? window.getMilitaryRank(stats.totalPoints) : 'Recluta';
    document.getElementById('profile-rank').textContent = rank;

    document.getElementById('stat-hours').textContent = stats.totalHours;
    document.getElementById('stat-days').textContent = stats.totalDays;
    document.getElementById('stat-routines').textContent = stats.routinesCompleted;
    document.getElementById('stat-points').textContent = stats.totalPoints;
    document.getElementById('profile-streak').textContent = stats.currentStreak;

    // Mostrar datos físicos / perfil fitness
    renderFitnessProfile(profile, isOwn);

    // Mostrar perfil nutricional (solo el propio)
    if (isOwn) renderNutritionProfile(profile, isOwn);

    // Cargar logros
    loadAchievements(workouts || [], stats.totalPoints);

    // Cargar fotos
    loadPhotos(viewingId);

    // Cargar mejor FIT-BRO (solo para tu propio perfil)
    if (isOwn && profile) loadBestFitBro(user, profile);

    // Generar gráfico de actividad
    generateActivityChart(workouts || []);

  } catch (error) {
    console.error('Error al cargar datos del perfil:', error);
  }
}

// ===== BUZON DE NOTIFICACIONES (Fase 2) =====
async function loadProfileMailbox(user) {
  const friendsCont = document.getElementById('mailbox-friends');
  const apptsCont = document.getElementById('mailbox-appts');
  const badge = document.getElementById('mailbox-badge');
  if (!friendsCont || !apptsCont) return;
  try {
    const supabase = window.FMAuth.getClient();
    if (!supabase || !user) return;

    // Solicitudes de amistad pendientes (yo soy el destinatario)
    const { data: pendingFriends } = await supabase
      .from('friendships').select('*')
      .eq('friend_id', user.id).eq('status', 'pendiente');

    // Invitaciones a entrenar pendientes
    const { data: pendingAppts } = await supabase
      .from('appointments').select('*')
      .eq('receiver_id', user.id).eq('status', 'pendiente');

    // Render solicitudes de amistad
    if (pendingFriends && pendingFriends.length) {
      const { data: senders } = await supabase
        .from('profiles').select('id, apodo')
        .in('id', pendingFriends.map(f => f.user_id));
      friendsCont.innerHTML = pendingFriends.map(f => {
        const prof = senders ? senders.find(p => p.id === f.user_id) : null;
        const name = prof ? prof.apodo : 'Atleta';
        return `
          <div class="flex justify-between items-center rounded-xl p-3" style="background:#222842;border:1px solid #2c3350">
            <span class="text-sm font-semibold" style="color:#eceefb"><i class="fa-solid fa-user-plus mr-2" style="color:#fbbf24"></i>¡${name} quiere ser tu Fit Bro!</span>
            <div class="flex gap-1.5">
              <button onclick="acceptFriendship('${f.user_id}')" class="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded-lg text-xs">Aceptar</button>
              <button onclick="rejectFriendship('${f.user_id}')" class="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold px-3 py-1 rounded-lg text-xs">Rechazar</button>
            </div>
          </div>`;
      }).join('');
    } else {
      friendsCont.innerHTML = `<p class="text-sm" style="color:#8b92b0">No tienes solicitudes nuevas.</p>`;
    }

    // Render invitaciones a entrenar
    if (pendingAppts && pendingAppts.length) {
      apptsCont.innerHTML = pendingAppts.map(a => {
        const dt = new Date(a.scheduled_at).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
        return `
          <div class="flex justify-between items-center rounded-xl p-3" style="background:#222842;border:1px solid #2c3350">
            <span class="text-sm font-semibold" style="color:#eceefb"><i class="fa-solid fa-calendar-days mr-2" style="color:#a78bfa"></i>${a.sender_apodo} te invita a <b>${a.routine_name}</b> el ${dt}</span>
            <div class="flex gap-1.5">
              <button onclick="respondAppointment('${a.id}', 'aceptada')" class="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded-lg text-xs">Aceptar</button>
              <button onclick="respondAppointment('${a.id}', 'rechazada')" class="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold px-3 py-1 rounded-lg text-xs">Rechazar</button>
            </div>
          </div>`;
      }).join('');
    } else {
      apptsCont.innerHTML = `<p class="text-sm" style="color:#8b92b0">No tienes invitaciones a entrenar.</p>`;
    }

    // Badge con el total pendiente
    const total = (pendingFriends ? pendingFriends.length : 0) + (pendingAppts ? pendingAppts.length : 0);
    if (badge) {
      badge.textContent = total;
      badge.classList.toggle('hidden', total === 0);
    }
  } catch (e) {
    console.error('Error al cargar buzon del perfil:', e);
  }
}
window.loadProfileMailbox = loadProfileMailbox;

// Función para cargar logros
function loadAchievements(workouts, totalPoints) {
  const grid = document.getElementById('achievements-grid');
  if (!grid) return;

  const badges = window.getEarnedBadges ? window.getEarnedBadges(workouts, totalPoints) : [];
  const achievements = window.getEarnedAchievements ? window.getEarnedAchievements(workouts, totalPoints) : [];

  const allAchievements = [...badges, ...achievements];

  if (allAchievements.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-8 text-gray-500">
        <i class="fa-solid fa-trophy text-4xl mb-3"></i>
        <p>Completa rutinas para desbloquear logros</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = allAchievements.map(achievement => `
    <div class="bg-gradient-to-br ${achievement.color} p-4 rounded-2xl text-white text-center">
      <i class="fa-solid ${achievement.icon} text-3xl mb-2"></i>
      <h4 class="font-bold text-sm mb-1">${achievement.name}</h4>
      <p class="text-xs opacity-80">${achievement.description}</p>
    </div>
  `).join('');
}

// Función para cargar fotos de avance
async function loadPhotos(userId) {
  const grid = document.getElementById('photos-grid');
  if (!grid) return;

  try {
    const supabase = window.FMAuth.getClient();
    if (!supabase) return;
    const { data: photos } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!photos || photos.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-8 text-gray-500">
          <i class="fa-solid fa-camera text-4xl mb-3"></i>
          <p>Aún no has subido fotos de avance</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = photos.map(photo => `
      <div class="relative group">
        <img src="${photo.url}" alt="Foto de avance" class="w-full h-40 object-cover rounded-2xl">
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-2xl flex items-center justify-center">
          <button onclick="deletePhoto('${photo.id}')" class="text-white hover:text-red-400">
            <i class="fa-solid fa-trash text-xl"></i>
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-1">${new Date(photo.created_at).toLocaleDateString()}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error al cargar fotos:', error);
  }
}

// Función para subir foto
async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const supabase = window.FMAuth.getClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Subir a Supabase Storage
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('progress-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('progress-photos')
      .getPublicUrl(fileName);

    // Guardar en base de datos
    const { error: dbError } = await supabase
      .from('progress_photos')
      .insert({
        user_id: user.id,
        url: publicUrl,
        created_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    // Recargar fotos
    loadPhotos(user.id);

  } catch (error) {
    console.error('Error al subir foto:', error);
    alert('Error al subir la foto. Intenta nuevamente.');
  }
}

// Función para eliminar foto
async function deletePhoto(photoId) {
  if (!confirm('¿Estás seguro de eliminar esta foto?')) return;

  try {
    const supabase = window.FMAuth.getClient();
    if (!supabase) return;
    const { error } = await supabase
      .from('progress_photos')
      .delete()
      .eq('id', photoId);

    if (error) throw error;

    const { data: { user } } = await supabase.auth.getUser();
    loadPhotos(user.id);

  } catch (error) {
    console.error('Error al eliminar foto:', error);
  }
}

// Función para cargar mejor FIT-BRO
async function loadBestFitBro(currentUser, profile) {
  const content = document.getElementById('fitbro-content');
  if (!content) return;

  try {
    const supabase = window.FMAuth.getClient();
    if (!supabase) return;
    // Obtener todos los usuarios
    const { data: allUsers } = await supabase
      .from('profiles')
      .select('*');

    // Obtener workouts del usuario actual
    const { data: workouts } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', currentUser.id);

    const bestFitBro = findBestFitBro(
      { ...currentUser, total_points: profile?.total_points || 0 },
      allUsers || [],
      workouts || []
    );

    if (!bestFitBro) {
      content.innerHTML = `
        <div class="py-8 text-gray-500">
          <i class="fa-solid fa-user-group text-4xl mb-3"></i>
          <p>No hay suficientes usuarios para encontrar tu FIT-BRO</p>
          <p class="text-sm mt-2">¡Invita a tus amigos a unirse!</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
        <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-4xl mb-2">
          <i class="fa-solid fa-user"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900">${bestFitBro.nickname || 'Usuario'}</h3>
        <p class="text-gray-600 text-sm mb-4">${bestFitBro.matchReason}</p>
        <div class="flex justify-center gap-4 mb-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-purple-600">${bestFitBro.matchScore}%</p>
            <p class="text-xs text-gray-600">Compatibilidad</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-pink-600">${window.getMilitaryRank ? window.getMilitaryRank(bestFitBro.total_points || 0) : 'Recluta'}</p>
            <p class="text-xs text-gray-600">Rango</p>
          </div>
        </div>
        <button class="bg-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-purple-700 transition">
          <i class="fa-solid fa-message mr-2"></i>Enviar Mensaje
        </button>
      </div>
    `;

  } catch (error) {
    console.error('Error al cargar FIT-BRO:', error);
  }
}

// Función para generar gráfico de actividad
function generateActivityChart(workouts) {
  const chart = document.getElementById('activity-chart');
  if (!chart) return;

  // Generar datos de los últimos 7 días
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  const chartData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    
    const workoutsOnDay = workouts.filter(w => {
      if (!w.created_at) return false;
      return new Date(w.created_at).toDateString() === dateStr;
    });

    chartData.push({
      day: days[date.getDay()],
      count: workoutsOnDay.length
    });
  }

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  chart.innerHTML = chartData.map(d => `
    <div class="flex-1 flex flex-col items-center">
      <div class="w-full bg-purple-200 rounded-t-lg transition-all" style="height: ${(d.count / maxCount) * 100}%"></div>
      <p class="text-xs text-gray-600 mt-1">${d.day}</p>
    </div>
  `).join('');
}

// Temas predefinidos: cada uno es un par de colores para el degradado del encabezado
const FM_THEMES = {
  default: ['#9333ea', '#ec4899'],
  dark:    ['#374151', '#111827'],
  ocean:   ['#06b6d4', '#2563eb'],
  forest:  ['#22c55e', '#059669'],
  sunset:  ['#f97316', '#ef4444']
};

// Aplica el degradado al encabezado del perfil
function applyProfileHeader(c1, c2){
  const h = document.getElementById('profile-header');
  if(h){
    h.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  }
}

// Marca visualmente cual swatch/tema esta activo
function markActiveCustomization(){
  const color = userProfile.customization.primaryColor;
  const theme = userProfile.customization.theme;
  document.querySelectorAll('.color-swatch').forEach(b => {
    const on = b.dataset.color === color;
    b.style.outline = on ? '3px solid #fff' : '2px solid #2c3350';
    b.style.outlineOffset = '2px';
  });
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('border-white', b.dataset.theme === theme);
    b.classList.toggle('border-transparent', b.dataset.theme !== theme);
  });
}

// Aplica lo guardado (al abrir el perfil)
function applySavedCustomization(){
  try {
    const savedColor = localStorage.getItem('fm_profile_color');
    const savedTheme = localStorage.getItem('fm_profile_theme');
    if(savedColor) userProfile.customization.primaryColor = savedColor;
    if(savedTheme) userProfile.customization.theme = savedTheme;
  } catch(e){}
  // El color principal manda sobre el encabezado; si no hay color, usa el tema
  if(localStorage.getItem('fm_profile_color')){
    const c = userProfile.customization.primaryColor;
    applyProfileHeader(c, c + '88');
  } else {
    const t = FM_THEMES[userProfile.customization.theme] || FM_THEMES.default;
    applyProfileHeader(t[0], t[1]);
  }
  markActiveCustomization();
}

// Función para establecer tema
function setTheme(theme) {
  userProfile.customization.theme = theme;
  try { localStorage.setItem('fm_profile_theme', theme); localStorage.removeItem('fm_profile_color'); } catch(e){}
  userProfile.customization.primaryColor = '';
  const t = FM_THEMES[theme] || FM_THEMES.default;
  applyProfileHeader(t[0], t[1]);
  markActiveCustomization();
}

// Función para establecer color principal
function setPrimaryColor(color) {
  userProfile.customization.primaryColor = color;
  try { localStorage.setItem('fm_profile_color', color); } catch(e){}
  // Degradado del color elegido hacia una version mas oscura del mismo color
  applyProfileHeader(color, color + '88');
  markActiveCustomization();
}
window.setTheme = setTheme;
window.setPrimaryColor = setPrimaryColor;

// Exponer funciones en el ambiente global
if (typeof window !== "undefined") {
  // ===== PERFIL FITNESS (datos físicos + IMC + edición) =====
const FM_FIT_LABELS = {
  sexo: { hombre:'Hombre', mujer:'Mujer', otro:'Sin especificar' },
  experiencia: { principiante:'Principiante', intermedio:'Intermedio', avanzado:'Avanzado' },
  objetivo: { bajar_grasa:'Bajar grasa', musculo:'Ganar músculo', salud:'Salud general', movilidad:'Movilidad', resistencia:'Resistencia' },
  equipo: { casa_sin:'Casa sin equipo', casa_basico:'Casa básico', gimnasio:'Gimnasio' }
};
function fmImc(peso, altura){
  if(!peso || !altura) return null;
  const m = altura/100;
  const imc = peso/(m*m);
  let cat = 'Saludable', color = '#34d399';
  if(imc < 18.5){ cat='Bajo peso'; color='#60a5fa'; }
  else if(imc < 25){ cat='Saludable'; color='#34d399'; }
  else if(imc < 30){ cat='Sobrepeso'; color='#fbbf24'; }
  else { cat='Obesidad'; color='#ef4444'; }
  return { value: imc.toFixed(1), cat, color };
}
function fmChip(icon, label, value){
  return `<div class="rounded-xl px-3 py-2" style="background:#181c2a;border:1px solid #2c3350">
    <div class="text-[10px] uppercase tracking-wide" style="color:#8b92b0"><i class="fa-solid ${icon} mr-1"></i>${label}</div>
    <div class="font-bold text-sm" style="color:#eceefb">${value}</div>
  </div>`;
}
function fmArchetype(p){
  const expMap = { principiante:'Aprendiz', intermedio:'Guerrero', avanzado:'Élite' };
  const objMap = {
    bajar_grasa: { name:'Quemador', icon:'fa-fire-flame-curved', color:'#ef4444' },
    musculo:     { name:'Constructor', icon:'fa-dumbbell', color:'#60a5fa' },
    salud:       { name:'Equilibrado', icon:'fa-heart', color:'#f472b6' },
    movilidad:   { name:'Fluido', icon:'fa-spa', color:'#22d3ee' },
    resistencia: { name:'Incansable', icon:'fa-heart-pulse', color:'#fb923c' }
  };
  const o = objMap[p.objetivo] || { name:'Atleta', icon:'fa-medal', color:'#a855f7' };
  const exp = expMap[p.experiencia] || '';
  const name = (exp ? exp + ' ' : '') + o.name;
  const equipoTxt = FM_FIT_LABELS.equipo[p.equipo] || '';
  const desc = `Meta: ${FM_FIT_LABELS.objetivo[p.objetivo] || '-'}` + (equipoTxt ? ' · ' + equipoTxt : '') + (p.dias_semana ? ' · ' + p.dias_semana + '+ días/sem' : '');
  return { name, desc, icon:o.icon, color:o.color };
}
function renderFitnessProfile(profile, isOwn){
  const box = document.getElementById('fitness-profile-block');
  if(!box) return;
  profile = profile || {};
  const hasData = profile.peso_kg || profile.altura_cm || profile.objetivo;
  const imc = fmImc(profile.peso_kg, profile.altura_cm);
  const editBtn = isOwn ? `<button onclick="toggleFitnessEdit(true)" class="text-xs font-bold px-3 py-1.5 rounded-lg" style="background:#7c5cff;color:#fff"><i class="fa-solid fa-pen mr-1"></i>Editar</button>` : '';

  if(!hasData){
    box.innerHTML = `<div class="flex items-center justify-between">
      <div><h3 class="font-bold" style="color:#eceefb"><i class="fa-solid fa-heart-pulse mr-1" style="color:#f472b6"></i> Tu perfil físico</h3>
      <p class="text-xs mt-1" style="color:#8b92b0">${isOwn ? 'Aún no tienes datos. Compártelos para medir tu avance.' : 'Sin datos públicos.'}</p></div>
      ${editBtn}
    </div>
    <div id="fitness-edit-form" class="hidden mt-4"></div>`;
    if(isOwn) buildFitnessForm(profile);
    return;
  }

  box.innerHTML = `
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-bold" style="color:#eceefb"><i class="fa-solid fa-heart-pulse mr-1" style="color:#f472b6"></i> Tu perfil físico</h3>
      ${editBtn}
    </div>
    ${(profile.objetivo || profile.experiencia) ? (() => { const a = fmArchetype(profile); return `
    <div class="rounded-2xl p-4 mb-3 flex items-center gap-4" style="background:linear-gradient(135deg, ${a.color}22, #181c2a);border:1px solid ${a.color}55">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shrink-0" style="background:${a.color}"><i class="fa-solid ${a.icon}"></i></div>
      <div>
        <div class="text-[10px] uppercase tracking-widest" style="color:#8b92b0">Tu arquetipo de atleta</div>
        <div class="fun text-xl font-extrabold" style="color:#eceefb">${a.name}</div>
        <div class="text-xs" style="color:#b2b9d4">${a.desc}</div>
      </div>
    </div>` ; })() : ''}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
      ${profile.edad ? fmChip('fa-cake-candles','Edad', profile.edad + ' años') : ''}
      ${profile.sexo ? fmChip('fa-venus-mars','Sexo', FM_FIT_LABELS.sexo[profile.sexo]||profile.sexo) : ''}
      ${profile.peso_kg ? fmChip('fa-weight-scale','Peso', profile.peso_kg + ' kg') : ''}
      ${profile.altura_cm ? fmChip('fa-ruler-vertical','Altura', profile.altura_cm + ' cm') : ''}
      ${imc ? `<div class="rounded-xl px-3 py-2" style="background:#181c2a;border:1px solid #2c3350"><div class="text-[10px] uppercase tracking-wide" style="color:#8b92b0"><i class="fa-solid fa-calculator mr-1"></i>IMC</div><div class="font-bold text-sm" style="color:${imc.color}">${imc.value} · ${imc.cat}</div></div>` : ''}
      ${profile.objetivo ? fmChip('fa-bullseye','Objetivo', FM_FIT_LABELS.objetivo[profile.objetivo]||profile.objetivo) : ''}
      ${profile.experiencia ? fmChip('fa-signal','Nivel', FM_FIT_LABELS.experiencia[profile.experiencia]||profile.experiencia) : ''}
      ${profile.equipo ? fmChip('fa-toolbox','Equipo', FM_FIT_LABELS.equipo[profile.equipo]||profile.equipo) : ''}
      ${profile.dias_semana ? fmChip('fa-calendar-week','Días/sem', profile.dias_semana + '+') : ''}
    </div>
    <div id="fitness-edit-form" class="hidden mt-4"></div>`;
  if(isOwn) buildFitnessForm(profile);
}
function selOpts(map, current){
  return Object.keys(map).map(k => `<option value="${k}" ${current===k?'selected':''}>${map[k]}</option>`).join('');
}
function buildFitnessForm(p){
  const form = document.getElementById('fitness-edit-form');
  if(!form) return;
  const inS = 'width:100%;background:#0f1117;border:1px solid #2c3350;border-radius:10px;padding:8px 10px;color:#eceefb;font-size:13px';
  form.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div><label class="text-[10px] uppercase" style="color:#8b92b0">Edad</label><input id="ed-edad" type="number" value="${p.edad||''}" style="${inS}"></div>
      <div><label class="text-[10px] uppercase" style="color:#8b92b0">Sexo</label><select id="ed-sexo" style="${inS}">${selOpts(FM_FIT_LABELS.sexo, p.sexo)}</select></div>
      <div><label class="text-[10px] uppercase" style="color:#8b92b0">Peso (kg)</label><input id="ed-peso" type="number" value="${p.peso_kg||''}" style="${inS}"></div>
      <div><label class="text-[10px] uppercase" style="color:#8b92b0">Altura (cm)</label><input id="ed-altura" type="number" value="${p.altura_cm||''}" style="${inS}"></div>
      <div><label class="text-[10px] uppercase" style="color:#8b92b0">Nivel</label><select id="ed-exp" style="${inS}">${selOpts(FM_FIT_LABELS.experiencia, p.experiencia)}</select></div>
      <div><label class="text-[10px] uppercase" style="color:#8b92b0">Objetivo</label><select id="ed-obj" style="${inS}">${selOpts(FM_FIT_LABELS.objetivo, p.objetivo)}</select></div>
      <div><label class="text-[10px] uppercase" style="color:#8b92b0">Equipo</label><select id="ed-equipo" style="${inS}">${selOpts(FM_FIT_LABELS.equipo, p.equipo)}</select></div>
      <div><label class="text-[10px] uppercase" style="color:#8b92b0">Días/sem</label><select id="ed-dias" style="${inS}"><option value="2" ${p.dias_semana==2?'selected':''}>2-3</option><option value="4" ${p.dias_semana==4?'selected':''}>4-5</option><option value="6" ${p.dias_semana==6?'selected':''}>6+</option></select></div>
    </div>
    <div class="flex gap-2 mt-3">
      <button onclick="saveFitnessProfile()" class="text-xs font-bold px-4 py-2 rounded-lg" style="background:#34d399;color:#06281e"><i class="fa-solid fa-check mr-1"></i>Guardar</button>
      <button onclick="toggleFitnessEdit(false)" class="text-xs font-bold px-4 py-2 rounded-lg" style="background:#222842;color:#b2b9d4">Cancelar</button>
      <span id="fitness-edit-msg" class="text-xs self-center" style="color:#ef4444"></span>
    </div>`;
}
function toggleFitnessEdit(show){
  const form = document.getElementById('fitness-edit-form');
  if(form) form.classList.toggle('hidden', !show);
}
async function saveFitnessProfile(){
  const msg = document.getElementById('fitness-edit-msg');
  try {
    const supa = window.FMAuth.getClient();
    const { data: { user } } = await supa.auth.getUser();
    if(!user) throw new Error('No hay sesión');
    const payload = {
      edad: +document.getElementById('ed-edad').value || null,
      sexo: document.getElementById('ed-sexo').value,
      peso_kg: +document.getElementById('ed-peso').value || null,
      altura_cm: +document.getElementById('ed-altura').value || null,
      experiencia: document.getElementById('ed-exp').value,
      objetivo: document.getElementById('ed-obj').value,
      equipo: document.getElementById('ed-equipo').value,
      dias_semana: +document.getElementById('ed-dias').value || null,
      onboarding_done: true
    };
    const { error } = await supa.from('profiles').update(payload).eq('id', user.id);
    if(error) throw error;
    loadProfileData();
  } catch(err){
    console.error(err);
    if(msg) msg.textContent = 'No se pudo guardar: ' + (err.message||err);
  }
}
window.toggleFitnessEdit = toggleFitnessEdit;
window.saveFitnessProfile = saveFitnessProfile;

// ===== PERFIL NUTRICIONAL (Fase A) =====
const FM_NUT_LABELS = {
  diet_pattern: { omnivoro:'Omnívoro', vegetariano:'Vegetariano', vegano:'Vegano', pescetariano:'Pescetariano' },
  diet_style:   { ninguno:'Ninguno', keto:'Keto', lowcarb:'Low-carb', mediterraneo:'Mediterráneo', ayuno:'Ayuno intermitente' },
  fasting_protocol: { '16_8':'16:8 (ventana 8h)', '18_6':'18:6 (ventana 6h)', '20_4':'20:4 (Warrior)', 'omad':'OMAD (1 comida)', '5_2':'5:2 (semanal)' },
  nutrition_pace: { lento:'Lento (sostenible)', moderado:'Moderado', agresivo:'Agresivo' },
  spice_level:  { nada:'Suave', medio:'Medio', picante:'Picante' },
  cook_time:    { rapido:'Rápido (<15 min)', medio:'Medio (~30 min)', gusta_cocinar:'Me encanta cocinar' },
  cook_skill:   { principiante:'Principiante', intermedio:'Intermedio', avanzado:'Avanzado' },
  budget_tier:  { bajo:'Económico', medio:'Medio', alto:'Holgado' }
};
function nutChip(icon, label, value){
  return `<div class="rounded-xl px-3 py-2" style="background:#181c2a;border:1px solid #2c3350">
    <div class="text-[10px] uppercase tracking-wide" style="color:#8b92b0"><i class="fa-solid ${icon} mr-1"></i>${label}</div>
    <div class="font-bold text-sm" style="color:#eceefb">${value}</div>
  </div>`;
}
// Tarjeta 'Tus numeros': calorias y macros calculados por el motor (Fase B)
function renderNutritionTargets(profile){
  const box = document.getElementById('nutrition-targets');
  if(!box) return;
  if(!window.FMNutrition){ box.innerHTML=''; return; }
  const r = window.FMNutrition.macros(profile || {});
  if(!r){
    box.innerHTML = `<div class="rounded-2xl p-4" style="background:#2a1d10;border:1px solid #a16207">
      <p class="text-sm font-bold" style="color:#fbbf24"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Faltan datos para calcular tus números</p>
      <p class="text-xs mt-1" style="color:#d6ba7a">Completa tu <b>edad, sexo, peso y altura</b> en la pestaña Estadísticas para ver tus calorías y macros.</p>
    </div>`;
    return;
  }
  const warns = window.FMNutrition.validate(profile||{}, r);
  const bar = (label, grams, kcalPerG, color)=>{
    const kcal = grams * kcalPerG;
    const pct = Math.round((kcal / r.calories) * 100);
    return `<div class="mb-2">
      <div class="flex justify-between text-xs mb-1"><span style="color:#b2b9d4">${label}</span><span class="font-bold" style="color:#eceefb">${grams} g</span></div>
      <div class="w-full rounded-full h-2" style="background:#0f1117"><div class="h-2 rounded-full" style="width:${pct}%;background:${color}"></div></div>
    </div>`;
  };
  box.innerHTML = `
    <div class="rounded-2xl p-4" style="background:linear-gradient(135deg,#0f2e22,#181c2a);border:1px solid #2c5f4a">
      <h3 class="font-bold mb-1 flex items-center gap-2 flex-wrap" style="color:#eceefb"><i class="fa-solid fa-calculator" style="color:#34d399"></i> Tus números diarios
        ${r.source==='custom' ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:#7c5cff33;color:#c4b5fd;border:1px solid #7c5cff66">MI PLAN</span>` : `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:#34d39922;color:#6ee7b7;border:1px solid #34d39955">CALCULADO</span>`}
      </h3>
      ${r.source==='custom' ? `<p class="text-[11px] mb-2" style="color:#a78bfa"><i class="fa-solid fa-user-doctor mr-1"></i>Usando tu plan personalizado.${(r.bmr&&r.tdee)?` (Referencia: TMB ${r.bmr}, gasto ${r.tdee})`:''}</p>` : ''}
      <div class="flex items-end gap-2 mb-4">
        <div class="text-4xl font-extrabold" style="color:#34d399">${r.calories}</div>
        <div class="text-sm mb-1" style="color:#8b92b0">kcal / día</div>
      </div>
      <div class="grid grid-cols-3 gap-2 mb-4 text-center">
        <div class="rounded-xl py-2" style="background:#181c2a;border:1px solid #2c3350"><div class="text-[10px] uppercase" style="color:#8b92b0">TMB</div><div class="font-bold text-sm" style="color:#eceefb">${r.bmr}</div></div>
        <div class="rounded-xl py-2" style="background:#181c2a;border:1px solid #2c3350"><div class="text-[10px] uppercase" style="color:#8b92b0">Gasto (TDEE)</div><div class="font-bold text-sm" style="color:#eceefb">${r.tdee}</div></div>
        <div class="rounded-xl py-2" style="background:#181c2a;border:1px solid #2c3350"><div class="text-[10px] uppercase" style="color:#8b92b0">Comidas</div><div class="font-bold text-sm" style="color:#eceefb">${profile.meals_per_day||'-'}</div></div>
      </div>
      ${bar('Proteína', r.protein_g, 4, '#60a5fa')}
      ${bar('Carbohidratos', r.carbs_g, 4, '#fbbf24')}
      ${bar('Grasas', r.fat_g, 9, '#f472b6')}
      ${r.net_carbs_per_meal!=null ? `<p class="text-[11px] mt-2" style="color:#8b92b0">~${r.net_carbs_per_meal}g de carbohidratos por comida</p>`:''}
      ${profile.diet_style==='ayuno' ? `<div class="mt-3 rounded-xl p-2 text-[11px]" style="background:#10231f;border:1px solid #2c5f4a;color:#7fd9bb"><i class="fa-solid fa-hourglass-half mr-1"></i>Ayuno: come tus <b>${r.calories} kcal</b> dentro de tu ventana${profile.eating_window?` (<b>${profile.eating_window}</b>)`:''}${profile.meals_per_day?` en ${profile.meals_per_day} comida(s)`:''}. El ayuno cambia <b>cuándo</b> comes, no cuánto.</div>`:''}
      ${warns.length ? `<div class="mt-3 rounded-xl p-2 text-[11px]" style="background:#3a1010;border:1px solid #7f1d1d;color:#fca5a5"><i class="fa-solid fa-shield-halved mr-1"></i>${warns.join(' ')}</div>`:''}
    </div>`;
}
// Tarjetas de recetas sugeridas (Fase C/D)
function fmTag(txt, color){ return `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded" style="background:${color}22;color:${color};border:1px solid ${color}55">${txt}</span>`; }
function renderRecipeSuggestions(profile){
  const box = document.getElementById('nutrition-recipes');
  if(!box) return;
  if(!window.FMRecipes){ box.innerHTML=''; return; }
  const recetas = window.FMRecipes.match(profile||{}, { limit: 6 });
  if(!recetas.length){
    box.innerHTML = `<div class="rounded-2xl p-4" style="background:#222842;border:1px solid #2c3350"><p class="text-sm" style="color:#8b92b0">No encontramos recetas que cumplan todos tus filtros. Prueba ampliar tu presupuesto o quitar alguna restricción.</p></div>`;
    return;
  }
  const cards = recetas.map(r => `
    <div class="rounded-2xl p-4" style="background:#222842;border:1px solid #2c3350">
      <div class="flex justify-between items-start gap-2">
        <h4 class="font-bold text-sm" style="color:#eceefb">${r.name}</h4>
        <span class="text-xs font-bold shrink-0" style="color:#34d399">${r.kcal} kcal</span>
      </div>
      <div class="flex flex-wrap gap-1 mt-2">
        ${fmTag('P '+r.protein_g+'g','#60a5fa')}${fmTag('C '+r.net_carbs+'g net','#fbbf24')}${fmTag('G '+r.fat_g+'g','#f472b6')}
        ${r.keto_friendly?fmTag('keto','#22d3ee'):''}${r.high_protein?fmTag('alto en proteína','#a78bfa'):''}
        ${fmTag(r.budget,'#9ca3af')}${fmTag(r.cook_time_min+' min','#9ca3af')}
      </div>
      <button onclick="toggleRecipe('${r.id}')" class="text-xs font-bold mt-3" style="color:#34d399"><i class="fa-solid fa-chevron-down mr-1"></i>Ver receta</button>
      <div id="recipe-${r.id}" class="hidden mt-2 text-xs" style="color:#b2b9d4">
        <p class="font-bold mb-1" style="color:#eceefb">Ingredientes:</p>
        <ul class="list-disc list-inside space-y-0.5 mb-2">${r.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul>
        <p class="font-bold mb-1" style="color:#eceefb">Preparación:</p>
        <ol class="list-decimal list-inside space-y-0.5">${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
      </div>
    </div>`).join('');
  box.innerHTML = `
    <h3 class="font-bold mb-3 flex items-center gap-2" style="color:#eceefb"><i class="fa-solid fa-bowl-food" style="color:#34d399"></i> Recetas para ti <span class="text-xs font-normal" style="color:#8b92b0">(según tu perfil)</span></h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${cards}</div>`;
}
function toggleRecipe(id){
  const el = document.getElementById('recipe-'+id);
  if(el) el.classList.toggle('hidden');
}
window.toggleRecipe = toggleRecipe;

// Plan semanal de comidas (Opcion A)
let _fmPlanSeed = 0;
let _fmPlanProfile = null;
function renderWeeklyPlan(profile){
  _fmPlanProfile = profile || {};
  const box = document.getElementById('nutrition-weekplan');
  if(!box) return;
  if(!window.FMRecipes || !window.FMRecipes.weeklyPlan){ box.innerHTML=''; return; }
  const plan = window.FMRecipes.weeklyPlan(_fmPlanProfile, _fmPlanSeed);
  const hayRecetas = plan.days.some(d => d.meals.some(m => m.recipe));
  if(!hayRecetas){
    box.innerHTML = `<div class="rounded-2xl p-4" style="background:#222842;border:1px solid #2c3350"><p class="text-sm" style="color:#8b92b0">No hay recetas suficientes para armar tu plan. Ajusta tus filtros (presupuesto, dieta).</p></div>`;
    return;
  }
  const t = plan.dailyTarget;
  const dayCards = plan.days.map(d => {
    const diff = t ? d.totals.kcal - t : null;
    const diffTxt = (diff!=null) ? `<span style="color:${Math.abs(diff)<=250?'#34d399':'#fbbf24'}">${diff>0?'+':''}${diff} vs meta</span>` : '';
    const rows = d.meals.map(m => m.recipe
      ? `<div class="flex justify-between items-center text-xs py-1" style="border-top:1px solid #2c3350"><span style="color:#b2b9d4"><b style="color:#8b92b0">${m.slot}:</b> ${m.recipe.name}</span><span class="shrink-0 ml-2" style="color:#34d399">${m.recipe.kcal}</span></div>`
      : `<div class="text-xs py-1" style="color:#8b92b0;border-top:1px solid #2c3350"><b>${m.slot}:</b> -</div>`
    ).join('');
    return `<div class="rounded-2xl p-3" style="background:#222842;border:1px solid #2c3350">
      <div class="flex justify-between items-center mb-1">
        <h4 class="font-bold text-sm" style="color:#eceefb">${d.day}</h4>
        <span class="text-xs font-bold" style="color:#eceefb">${d.totals.kcal} kcal</span>
      </div>
      <div class="text-[10px] mb-1">${diffTxt} <span style="color:#8b92b0">P ${d.totals.protein} / C ${d.totals.carbs} / G ${d.totals.fat}</span></div>
      ${rows}
    </div>`;
  }).join('');
  box.innerHTML = `
    <div class="flex justify-between items-center mb-3">
      <h3 class="font-bold flex items-center gap-2" style="color:#eceefb"><i class="fa-solid fa-calendar-week" style="color:#34d399"></i> Tu plan semanal <span class="text-xs font-normal" style="color:#8b92b0">(${plan.meals} comida(s)/día)</span></h3>
      <button onclick="regenerateWeeklyPlan()" class="text-xs font-bold px-3 py-1.5 rounded-lg" style="background:#7c5cff;color:#fff"><i class="fa-solid fa-rotate mr-1"></i>Regenerar</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${dayCards}</div>`;
}
function regenerateWeeklyPlan(){ _fmPlanSeed++; renderWeeklyPlan(_fmPlanProfile); }
window.regenerateWeeklyPlan = regenerateWeeklyPlan;

function renderNutritionProfile(profile, isOwn){
  const box = document.getElementById('nutrition-profile-block');
  if(!box) return;
  profile = profile || {};
  const L = FM_NUT_LABELS;
  // Calcular y mostrar calorias/macros (motor Fase B)
  renderNutritionTargets(profile);
  // Sugerencias de recetas (Fase C/D)
  renderRecipeSuggestions(profile);
  // Plan semanal de comidas (Opcion A)
  renderWeeklyPlan(profile);
  const hasData = profile.diet_pattern || profile.diet_style || profile.budget_tier || profile.country;
  const editBtn = isOwn ? `<button onclick="toggleNutritionEdit(true)" class="text-xs font-bold px-3 py-1.5 rounded-lg" style="background:#34d399;color:#06281e"><i class="fa-solid fa-pen mr-1"></i>${hasData?'Editar':'Completar'}</button>` : '';

  if(!hasData){
    box.innerHTML = `<div class="flex items-center justify-between">
      <div><h3 class="font-bold" style="color:#eceefb"><i class="fa-solid fa-apple-whole mr-1" style="color:#34d399"></i> Tu perfil nutricional</h3>
      <p class="text-xs mt-1" style="color:#8b92b0">${isOwn ? 'Complétalo para recibir recetas hechas a tu medida.' : 'Sin datos.'}</p></div>
      ${editBtn}
    </div>
    <div id="nutrition-edit-form" class="hidden mt-4"></div>`;
    if(isOwn) buildNutritionForm(profile);
    return;
  }

  box.innerHTML = `
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-bold" style="color:#eceefb"><i class="fa-solid fa-apple-whole mr-1" style="color:#34d399"></i> Tu perfil nutricional</h3>
      ${editBtn}
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
      ${profile.diet_pattern ? nutChip('fa-leaf','Dieta', L.diet_pattern[profile.diet_pattern]||profile.diet_pattern) : ''}
      ${profile.diet_style ? nutChip('fa-seedling','Estilo', L.diet_style[profile.diet_style]||profile.diet_style) : ''}
      ${profile.meals_per_day ? nutChip('fa-utensils','Comidas/día', profile.meals_per_day) : ''}
      ${profile.fasting_protocol ? nutChip('fa-hourglass-half','Ayuno', L.fasting_protocol[profile.fasting_protocol]||profile.fasting_protocol) : ''}
      ${profile.eating_window ? nutChip('fa-clock','Ventana', profile.eating_window) : ''}
      ${profile.nutrition_pace ? nutChip('fa-gauge-high','Ritmo', L.nutrition_pace[profile.nutrition_pace]||profile.nutrition_pace) : ''}
      ${profile.allergies ? nutChip('fa-triangle-exclamation','Alergias', profile.allergies) : ''}
      ${profile.intolerances ? nutChip('fa-ban','Intolerancias', profile.intolerances) : ''}
      ${profile.dislikes ? nutChip('fa-face-frown','No le gusta', profile.dislikes) : ''}
      ${profile.spice_level ? nutChip('fa-pepper-hot','Picante', L.spice_level[profile.spice_level]||profile.spice_level) : ''}
      ${profile.cook_time ? nutChip('fa-clock','Tiempo cocina', L.cook_time[profile.cook_time]||profile.cook_time) : ''}
      ${profile.cook_skill ? nutChip('fa-kitchen-set','Nivel cocina', L.cook_skill[profile.cook_skill]||profile.cook_skill) : ''}
      ${profile.kitchen_equipment ? nutChip('fa-blender','Equipo', profile.kitchen_equipment) : ''}
      ${profile.country ? nutChip('fa-earth-americas','País', profile.country) : ''}
      ${profile.budget_tier ? nutChip('fa-wallet','Presupuesto', L.budget_tier[profile.budget_tier]||profile.budget_tier) : ''}
      ${profile.cuisine ? nutChip('fa-bowl-food','Cocina fav.', profile.cuisine) : ''}
      ${profile.medical_flags ? nutChip('fa-heart-pulse','Salud', profile.medical_flags) : ''}
    </div>
    <div id="nutrition-edit-form" class="hidden mt-4"></div>`;
  if(isOwn) buildNutritionForm(profile);
}
function buildNutritionForm(p){
  const form = document.getElementById('nutrition-edit-form');
  if(!form) return;
  const L = FM_NUT_LABELS;
  const inS = 'width:100%;background:#0f1117;border:1px solid #2c3350;border-radius:10px;padding:8px 10px;color:#eceefb;font-size:13px';
  const lb = (t)=>`<label class="text-[10px] uppercase" style="color:#8b92b0">${t}</label>`;
  const noneOpt = (cur)=>`<option value="" ${!cur?'selected':''}>-</option>`;
  const sel = (id, map, cur)=>`<select id="${id}" style="${inS}">${noneOpt(cur)}${selOpts(map, cur)}</select>`;
  form.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div>${lb('Dieta')}${sel('nu-pattern', L.diet_pattern, p.diet_pattern)}</div>
      <div>${lb('Estilo')}${sel('nu-style', L.diet_style, p.diet_style)}</div>
      <div>${lb('Comidas/día')}<select id="nu-meals" style="${inS}"><option value="">-</option><option value="1" ${p.meals_per_day==1?'selected':''}>1 (OMAD)</option><option value="2" ${p.meals_per_day==2?'selected':''}>2</option><option value="3" ${p.meals_per_day==3?'selected':''}>3</option><option value="4" ${p.meals_per_day==4?'selected':''}>4</option><option value="5" ${p.meals_per_day==5?'selected':''}>5</option></select></div>
      <div>${lb('Protocolo ayuno')}${sel('nu-fasting', L.fasting_protocol, p.fasting_protocol)}</div>
      <div>${lb('Ventana (si ayunas)')}<input id="nu-window" type="text" value="${p.eating_window||''}" placeholder="12:00 - 20:00" style="${inS}"></div>
      <div>${lb('Ritmo')}${sel('nu-pace', L.nutrition_pace, p.nutrition_pace)}</div>
      <div>${lb('Picante')}${sel('nu-spice', L.spice_level, p.spice_level)}</div>
      <div>${lb('Tiempo cocina')}${sel('nu-cooktime', L.cook_time, p.cook_time)}</div>
      <div>${lb('Nivel cocina')}${sel('nu-cookskill', L.cook_skill, p.cook_skill)}</div>
      <div>${lb('Presupuesto')}${sel('nu-budget', L.budget_tier, p.budget_tier)}</div>
      <div>${lb('País')}<input id="nu-country" type="text" value="${p.country||''}" placeholder="México..." style="${inS}"></div>
      <div>${lb('Alergias')}<input id="nu-allergies" type="text" value="${p.allergies||''}" placeholder="nueces, mariscos..." style="${inS}"></div>
      <div>${lb('Intolerancias')}<input id="nu-intol" type="text" value="${p.intolerances||''}" placeholder="lactosa..." style="${inS}"></div>
      <div>${lb('No le gusta')}<input id="nu-dislikes" type="text" value="${p.dislikes||''}" placeholder="hígado..." style="${inS}"></div>
      <div>${lb('Cocina favorita')}<input id="nu-cuisine" type="text" value="${p.cuisine||''}" placeholder="mexicana, italiana..." style="${inS}"></div>
      <div>${lb('Equipo de cocina')}<input id="nu-equip" type="text" value="${p.kitchen_equipment||''}" placeholder="estufa, horno, licuadora..." style="${inS}"></div>
      <div class="md:col-span-3">${lb('Salud (opcional - guia general, no tratamiento)')}<input id="nu-medical" type="text" value="${p.medical_flags||''}" placeholder="diabetes, hipertension, embarazo..." style="${inS}"></div>
    </div>
    <div class="mt-4 rounded-xl p-3" style="background:#1c1633;border:1px solid #7c5cff55">
      <label class="flex items-center gap-2 cursor-pointer">
        <input id="nu-usecustom" type="checkbox" ${p.use_custom_plan?'checked':''} style="width:16px;height:16px;accent-color:#7c5cff">
        <span class="text-sm font-bold" style="color:#c4b5fd"><i class="fa-solid fa-user-doctor mr-1"></i>Ya tengo mi propio plan (de mi nutriólogo)</span>
      </label>
      <p class="text-[11px] mt-1 mb-2" style="color:#8b92b0">Si lo activas, usamos TUS números y las recetas se filtran con ellos. Lo calculado queda solo de referencia.</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>${lb('Calorías')}<input id="nu-ccal" type="number" value="${p.custom_calories||''}" placeholder="1800" style="${inS}"></div>
        <div>${lb('Proteína (g)')}<input id="nu-cprot" type="number" value="${p.custom_protein_g||''}" placeholder="130" style="${inS}"></div>
        <div>${lb('Carbos (g)')}<input id="nu-ccarb" type="number" value="${p.custom_carbs_g||''}" placeholder="180" style="${inS}"></div>
        <div>${lb('Grasas (g)')}<input id="nu-cfat" type="number" value="${p.custom_fat_g||''}" placeholder="60" style="${inS}"></div>
      </div>
    </div>
    <div class="flex gap-2 mt-3">
      <button onclick="saveNutritionProfile()" class="text-xs font-bold px-4 py-2 rounded-lg" style="background:#34d399;color:#06281e"><i class="fa-solid fa-check mr-1"></i>Guardar</button>
      <button onclick="toggleNutritionEdit(false)" class="text-xs font-bold px-4 py-2 rounded-lg" style="background:#222842;color:#b2b9d4">Cancelar</button>
      <span id="nutrition-edit-msg" class="text-xs self-center" style="color:#ef4444"></span>
    </div>`;
}
function toggleNutritionEdit(show){
  const form = document.getElementById('nutrition-edit-form');
  if(form) form.classList.toggle('hidden', !show);
}
async function saveNutritionProfile(){
  const msg = document.getElementById('nutrition-edit-msg');
  try {
    const supa = window.FMAuth.getClient();
    const { data: { user } } = await supa.auth.getUser();
    if(!user) throw new Error('No hay sesión');
    const v = (id)=>{ const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const payload = {
      diet_pattern: v('nu-pattern') || null,
      diet_style: v('nu-style') || null,
      meals_per_day: +v('nu-meals') || null,
      fasting_protocol: v('nu-fasting') || null,
      eating_window: v('nu-window') || null,
      nutrition_pace: v('nu-pace') || null,
      spice_level: v('nu-spice') || null,
      cook_time: v('nu-cooktime') || null,
      cook_skill: v('nu-cookskill') || null,
      budget_tier: v('nu-budget') || null,
      country: v('nu-country') || null,
      allergies: v('nu-allergies') || null,
      intolerances: v('nu-intol') || null,
      dislikes: v('nu-dislikes') || null,
      cuisine: v('nu-cuisine') || null,
      kitchen_equipment: v('nu-equip') || null,
      medical_flags: v('nu-medical') || null,
      use_custom_plan: !!(document.getElementById('nu-usecustom') && document.getElementById('nu-usecustom').checked),
      custom_calories: +v('nu-ccal') || null,
      custom_protein_g: +v('nu-cprot') || null,
      custom_carbs_g: +v('nu-ccarb') || null,
      custom_fat_g: +v('nu-cfat') || null,
      nutrition_done: true
    };
    const { error } = await supa.from('profiles').update(payload).eq('id', user.id);
    if(error) throw error;
    loadProfileData();
  } catch(err){
    console.error(err);
    if(msg) msg.textContent = 'No se pudo guardar: ' + (err.message||err);
  }
}
window.toggleNutritionEdit = toggleNutritionEdit;
window.saveNutritionProfile = saveNutritionProfile;

window.openProfileModal = openProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.switchProfileTab = switchProfileTab;
  window.handlePhotoUpload = handlePhotoUpload;
  window.deletePhoto = deletePhoto;
  window.setTheme = setTheme;
  window.setPrimaryColor = setPrimaryColor;
}
