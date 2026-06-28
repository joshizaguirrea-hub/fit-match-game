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
function openProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (!modal) {
    createProfileModal();
  }
  
  loadProfileData();
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
      <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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
          <div class="flex gap-2 mb-6 border-b border-gray-200">
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
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl text-center">
                <i class="fa-solid fa-clock text-2xl text-purple-600 mb-2"></i>
                <p class="text-3xl font-bold text-gray-900" id="stat-hours">0</p>
                <p class="text-xs text-gray-600 font-semibold">Horas Totales</p>
              </div>
              <div class="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-2xl text-center">
                <i class="fa-solid fa-calendar-check text-2xl text-pink-600 mb-2"></i>
                <p class="text-3xl font-bold text-gray-900" id="stat-days">0</p>
                <p class="text-xs text-gray-600 font-semibold">Días Entrenando</p>
              </div>
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-center">
                <i class="fa-solid fa-dumbbell text-2xl text-blue-600 mb-2"></i>
                <p class="text-3xl font-bold text-gray-900" id="stat-routines">0</p>
                <p class="text-xs text-gray-600 font-semibold">Rutinas Completadas</p>
              </div>
              <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-2xl text-center">
                <i class="fa-solid fa-bolt text-2xl text-yellow-600 mb-2"></i>
                <p class="text-3xl font-bold text-gray-900" id="stat-points">0</p>
                <p class="text-xs text-gray-600 font-semibold">Puntos Totales</p>
              </div>
            </div>

            <!-- Gráfico de Actividad Reciente -->
            <div class="bg-gray-50 rounded-2xl p-4">
              <h3 class="font-bold text-gray-900 mb-4">Actividad Reciente</h3>
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
                <h3 class="font-bold text-gray-900 mb-3">Tema del Sitio</h3>
                <div class="flex gap-3">
                  <button onclick="setTheme('default')" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 border-4 border-gray-900"></button>
                  <button onclick="setTheme('dark')" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-transparent hover:border-gray-400"></button>
                  <button onclick="setTheme('ocean')" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-transparent hover:border-gray-400"></button>
                  <button onclick="setTheme('forest')" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-transparent hover:border-gray-400"></button>
                  <button onclick="setTheme('sunset')" class="theme-btn w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-4 border-transparent hover:border-gray-400"></button>
                </div>
              </div>

              <div>
                <h3 class="font-bold text-gray-900 mb-3">Color Principal</h3>
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
async function loadProfileData() {
  try {
    // Obtener datos del usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Obtener nickname y puntos
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      document.getElementById('profile-nickname').textContent = profile.nickname || 'Usuario';
      
      const rank = window.getMilitaryRank ? window.getMilitaryRank(profile.total_points || 0) : 'Recluta';
      document.getElementById('profile-rank').textContent = rank;
    }

    // Obtener workouts del usuario
    const { data: workouts } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id);

    // Calcular estadísticas
    const stats = calculateUserStats(workouts || []);
    
    document.getElementById('stat-hours').textContent = stats.totalHours;
    document.getElementById('stat-days').textContent = stats.totalDays;
    document.getElementById('stat-routines').textContent = stats.routinesCompleted;
    document.getElementById('stat-points').textContent = stats.totalPoints;
    document.getElementById('profile-streak').textContent = stats.currentStreak;

    // Cargar logros
    loadAchievements(workouts || [], stats.totalPoints);

    // Cargar fotos
    loadPhotos(user.id);

    // Cargar mejor FIT-BRO
    loadBestFitBro(user, profile);

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
  window.openProfileModal = openProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.switchProfileTab = switchProfileTab;
  window.handlePhotoUpload = handlePhotoUpload;
  window.deletePhoto = deletePhoto;
  window.setTheme = setTheme;
  window.setPrimaryColor = setPrimaryColor;
}
