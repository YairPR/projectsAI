# Copa Mundial 2026 - Predictor & Simulador Glassmórfico Premium

Este proyecto es una aplicación web interactiva y premium (React + TypeScript + Vite + CSS puro) diseñada para simular enfrentamientos de la Copa Mundial FIFA 2026 y pronosticar probabilidades de juego basándose en modelos estadísticos avanzados (distribución de Poisson) e indicadores macroeconómicos (el modelo econométrico de Joachim Klement).

---

## 🎨 Características Destacadas (Diseño Premium)

- **Diseño Glassmorphic**: Interfaz futurista y fluida con vidrio esmerilado, luces de neón cian, violeta y verde fluorescente, y transiciones dinámicas.
- **Predictor Sidebar (1v1)**: Controles deslizantes interactivos para ajustar la `Forma`, `Valor de Plantilla`, `Historial`, `Localía` y `Clima` de los equipos, recalculando las probabilidades de victoria en tiempo real.
- **Knockout Bracket Tree**: Conectores brillantes interactivos para simular las fases de eliminación directa y visualizar el camino a la gran final.
- **Player Analysis (Radar SVG)**: Análisis táctico individualizado de estrellas (como Lionel Messi) mediante un gráfico de radar hexagonal interactivo en SVG con brillo de neón.
- **Alineaciones de Último Minuto**: Gestor de alineaciones titulares y de banca. Benchar o alinear jugadores clave (así como cambiar la formación táctica de 4-3-3 a 5-4-1) recalcula de inmediato las probabilidades y los mercados del partido.
- **Centro de Apuestas (Parlays Combinados)**: Boleto flotante para simular cuotas acumuladas (parlays), correlación de apuestas, y verificar instantáneamente si un boleto resulta ganador o perdedor en base al motor local.

---

## ⚙️ DevOps: Sincronización en Tiempo Real & Despliegue en GitHub

La aplicación está preparada para ser alojada de forma estática y gratuita en tu repositorio de GitHub: `https://github.com/YairPR/projectsAI`.

### 1. Despliegue Automático (GitHub Pages)
Cada vez que hagas un `push` a la rama `main` o `master`, el archivo de workflow `.github/workflows/deploy.yml` compilará la aplicación estática y la publicará en la rama `gh-pages`, haciendo que el sitio sea visible en `https://YairPR.github.io/projectsAI/`.

### 2. Sincronización de Alineaciones En Vivo (Evitando robo de API Keys)
Para proteger tus API keys comerciales y evitar problemas de CORS en el navegador:
1. El workflow `.github/workflows/sync-lineups.yml` se ejecuta en segundo plano cada 15 minutos en GitHub.
2. Descarga las alineaciones oficiales desde la API de deportes de tu elección ejecutando el script `scripts/fetchLineups.js`.
3. Guarda un archivo `public/lineups.json` y lo pushea de vuelta al repositorio.
4. El navegador descarga este archivo estático localmente al hacer las predicciones.

---

## 🔑 Configuración del Repositorio (`YairPR/projectsAI`)

Sigue estos pasos en tu cuenta de GitHub para activar el flujo completo:

1. **Obtén tu API Key**: Registra una cuenta en [API-Football](https://dashboard.api-sports.io/) y copia tu API key.
2. **Guarda el Secret en GitHub**:
   - Entra a tu repositorio: `https://github.com/YairPR/projectsAI`
   - Ve a **Settings** > **Secrets and variables** > **Actions**.
   - Haz clic en **New repository secret**.
   - Nombre: `API_FOOTBALL_KEY`
   - Valor: *Tu clave de API*
3. **Configura Permisos de Escritura**:
   - En **Settings** > **Actions** > **General**, ve al final de la página hasta **Workflow permissions**.
   - Selecciona **Read and write permissions** (necesario para que las GitHub Actions puedan commitear el archivo de alineaciones).
   - Presiona **Save**.

---

## 🛠️ Ejecución Local

Para probar y ejecutar la web en tu ordenador:

```bash
# 1. Instalar dependencias
npm install

# 2. Generar el archivo de alineaciones inicial
node scripts/fetchLineups.js

# 3. Arrancar servidor de desarrollo local
npm run dev

# 4. Compilar para producción (comprobación de tipos)
npm run build
```
