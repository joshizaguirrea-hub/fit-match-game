/* ============================================================
   Fit Match · Sistema de Perfil de Usuario
   ------------------------------------------------------------
   Sistema de perfil con estadísticas, logros, fotos de avance,
   mejor FIT-BRO y personalización del sitio.
   ============================================================ */

// Variables globales del perfil
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
        <div class="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
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
                  <button onclick="setTheme('default')" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 border-4 border-gray-900"></button>
                  <button onclick="setTheme('dark')" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-transparent hover:border-gray-400"></button>
                  <button onclick="setTheme('ocean')" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-transparent hover:border-gray-400"></button>
                  <button onclick="setTheme('forest')" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-transparent hover:border-gray-400"></button>
                  <button onclick="setTheme('sunset')" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-4 border-transparent hover:border-gray-400"></button>
                </div>
              </div>

              <div>
                <h3 class="font-bold mb-3" style="color:#eceefb">Color Principal</h3>
                <div class="flex gap-3">
                  <button onclick="setPrimaryColor('#ec4899')" class="w-10 h-10 rounded-full bg-pink-500 border-2 border-gray-900"></button>
                  <button onclick="setPrimaryColor('#8b5cf6')" class="w-10 h-10 rounded-full bg-purple-500 border-2 border-transparent hover:border-gray-400"></button>
                  <button onclick="setPrimaryColor('#3b82f6')" class="w-10 h-10 rounded-full bg-blue-500 border-2 border-transparent hover:border-gray-400"></button>
                  <button onclick="setPrimaryColor('#10b981')" class="w-10 h-10 rounded-full bg-green-500 border-2 border-transparent hover:border-gray-400"></button>
                  <button onclick="setPrimaryColor('#f59e0b')" class="w-10 h-10 rounded-full bg-amber-500 border-2 border-transparent hover:border-gray-400"></button>
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
    // Usuario logueado
    const { data: { user } } = await supabase.auth.getUser();
    // A quién mostramos: si nos pasan targetUserId es un amigo; si no, soy yo
    const viewingId = targetUserId || (user && user.id);
    if (!viewingId) return;
    const isOwn = !targetUserId || (user && targetUserId === user.id);

    // Ocultar pestañas que solo aplican a TU propio perfil cuando ves a un amigo
    const tabPhotos = document.querySelector('.profile-tab[data-tab="photos"]');
    const tabCustom = document.querySelector('.profile-tab[data-tab="customization"]');
    if (tabPhotos) tabPhotos.style.display = isOwn ? '' : 'none';
    if (tabCustom) tabCustom.style.display = isOwn ? '' : 'none';

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

// Función para establecer tema
function setTheme(theme) {
  userProfile.customization.theme = theme;
  // Aplicar tema (implementación futura)
  document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('border-gray-900'));
  event.target.classList.add('border-gray-900');
}

// Función para establecer color principal
function setPrimaryColor(color) {
  userProfile.customization.primaryColor = color;
  // Aplicar color (implementación futura)
}

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

window.openProfileModal = openProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.switchProfileTab = switchProfileTab;
  window.handlePhotoUpload = handlePhotoUpload;
  window.deletePhoto = deletePhoto;
  window.setTheme = setTheme;
  window.setPrimaryColor = setPrimaryColor;
}
