/* ============================================================
 * fm-shop-data.js - Catalogo de la Tienda (FitCoins): temas,
 * titulos y consumibles. DATOS separados de la logica de tienda
 * (que sigue en jugar.html). Expone window.FM_SHOP.
 * ============================================================ */
window.FM_SHOP = {
  themes: [
    { id:'theme_default', name:'Cl\u00e1sico', price:0, desc:'El look original', vars:{ '--bg':'#0f1117','--surface':'#181c2a','--surface2':'#222842','--border':'#2c3350','--txt':'#eceefb','--txt-soft':'#b2b9d4','--txt-mut':'#8b92b0' } },
    { id:'theme_light', name:'Claro', price:0, desc:'Fondo claro, letras oscuras', vars:{ '--bg':'#f4f5fb','--surface':'#ffffff','--surface2':'#e9ecf6','--border':'#d3d8ea','--txt':'#1a1d2b','--txt-soft':'#4a5069','--txt-mut':'#6b7290' } },
    { id:'theme_neon', name:'Noche Ne\u00f3n', price:200, desc:'Morado y cian vibrantes', vars:{ '--bg':'#0a0a16','--surface':'#141433','--surface2':'#1f1f4d','--border':'#3a2f6b','--txt':'#f0eaff','--txt-soft':'#c3b8ee','--txt-mut':'#8f86c9' } },
    { id:'theme_gold', name:'Dios Griego', price:300, desc:'Oro sobre m\u00e1rmol oscuro', vars:{ '--bg':'#12100a','--surface':'#211d12','--surface2':'#302915','--border':'#4d3f1f','--txt':'#fff4d6','--txt-soft':'#e8d4a0','--txt-mut':'#b89a5e' } },
    { id:'theme_ocean', name:'Oc\u00e9ano', price:200, desc:'Azules profundos', vars:{ '--bg':'#081420','--surface':'#0f2333','--surface2':'#163348','--border':'#1f4a63','--txt':'#e0f2ff','--txt-soft':'#a8d3ea','--txt-mut':'#6fa3bf' } },
    { id:'theme_forest', name:'Bosque', price:200, desc:'Verdes de la selva', vars:{ '--bg':'#0a140d','--surface':'#122318','--surface2':'#1a3323','--border':'#274a33','--txt':'#e6f5ea','--txt-soft':'#aed6bb','--txt-mut':'#71a082' } },
    { id:'theme_sakura', name:'Sakura', price:250, desc:'Rosa suave', vars:{ '--bg':'#1a0e14','--surface':'#2b1620','--surface2':'#3d1f2e','--border':'#5c2f45','--txt':'#ffe6f0','--txt-soft':'#eeb8ce','--txt-mut':'#c47f9d' } }
  ],
  titles: [
    { id:'title_bestia', name:'La Bestia', price:100 },
    { id:'title_imparable', name:'El Imparable', price:100 },
    { id:'title_maquina', name:'La M\u00e1quina', price:120 },
    { id:'title_reygym', name:'Rey del Gym', price:150 },
    { id:'title_espartano', name:'Espartano', price:200 },
    { id:'title_leyenda', name:'Leyenda Viva', price:300 }
  ],
  consumables: [
    { id:'boost_x2', token:'boost', name:'Boost x2 PX', price:150, icon:'fa-bolt', color:'#f59e0b', desc:'Duplica los puntos de tu PR\u00d3XIMO entreno.' },
    { id:'freeze', token:'freeze', name:'Congelar Racha', price:200, icon:'fa-snowflake', color:'#38bdf8', desc:'Si faltas un d\u00eda, tu racha no se rompe. Se usa autom\u00e1ticamente.' }
  ]
};

