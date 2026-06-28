/* ============================================================
   Fit Match · Sistema de Logros y Streaks
   ------------------------------------------------------------
   Sistema de logros basado en consistencia y milestones.
   Incluye rachas de entrenamiento (streaks) y logros especiales.
   ============================================================ */

const FM_ACHIEVEMENTS = {
  // Logros de Consistencia (Streaks)
  streaks: {
    first_workout: { 
      name: "Primer Paso", 
      icon: "fa-shoe-prints", 
      color: "bg-green-500", 
      requirement: 1, 
      description: "Completaste tu primer entrenamiento",
      type: "streak"
    },
    three_day_streak: { 
      name: "En Marcha", 
      icon: "fa-fire", 
      color: "bg-orange-500", 
      requirement: 3, 
      description: "3 días consecutivos de entrenamiento",
      type: "streak"
    },
    week_streak: { 
      name: "Semana Perfecta", 
      icon: "fa-calendar-week", 
      color: "bg-blue-500", 
      requirement: 7, 
      description: "7 días consecutivos de entrenamiento",
      type: "streak"
    },
    two_week_streak: { 
      name: "Máquina de Guerra", 
      icon: "fa-dumbbell", 
      color: "bg-purple-500", 
      requirement: 14, 
      description: "14 días consecutivos de entrenamiento",
      type: "streak"
    },
    month_streak: { 
      name: "Leyenda de Consistencia", 
      icon: "fa-crown", 
      color: "bg-yellow-500", 
      requirement: 30, 
      description: "30 días consecutivos de entrenamiento",
      type: "streak"
    }
  },
  
  // Logros de Volumen Total
  volume: {
    fifty_points: { 
      name: "Medio Siglo", 
      icon: "fa-medal", 
      color: "bg-gray-400", 
      requirement: 50, 
      description: "Alcanzaste 50 puntos totales",
      type: "volume"
    },
    hundred_points: { 
      name: "Centurión", 
      icon: "fa-trophy", 
      color: "bg-amber-500", 
      requirement: 100, 
      description: "Alcanzaste 100 puntos totales",
      type: "volume"
    },
    five_hundred_points: { 
      name: "Medio Millar", 
      icon: "fa-star", 
      color: "bg-purple-500", 
      requirement: 500, 
      description: "Alcanzaste 500 puntos totales",
      type: "volume"
    },
    thousand_points: { 
      name: "Milenio", 
      icon: "fa-crown", 
      color: "bg-yellow-500", 
      requirement: 1000, 
      description: "Alcanzaste 1000 puntos totales",
      type: "volume"
    }
  },
  
  // Logros Especiales
  special: {
    early_bird: { 
      name: "Madrugador", 
      icon: "fa-sun", 
      color: "bg-yellow-400", 
      requirement: "before_8am", 
      description: "Entrenaste antes de las 8 AM",
      type: "special"
    },
    night_owl: { 
      name: "Búho Nocturno", 
      icon: "fa-moon", 
      color: "bg-indigo-500", 
      requirement: "after_10pm", 
      description: "Entrenaste después de las 10 PM",
      type: "special"
    },
    variety_master: { 
      name: "Maestro de la Variedad", 
      icon: "fa-palette", 
      color: "bg-pink-500", 
      requirement: 5, 
      description: "Completaste rutinas de 5 categorías diferentes",
      type: "special"
    },
    culture_explorer: { 
      name: "Explorador de Culturas", 
      icon: "fa-globe", 
      color: "bg-cyan-500", 
      requirement: 5, 
      description: "Completaste rutinas de 5 culturas diferentes",
      type: "special"
    },
    speed_demon: { 
      name: "Demonio de Velocidad", 
      icon: "fa-bolt", 
      color: "bg-red-500", 
      requirement: "under_10min", 
      description: "Completaste una rutina en menos de 10 minutos",
      type: "special"
    },
    endurance_beast: { 
      name: "Bestia de Resistencia", 
      icon: "fa-heart-pulse", 
      color: "bg-red-600", 
      requirement: "over_60min", 
      description: "Completaste una rutina de más de 60 minutos",
      type: "special"
    }
  }
};

// Función para calcular el streak actual
function calculateCurrentStreak(workouts) {
  if (!workouts || !Array.isArray(workouts) || workouts.length === 0) return 0;
  
  // Ordenar workouts por fecha descendente
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (let i = 0; i < sortedWorkouts.length; i++) {
    const workoutDate = new Date(sortedWorkouts[i].created_at);
    workoutDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Mismo día - contar como streak
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (diffDays === 1) {
      // Día anterior - continuar streak
      streak++;
      currentDate = workoutDate;
    } else if (diffDays > 1) {
      // Rompió el streak
      break;
    }
  }
  
  return streak;
}

// Función para calcular el streak más largo (best streak)
function calculateBestStreak(workouts) {
  if (!workouts || !Array.isArray(workouts) || workouts.length === 0) return 0;
  
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(a.created_at) - new Date(b.created_at)
  );
  
  let bestStreak = 0;
  let currentStreak = 0;
  let lastDate = null;
  
  sortedWorkouts.forEach(workout => {
    const workoutDate = new Date(workout.created_at);
    workoutDate.setHours(0, 0, 0, 0);
    
    if (!lastDate) {
      currentStreak = 1;
      lastDate = workoutDate;
    } else {
      const diffDays = Math.floor((workoutDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0 || diffDays === 1) {
        if (diffDays === 1) {
          currentStreak++;
        }
        lastDate = workoutDate;
      } else {
        // Rompió el streak
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }
        currentStreak = 1;
        lastDate = workoutDate;
      }
    }
  });
  
  // Verificar el último streak
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }
  
  return bestStreak;
}

// Función para obtener logros ganados
function getEarnedAchievements(workouts, totalPoints) {
  const earnedAchievements = [];
  
  // Calcular streaks
  const currentStreak = calculateCurrentStreak(workouts);
  const bestStreak = calculateBestStreak(workouts);
  
  // Verificar logros de streak
  Object.keys(FM_ACHIEVEMENTS.streaks).forEach(key => {
    const achievement = FM_ACHIEVEMENTS.streaks[key];
    if (bestStreak >= achievement.requirement) {
      earnedAchievements.push({
        ...achievement,
        id: key,
        currentStreak: currentStreak,
        bestStreak: bestStreak
      });
    }
  });
  
  // Verificar logros de volumen
  Object.keys(FM_ACHIEVEMENTS.volume).forEach(key => {
    const achievement = FM_ACHIEVEMENTS.volume[key];
    if (totalPoints >= achievement.requirement) {
      earnedAchievements.push({
        ...achievement,
        id: key,
        currentPoints: totalPoints
      });
    }
  });
  
  // Verificar logros especiales
  const uniqueCategories = new Set();
  const uniqueCultures = new Set();
  
  workouts.forEach(workout => {
    // Verificar categoría especializada
    const specializedRoutine = (window.FMSpecializedRoutines || []).find(r => r.id === workout.routine_id);
    if (specializedRoutine) {
      uniqueCategories.add(specializedRoutine.category);
    }
    
    // Verificar cultura
    const godRoutine = (window.FMRoutines || []).find(r => r.id === workout.routine_id);
    if (godRoutine) {
      uniqueCultures.add(godRoutine.culture);
    }
    
    // Verificar horarios
    const workoutDate = new Date(workout.created_at);
    const hour = workoutDate.getHours();
    
    if (hour < 8) {
      earnedAchievements.push({
        ...FM_ACHIEVEMENTS.special.early_bird,
        id: 'early_bird'
      });
    }
    
    if (hour >= 22) {
      earnedAchievements.push({
        ...FM_ACHIEVEMENTS.special.night_owl,
        id: 'night_owl'
      });
    }
    
    // Verificar duración (si existe el campo)
    if (workout.duration_seconds) {
      if (workout.duration_seconds < 600) {
        earnedAchievements.push({
          ...FM_ACHIEVEMENTS.special.speed_demon,
          id: 'speed_demon'
        });
      }
      if (workout.duration_seconds > 3600) {
        earnedAchievements.push({
          ...FM_ACHIEVEMENTS.special.endurance_beast,
          id: 'endurance_beast'
        });
      }
    }
  });
  
  // Verificar variedad
  if (uniqueCategories.size >= 5) {
    earnedAchievements.push({
      ...FM_ACHIEVEMENTS.special.variety_master,
      id: 'variety_master',
      categories: Array.from(uniqueCategories)
    });
  }
  
  if (uniqueCultures.size >= 5) {
    earnedAchievements.push({
      ...FM_ACHIEVEMENTS.special.culture_explorer,
      id: 'culture_explorer',
      cultures: Array.from(uniqueCultures)
    });
  }
  
  // Eliminar duplicados
  const uniqueAchievements = [];
  const seenIds = new Set();
  
  earnedAchievements.forEach(achievement => {
    if (!seenIds.has(achievement.id)) {
      seenIds.add(achievement.id);
      uniqueAchievements.push(achievement);
    }
  });
  
  return uniqueAchievements;
}

// Función para obtener el nivel de consistencia
function getConsistencyLevel(workouts) {
  const bestStreak = calculateBestStreak(workouts);
  
  if (bestStreak >= 30) return { level: "Leyenda", color: "bg-yellow-500", icon: "fa-crown" };
  if (bestStreak >= 14) return { level: "Guerrero", color: "bg-purple-500", icon: "fa-shield-halved" };
  if (bestStreak >= 7) return { level: "Atleta", color: "bg-blue-500", icon: "fa-medal" };
  if (bestStreak >= 3) return { level: "Novato", color: "bg-green-500", icon: "fa-seedling" };
  return { level: "Principiante", color: "bg-gray-400", icon: "fa-person" };
}

// Exponer funciones en el ambiente global
if (typeof window !== "undefined") {
  window.FMAchievements = FM_ACHIEVEMENTS;
  window.calculateCurrentStreak = calculateCurrentStreak;
  window.calculateBestStreak = calculateBestStreak;
  window.getEarnedAchievements = getEarnedAchievements;
  window.getConsistencyLevel = getConsistencyLevel;
}
