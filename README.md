# G-Climate ☀🌙

**G-Climate** es una aplicación de clima moderna, inteligente y multiplataforma diseñada con un enfoque en la estética minimalista y la precisión de datos impulsada por Inteligencia Artificial.

![G-Climate Preview](https://picsum.photos/seed/weather-app/1200/600)

## 🚀 Características Principales

- **IA Weather Engine**: Utiliza la API de Gemini con Google Search para obtener datos meteorológicos precisos y actualizados en tiempo real.
- **Calidad del Aire (AQI)**: Información detallada sobre contaminantes (PM2.5, PM10, O3, NO2, SO2, CO) e índice de salud del aire.
- **Ciclo Día/Noche Dinámico**: Los iconos y la interfaz se adaptan automáticamente según la hora local de la ubicación (salida y puesta de sol).
- **Gestión de Ubicaciones**: Guarda tus ciudades favoritas con persistencia en `LocalStorage`.
- **Pronóstico Extendido**: Visualización de las próximas 24 horas y pronóstico de 10 días.
- **Multiplataforma**: 
  - **PWA**: Instalable desde el navegador en cualquier dispositivo.
  - **Capacitor**: Preparada para ser compilada como aplicación nativa en Android.
- **Diseño Premium**: Interfaz fluida construida con Tailwind CSS y animaciones suaves con Framer Motion.

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS 4
- **IA**: Google Gemini API (`@google/genai`)
- **Animaciones**: Framer Motion (`motion/react`)
- **Iconos**: Lucide React
- **Mobile**: Capacitor (Android Support)

## 📦 Instalación y Desarrollo

1. **Clonar el proyecto**:
   ```bash
   # Si exportaste a GitHub o descargaste el ZIP
   cd g-climate
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` o asegúrate de tener configurada tu `GEMINI_API_KEY`.

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

## 📱 Soporte Móvil

### Progressive Web App (PWA)
La aplicación incluye un `manifest.webmanifest` y un `Service Worker` básico para permitir la instalación en la pantalla de inicio de dispositivos iOS y Android directamente desde el navegador.

### Capacitor (Android)
Para abrir el proyecto en Android Studio:
```bash
npm run cap:sync
npm run cap:open
```

## 📂 Estructura del Proyecto

- `src/services/weatherService.ts`: Lógica de integración con Gemini y Google Search.
- `src/App.tsx`: Componente principal y gestión de estados.
- `src/index.css`: Configuraciones globales de Tailwind y Safe Area para móviles.
- `public/`: Assets estáticos, manifiesto y service worker.

## 📄 Licencia

Este proyecto fue creado como un prototipo funcional en **AI Studio Build**. Siéntete libre de usarlo, modificarlo y compartirlo.

---
Creado con ❤️ por [nietog.martin@gmail.com](mailto:nietog.martin@gmail.com)
