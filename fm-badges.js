/* ============================================================
   Fit Match · Sistema de Insignias y Especialidades
   ------------------------------------------------------------
   Sistema de insignias basado en las rutinas completadas por categoría.
   Cada usuario puede ganar insignias por especialidad según su progreso.
   ============================================================ */

const FM_BADGES = {
  // Insignias por Categoría de Gimnasio
  gimnasio: {
    beginner: { name: "Novato del Hierro", icon: "fa-dumbbell", color: "bg-gray-500", requirement: 50, description: "Completaste 50 puntos en rutinas de gimnasio" },
    intermediate: { name: "Levantador", icon: "fa-weight-hanging", color: "bg-blue-500", requirement: 150, description: "Completaste 150 puntos en rutinas de gimnasio" },
    advanced: { name: "Fuerza Pura", icon: "fa-dumbbell", color: "bg-purple-500", requirement: 300, description: "Completaste 300 puntos en rutinas de gimnasio" },
    elite: { name: "Titán del Gimnasio", icon: "fa-crown", color: "bg-yellow-500", requirement: 500, description: "Completaste 500 puntos en rutinas de gimnasio" }
  },
  // Insignias por Categoría de Yoga
  yoga: {
    beginner: { name: "Iniciado Zen", icon: "fa-spa", color: "bg-green-500", requirement: 30, description: "Completaste 30 puntos en rutinas de yoga" },
    intermediate: { name: "Flujo Sereno", icon: "fa-om", color: "bg-teal-500", requirement: 100, description: "Completaste 100 puntos en rutinas de yoga" },
    advanced: { name: "Maestro del Equilibrio", icon: "fa-yin-yang", color: "bg-indigo-500", requirement: 200, description: "Completaste 200 puntos en rutinas de yoga" },
    elite: { name: "Gurú Supremo", icon: "fa-spa", color: "bg-pink-500", requirement: 350, description: "Completaste 350 puntos en rutinas de yoga" }
  },
  // Insignias por Categoría de Pilates
  pilates: {
    beginner: { name: "Core Iniciado", icon: "fa-person-running", color: "bg-orange-500", requirement: 30, description: "Completaste 30 puntos en rutinas de pilates" },
    intermediate: { name: "Control Maestro", icon: "fa-child-reaching", color: "bg-amber-500", requirement: 100, description: "Completaste 100 puntos en rutinas de pilates" },
    advanced: { name: "Pilates Pro", icon: "fa-person-running", color: "bg-red-500", requirement: 200, description: "Completaste 200 puntos en rutinas de pilates" },
    elite: { name: "Maestro Joseph", icon: "fa-award", color: "bg-rose-500", requirement: 350, description: "Completaste 350 puntos en rutinas de pilates" }
  },
  // Insignias por Categoría de Cardio
  cardio: {
    beginner: { name: "Corazón Activo", icon: "fa-heart-pulse", color: "bg-red-500", requirement: 40, description: "Completaste 40 puntos en rutinas de cardio" },
    intermediate: { name: "Máquina Cardio", icon: "fa-heart", color: "bg-pink-500", requirement: 120, description: "Completaste 120 puntos en rutinas de cardio" },
    advanced: { name: "Resistencia Infinita", icon: "fa-fire", color: "bg-orange-500", requirement: 250, description: "Completaste 250 puntos en rutinas de cardio" },
    elite: { name: "Cardio Legend", icon: "fa-bolt", color: "bg-yellow-500", requirement: 400, description: "Completaste 400 puntos en rutinas de cardio" }
  },
  // Insignias por Categoría de Calistenia
  calistenia: {
    beginner: { name: "Peso Corporal", icon: "fa-person-praying", color: "bg-cyan-500", requirement: 40, description: "Completaste 40 puntos en rutinas de calistenia" },
    intermediate: { name: "Dominio del Cuerpo", icon: "fa-hand-fist", color: "bg-blue-500", requirement: 120, description: "Completaste 120 puntos en rutinas de calistenia" },
    advanced: { name: "Bestia Calisténica", icon: "fa-dragon", color: "bg-purple-500", requirement: 250, description: "Completaste 250 puntos en rutinas de calistenia" },
    elite: { name: "Maestro Gravitacional", icon: "fa-crown", color: "bg-yellow-500", requirement: 400, description: "Completaste 400 puntos en rutinas de calistenia" }
  },
  // Insignias por Categoría de Hipopresivos
  hipopresivos: {
    beginner: { name: "Iniciada Hipopresiva", icon: "fa-baby", color: "bg-pink-400", requirement: 30, description: "Completaste 30 puntos en rutinas de hipopresivos" },
    intermediate: { name: "Maestra del Transverso", icon: "fa-heart", color: "bg-rose-500", requirement: 100, description: "Completaste 100 puntos en rutinas de hipopresivos" },
    advanced: { name: "Reina del Suelo Pélvico", icon: "fa-crown", color: "bg-fuchsia-500", requirement: 200, description: "Completaste 200 puntos en rutinas de hipopresivos" },
    elite: { name: "Gurú Hipopresivo", icon: "fa-star", color: "bg-purple-500", requirement: 350, description: "Completaste 350 puntos en rutinas de hipopresivos" }
  },
  // Insignias por Culturas (Dioses)
  culturas: {
    Grecia: { name: "Héroe Olímpico", icon: "fa-landmark", color: "bg-blue-400", requirement: 100, description: "Completaste 100 puntos en rutinas griegas" },
    "Nórdicos": { name: "Guerrero Vikingo", icon: "fa-snowflake", color: "bg-cyan-400", requirement: 100, description: "Completaste 100 puntos en rutinas nórdicas" },
    Egipto: { name: "Faraón del Fitness", icon: "fa-pyramid", color: "bg-yellow-400", requirement: 100, description: "Completaste 100 puntos en rutinas egipcias" },
    China: { name: "Maestro Shaolin", icon: "fa-dragon", color: "bg-red-400", requirement: 100, description: "Completaste 100 puntos en rutinas chinas" },
    Japón: { name: "Samurái del Acero", icon: "fa-torii-gate", color: "bg-pink-400", requirement: 100, description: "Completaste 100 puntos en rutinas japonesas" },
    Mongoles: { name: "Conquistador de Estepas", icon: "fa-horse", color: "bg-amber-400", requirement: 100, description: "Completaste 100 puntos en rutinas mongoles" },
    Mayas: { name: "Guardián de la Selva", icon: "fa-tree", color: "bg-green-400", requirement: 100, description: "Completaste 100 puntos en rutinas mayas" },
    Aztecas: { name: "Guerrero Águila", icon: "fa-feather", color: "bg-orange-400", requirement: 100, description: "Completaste 100 puntos en rutinas aztecas" },
    Incas: { name: "Hijo del Sol", icon: "fa-sun", color: "bg-yellow-500", requirement: 100, description: "Completaste 100 puntos en rutinas incas" }
  },
  // Insignias de EQUIPO (por numero de salas grupales completadas)
  equipo: {
    team1: { name: "Entrené en equipo", icon: "fa-people-group", color: "bg-teal-500", requirement: 1, description: "Completaste tu primera sala de entrenamiento grupal" },
    team5: { name: "Compañero de Batalla", icon: "fa-people-group", color: "bg-cyan-500", requirement: 5, description: "Completaste 5 salas grupales" },
    team15: { name: "Líder de Manada", icon: "fa-crown", color: "bg-purple-500", requirement: 15, description: "Completaste 15 salas grupales" },
    team30: { name: "Leyenda del Clan", icon: "fa-shield-halved", color: "bg-yellow-500", requirement: 30, description: "Completaste 30 salas grupales" }
  }
};

// Función para calcular puntos por categoría
function calculateCategoryPoints(workouts, categoryType) {
  if (!workouts || !Array.isArray(workouts)) return 0;
  
  let totalPoints = 0;
  
  if (categoryType === 'culturas') {
    // Para culturas, buscar en FMRoutines
    const routines = window.FMRoutines || [];
    workouts.forEach(workout => {
      const routine = routines.find(r => r.id === workout.routine_id);
      if (routine && routine.culture) {
        totalPoints += workout.puntos || 0;
      }
    });
  } else {
    // Para categorías especializadas, buscar en FMSpecializedRoutines
    const specializedRoutines = window.FMSpecializedRoutines || [];
    workouts.forEach(workout => {
      const routine = specializedRoutines.find(r => r.id === workout.routine_id);
      if (routine && routine.category === categoryType) {
        totalPoints += workout.puntos || 0;
      }
    });
  }
  
  return totalPoints;
}

// Función para obtener insignias ganadas
function getEarnedBadges(workouts) {
  const earnedBadges = [];
  
  // Verificar insignias de categorías especializadas
  const categories = ['gimnasio', 'yoga', 'pilates', 'cardio', 'calistenia', 'hipopresivos'];
  categories.forEach(category => {
    const points = calculateCategoryPoints(workouts, category);
    const categoryBadges = FM_BADGES[category];
    
    Object.keys(categoryBadges).forEach(level => {
      const badge = categoryBadges[level];
      if (points >= badge.requirement) {
        earnedBadges.push({
          ...badge,
          category: category,
          level: level,
          currentPoints: points
        });
      }
    });
  });
  
  // Verificar insignias de culturas
  const cultures = ['Grecia', 'Nórdicos', 'Egipto', 'China', 'Japón', 'Mongoles', 'Mayas', 'Aztecas', 'Incas'];
  cultures.forEach(culture => {
    const cultureWorkouts = workouts.filter(w => {
      const routine = (window.FMRoutines || []).find(r => r.id === w.routine_id);
      return routine && routine.culture === culture;
    });
    const points = cultureWorkouts.reduce((sum, w) => sum + (w.puntos || 0), 0);
    
    const cultureBadge = FM_BADGES.culturas[culture];
    if (points >= cultureBadge.requirement) {
      earnedBadges.push({
        ...cultureBadge,
        category: 'culturas',
        subcategory: culture,
        level: 'master',
        currentPoints: points
      });
    }
  });
  
  // Insignias de EQUIPO (por numero de salas grupales completadas)
  const teamCount = (workouts || []).filter(w => w.modo === 'sala' && (w.puntos || 0) > 0).length;
  const teamBadges = FM_BADGES.equipo || {};
  Object.keys(teamBadges).forEach(level => {
    const badge = teamBadges[level];
    if (teamCount >= badge.requirement) {
      earnedBadges.push({ ...badge, category: 'equipo', level: level, currentPoints: teamCount });
    }
  });
  
  return earnedBadges;
}

// Función para obtener la especialidad principal del usuario
function getMainSpecialty(workouts) {
  const categories = ['gimnasio', 'yoga', 'pilates', 'cardio', 'calistenia', 'hipopresivos'];
  let maxPoints = 0;
  let mainSpecialty = null;
  
  categories.forEach(category => {
    const points = calculateCategoryPoints(workouts, category);
    if (points > maxPoints) {
      maxPoints = points;
      mainSpecialty = category;
    }
  });
  
  // También verificar culturas
  const cultures = ['Grecia', 'Nórdicos', 'Egipto', 'China', 'Japón', 'Mongoles', 'Mayas', 'Aztecas', 'Incas'];
  cultures.forEach(culture => {
    const cultureWorkouts = workouts.filter(w => {
      const routine = (window.FMRoutines || []).find(r => r.id === w.routine_id);
      return routine && routine.culture === culture;
    });
    const points = cultureWorkouts.reduce((sum, w) => sum + (w.puntos || 0), 0);
    
    if (points > maxPoints) {
      maxPoints = points;
      mainSpecialty = culture;
    }
  });
  
  return mainSpecialty ? { specialty: mainSpecialty, points: maxPoints } : null;
}

// Exponer funciones en el ambiente global
if (typeof window !== "undefined") {
  window.FMBadges = FM_BADGES;
  window.calculateCategoryPoints = calculateCategoryPoints;
  window.getEarnedBadges = getEarnedBadges;
  window.getMainSpecialty = getMainSpecialty;
}
