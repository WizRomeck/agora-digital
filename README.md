# Ágora Digital (APCM-001) 🏛️
### Plataforma de Gestión Cívica y Alerta Temprana — Zona Metropolitana de Guadalajara
**Universidad de Guadalajara | UDGVirtual**  
**Licenciatura en Tecnologías e Información**  
- **Alumno:** Luis Vicente Gómez Díaz (Código: 224070115)  
- **Asesora Académica:** Mtra. Ana María Franco Gordo  
- **Ciclo:** 2026B  

---

## 📌 Enfoque del Avance (MVP Base para Evaluación)

Este repositorio contiene la **base funcional del proyecto Ágora Digital**, orientada a mostrar un avance directo al punto, realista y sin complejidades innecesarias, listo para alojarse de inmediato en **Vercel**.

### 1. Sistema de Roles (Control de Permisos)
La plataforma integra en su arquitectura una separación de roles en la barra superior:
- **👤 Rol Ciudadano (Predeterminado):**
  - **Acceso 100% Anónimo:** En apego a la **LGPDPDP**, el ciudadano **no necesita crear cuenta ni ingresar contraseñas**, evitando barreras de entrada.
  - Generación de **Folio Cívico único** e inmutable para seguimiento vecinal.
  - Visualización del mapa en modo consulta pública.
- **🛠️ Rol Operador Municipal:**
  - Desbloquea la capacidad de cambiar estatus (*Pendiente* → *En Proceso* → *Resuelto*) y despachar cuadrillas.
  - Habilitación de emisión de **Alertas Preventivas de Protección Civil**.
- **🎓 Vista Académica UDG:**
  - Ficha formal de entrega, estado de entregables y alineación con estándares PMBOK (5ta Edición).

### 2. Mapa Metropolitano Estable e Interactivo
- Visualización de cuadrantes de la ZMG (Guadalajara, Zapopan, San Pedro Tlaquepaque y Tlajomulco de Zúñiga).
- **Interacción fluida sin parpadeos:** Tooltips con posicionamiento protegido y panel de inspección fija al hacer clic en cualquier punto del mapa.
- Semaforización cívica clara: Rojo (Protección Civil), Ámbar (Servicios Públicos) y Verde (Atendido).

### 3. Especificación Honesta de Módulos Futuros
En la pestaña de **Módulos Proyectados** se expone con rigor técnico la visión de escalabilidad sin fingir integraciones falsas:
- **Módulo RBAC:** Matriz de permisos detallada para campo y supervisión.
- **Canal WhatsApp:** Prototipo conversacional para personas de la tercera edad o con brecha digital.
- **Realidad de Integración con el Gobierno de Jalisco:** Se documenta que, debido a que las APIs estatales (*datos.jalisco.gob.mx*) no siempre ofrecen sincronización bidireccional estable o existen limitantes institucionales, Ágora Digital fue diseñada para operar de manera **autónoma** con su catálogo propio georreferenciado.

---

## 🚀 Despliegue en Vercel (Paso a Paso)

El proyecto utiliza **HTML5, CSS3 y JavaScript nativo**, sin dependencias ni compilaciones pesadas. Se despliega en Vercel en 1 minuto.

### Opción A: Desde GitHub
1. Sube esta carpeta `agora-digital` a tu repositorio en GitHub.
2. Entra a [vercel.com](https://vercel.com) e inicia sesión.
3. Haz clic en **"Add New..."** > **"Project"** y selecciona tu repositorio.
4. Presiona **"Deploy"** (los parámetros por defecto son suficientes).

### Opción B: Con la terminal (Vercel CLI)
En la carpeta del proyecto ejecuta:
```bash
npx vercel
```
Acepta los valores sugeridos presionando `Enter` y obtendrás la URL pública al instante.

---

## 💻 Vista previa local
Para probar la aplicación en tu computadora:
- Haz doble clic sobre `index.html` para abrirlo en cualquier navegador web.
