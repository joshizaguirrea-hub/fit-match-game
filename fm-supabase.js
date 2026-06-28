/* ============================================================
   FIT MATCH · Conexion con Supabase (Etapa A: Login)
   ------------------------------------------------------------
   PASO UNICO QUE DEBES HACER TU:
   Reemplaza los 2 valores de abajo con los de TU proyecto.
   Los encuentras en: Supabase -> Project Settings -> API
     - Project URL      -> SUPABASE_URL
     - anon public key  -> SUPABASE_ANON_KEY
   (La "anon key" es publica y segura para el navegador.
    NUNCA pegues aqui la "service_role" key.)
   ============================================================ */

const SUPABASE_URL      = "https://ebclaayqkcnigelfabhg.supabase.co";   // ej: https://abcdxyz.supabase.co
const SUPABASE_ANON_KEY = "sb_publishable_zOxWd3cSJdQg797rSq-pAw_-XTt7Ux_";      // ej: eyJhbGciOi... (cadena larga)

/* ------------------------------------------------------------
   De aqui para abajo NO toques nada (lo maneja Horus).
   Requiere cargar antes la libreria:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ------------------------------------------------------------ */
window.FMAuth = (function(){
  let client = null;
  function ready(){
    if(SUPABASE_URL.startsWith("PEGA_AQUI") || SUPABASE_ANON_KEY.startsWith("PEGA_AQUI")){
      console.warn("[FitMatch] Falta configurar SUPABASE_URL / SUPABASE_ANON_KEY en fm-supabase.js");
      return false;
    }
    if(!window.supabase){ console.warn("[FitMatch] Falta cargar supabase-js"); return false; }
    if(!client) client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return true;
  }
  return {
    // login passwordless por correo (magic link). Horus completara el flujo en la Etapa A.
    isConfigured: ()=> !(SUPABASE_URL.startsWith("PEGA_AQUI") || SUPABASE_ANON_KEY.startsWith("PEGA_AQUI")),
    getClient: ()=> ready() ? client : null,
  };
})();
