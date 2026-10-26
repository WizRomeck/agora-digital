/**
 * ÁGORA DIGITAL (APCM-001) - CIVIC PLATFORM LOGIC
 * Universidad de Guadalajara • UDGVirtual 2026B
 * Luis Vicente Gómez Díaz (224070115)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // STATE MANAGEMENT: ROLES & INCIDENTS
  // ==========================================================================

  // Roles: 'citizen' (default, anonymous) | 'operator' (management) | 'academic' (UDG evaluation)
  let currentRole = 'citizen';

  // Base mock incidents for ZMG
  let incidents = [
    {
      id: 'FOL-2026-001',
      categoria: 'Bacheo',
      titulo: 'Bache profundo en carril de alta',
      municipio: 'Guadalajara',
      colonia: 'Colonia Americana',
      ubicacion: 'Av. Chapultepec Sur y Calle Morelos',
      coords: { x: 410, y: 195, lat: 20.6736, lng: -103.3644 },
      status: 'Pendiente',
      prioridad: 'Alta',
      tiempo: 'Hace 45 min',
      anonimo: true,
      descripcion: 'Hundimiento del asfalto que genera riesgo de pinchadura y colisión vehicular.'
    },
    {
      id: 'FOL-2026-002',
      categoria: 'Protección Civil',
      titulo: 'Riesgo de Inundación en desnivel',
      municipio: 'Zapopan',
      colonia: 'La Estancia',
      ubicacion: 'Av. Patria y Av. Vallarta',
      coords: { x: 230, y: 180, lat: 20.6789, lng: -103.4285 },
      status: 'En Proceso',
      prioridad: 'Crítica',
      tiempo: 'Hace 20 min',
      anonimo: true,
      descripcion: 'Acumulación de agua de 35 cm en carril lateral; cuadrilla de bombeo en trayecto.'
    },
    {
      id: 'FOL-2026-003',
      categoria: 'Luminarias',
      titulo: 'Circuito de alumbrado apagado',
      municipio: 'Zapopan',
      colonia: 'Zapopan Centro',
      ubicacion: 'Calle 28 de Enero #120',
      coords: { x: 280, y: 110, lat: 20.7214, lng: -103.3912 },
      status: 'En Proceso',
      prioridad: 'Media',
      tiempo: 'Hace 2 horas',
      anonimo: true,
      descripcion: '4 luminarias tipo LED apagadas en el andador peatonal durante la noche.'
    },
    {
      id: 'FOL-2026-004',
      categoria: 'Agua',
      titulo: 'Fuga de agua potable en banqueta',
      municipio: 'Guadalajara',
      colonia: 'Providencia',
      ubicacion: 'Av. Providencia #2450',
      coords: { x: 360, y: 130, lat: 20.6975, lng: -103.3821 },
      status: 'Resuelto',
      prioridad: 'Media',
      tiempo: 'Hace 4 horas',
      anonimo: true,
      descripcion: 'Fuga en medidor domiciliario reparada por cuadrilla del sector correspondiente.'
    },
    {
      id: 'FOL-2026-005',
      categoria: 'Residuos',
      titulo: 'Punto limpio saturado',
      municipio: 'Tlaquepaque',
      colonia: 'Tlaquepaque Centro',
      ubicacion: 'Calle Juárez y Herrera y Cairo',
      coords: { x: 530, y: 310, lat: 20.6398, lng: -103.3134 },
      status: 'Pendiente',
      prioridad: 'Baja',
      tiempo: 'Hace 5 horas',
      anonimo: true,
      descripcion: 'Contenedores de cartón y plástico desbordados en andador turístico.'
    },
    {
      id: 'FOL-2026-006',
      categoria: 'Bacheo',
      titulo: 'Socavón menor por filtración pluvial',
      municipio: 'Tlajomulco',
      colonia: 'Santa Fe',
      ubicacion: 'Blvd. Colón #350',
      coords: { x: 330, y: 390, lat: 20.5284, lng: -103.3762 },
      status: 'En Proceso',
      prioridad: 'Alta',
      tiempo: 'Hace 3 horas',
      anonimo: true,
      descripcion: 'Reblandecimiento del pavimento cerca de la glorieta de acceso.'
    }
  ];

  // Currently inspected incident on the map
  let currentInspectedIncident = null;

  // ==========================================================================
  // ROLE SWITCHING ARCHITECTURE
  // ==========================================================================
  const roleChips = document.querySelectorAll('.role-chip');
  const roleCurrentDesc = document.getElementById('roleCurrentDesc');
  const dashboardRoleBanner = document.getElementById('dashboardRoleBanner');
  const btnEmitirAlerta = document.getElementById('btnEmitirAlerta');

  function setRole(newRole) {
    currentRole = newRole;

    roleChips.forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-role') === newRole);
    });

    if (newRole === 'citizen') {
      if (roleCurrentDesc) {
        roleCurrentDesc.innerHTML = 'Modo actual: <strong>👤 Ciudadano (Acceso 100% Anónimo - LGPDPDP)</strong>';
      }
      if (dashboardRoleBanner) {
        dashboardRoleBanner.innerHTML = `
          <span class="perm-tag">MODO CIUDADANO (CONSULTA)</span>
          <span class="perm-text">Estás visualizando el mapa en modo consulta. Para despachar cuadrillas o cambiar estatus, selecciona el rol <strong>Operador Municipal</strong> en la barra superior.</span>
        `;
        dashboardRoleBanner.className = 'permission-banner';
      }
      switchTab('tab-citizen');
      showToast('Cambiado a Rol Ciudadano: Modo Anónimo sin cuentas');
    } else if (newRole === 'operator') {
      if (roleCurrentDesc) {
        roleCurrentDesc.innerHTML = 'Modo actual: <strong>🛠️ Operador Municipal (Gestión y Despacho)</strong>';
      }
      if (dashboardRoleBanner) {
        dashboardRoleBanner.innerHTML = `
          <span class="perm-tag" style="background: rgba(16, 185, 129, 0.2); color: #6ee7b7;">MODO OPERADOR (ACTIVO)</span>
          <span class="perm-text">Permisos habilitados para cambiar estatus de folios, despachar cuadrillas y emitir alertas preventivas.</span>
        `;
        dashboardRoleBanner.className = 'permission-banner';
      }
      switchTab('tab-dashboard');
      showToast('Cambiado a Rol Operador: Funciones de despacho activadas');
    } else if (newRole === 'academic') {
      if (roleCurrentDesc) {
        roleCurrentDesc.innerHTML = 'Modo actual: <strong>🎓 Asesoría y Ficha Académica (UDGVirtual)</strong>';
      }
      switchTab('tab-project');
      showToast('Cambiado a Vista Académica: Datos de titulación y PMBOK');
    }

    // Refresh UI elements that depend on role permissions
    applyFilters();
    updateInspectorBox(currentInspectedIncident);
  }

  roleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const targetRole = chip.getAttribute('data-role');
      if (targetRole) setRole(targetRole);
    });
  });

  // Early alert button permission check
  btnEmitirAlerta?.addEventListener('click', () => {
    if (currentRole !== 'operator') {
      showToast('⚠️ Esta acción requiere permisos de Operador Municipal. Cambia de rol arriba.');
      return;
    }
    const alertModal = document.getElementById('alertModal');
    if (alertModal) alertModal.style.display = 'flex';
  });

  // ==========================================================================
  // TAB NAVIGATION
  // ==========================================================================
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(targetTabId) {
    navTabs.forEach(t => {
      const isTarget = t.getAttribute('data-tab') === targetTabId;
      t.classList.toggle('active', isTarget);
      t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === targetTabId);
    });
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // ==========================================================================
  // KPI METRICS
  // ==========================================================================
  function updateKPIs() {
    const total = incidents.length;
    const pending = incidents.filter(i => i.status === 'Pendiente' || i.status === 'En Proceso').length;
    const resolved = incidents.filter(i => i.status === 'Resuelto').length;

    const kpiTotalEl = document.getElementById('kpiTotal');
    const kpiPendingEl = document.getElementById('kpiPending');
    const kpiResolvedEl = document.getElementById('kpiResolved');

    if (kpiTotalEl) kpiTotalEl.textContent = total;
    if (kpiPendingEl) kpiPendingEl.textContent = pending;
    if (kpiResolvedEl) kpiResolvedEl.textContent = resolved;
  }

  // ==========================================================================
  // BUG-FREE MAP IMPLEMENTATION & PINS
  // ==========================================================================
  const mapPinsGroup = document.getElementById('mapPinsGroup');
  const mapTooltip = document.getElementById('mapTooltip');
  const mapCanvas = document.getElementById('mapCanvas');

  function renderMapPins(listToRender) {
    if (!mapPinsGroup) return;
    mapPinsGroup.innerHTML = '';

    listToRender.forEach(inc => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'map-pin');
      g.setAttribute('id', `pin-${inc.id}`);
      g.setAttribute('transform', `translate(${inc.coords.x}, ${inc.coords.y})`);

      // Determine pin color
      let pinColor = '#f59e0b'; // amber
      if (inc.categoria === 'Protección Civil' || inc.prioridad === 'Crítica') {
        pinColor = '#ef4444'; // red
      } else if (inc.status === 'Resuelto') {
        pinColor = '#10b981'; // green
      } else if (inc.status === 'En Proceso') {
        pinColor = '#38bdf8'; // blue
      }

      // 1. Animated pulse ring (pointer-events: none is strictly enforced in CSS)
      const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseCircle.setAttribute('class', 'pin-pulse');
      pulseCircle.setAttribute('cx', '0');
      pulseCircle.setAttribute('cy', '0');
      pulseCircle.setAttribute('r', '7');
      pulseCircle.setAttribute('fill', pinColor);

      // 2. Main visible pin circle
      const mainCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      mainCircle.setAttribute('class', 'pin-circle');
      mainCircle.setAttribute('cx', '0');
      mainCircle.setAttribute('cy', '0');
      mainCircle.setAttribute('r', '7');
      mainCircle.setAttribute('fill', pinColor);
      mainCircle.setAttribute('stroke', '#ffffff');
      mainCircle.setAttribute('stroke-width', '2');

      // 3. Center dot
      const centerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      centerDot.setAttribute('cx', '0');
      centerDot.setAttribute('cy', '0');
      centerDot.setAttribute('r', '2.5');
      centerDot.setAttribute('fill', '#ffffff');
      centerDot.setAttribute('pointer-events', 'none');

      // 4. Stable transparent hit-area (radius 18px) to guarantee clean, non-jittery hover & clicks
      const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      hitArea.setAttribute('cx', '0');
      hitArea.setAttribute('cy', '0');
      hitArea.setAttribute('r', '18');
      hitArea.setAttribute('fill', 'transparent');
      hitArea.setAttribute('cursor', 'pointer');

      g.appendChild(pulseCircle);
      g.appendChild(mainCircle);
      g.appendChild(centerDot);
      g.appendChild(hitArea);

      // Stable mouseenter
      hitArea.addEventListener('mouseenter', () => {
        showPinTooltip(inc);
      });

      // Stable mouseleave
      hitArea.addEventListener('mouseleave', () => {
        hidePinTooltip();
      });

      // Click to select and inspect
      hitArea.addEventListener('click', () => {
        selectAndInspectIncident(inc);
      });

      mapPinsGroup.appendChild(g);
    });
  }

  function showPinTooltip(inc) {
    if (!mapTooltip || !mapCanvas) return;
    const ttFolio = document.getElementById('ttFolio');
    const ttStatus = document.getElementById('ttStatus');
    const ttTitle = document.getElementById('ttTitle');
    const ttLoc = document.getElementById('ttLoc');

    ttFolio.textContent = `#${inc.id}`;
    ttStatus.textContent = inc.status;
    ttStatus.className = `tooltip-status badge ${getStatusBadgeClass(inc.status)}`;
    ttTitle.textContent = inc.titulo;
    ttLoc.textContent = `${inc.colonia}, ${inc.municipio}`;

    // Position relative to map container with safe vertical clearance
    const rect = mapCanvas.getBoundingClientRect();
    const pinX = (inc.coords.x / 800) * rect.width;
    const pinY = (inc.coords.y / 480) * rect.height;

    mapTooltip.style.left = `${pinX}px`;
    mapTooltip.style.top = `${pinY - 8}px`;
    mapTooltip.style.display = 'block';
  }

  function hidePinTooltip() {
    if (mapTooltip) mapTooltip.style.display = 'none';
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Pendiente': return 'badge-warning';
      case 'En Proceso': return 'badge-primary';
      case 'Resuelto': return 'badge-success';
      default: return 'badge-info';
    }
  }

  function getCategoryIcon(cat) {
    switch (cat) {
      case 'Bacheo': return '🕳️';
      case 'Luminarias': return '💡';
      case 'Agua': return '💧';
      case 'Residuos': return '🗑️';
      case 'Protección Civil': return '🚨';
      default: return '📌';
    }
  }

  // ==========================================================================
  // PINNED INCIDENT INSPECTOR (BELOW MAP)
  // ==========================================================================
  const inspectorEmpty = document.getElementById('inspectorEmpty');
  const inspectorContent = document.getElementById('inspectorContent');
  const inspStatus = document.getElementById('inspStatus');
  const inspFolio = document.getElementById('inspFolio');
  const inspTitle = document.getElementById('inspTitle');
  const inspLoc = document.getElementById('inspLoc');
  const inspDesc = document.getElementById('inspDesc');
  const btnInspResolve = document.getElementById('btnInspResolve');
  const btnCloseInspector = document.getElementById('btnCloseInspector');

  function selectAndInspectIncident(inc) {
    currentInspectedIncident = inc;
    updateInspectorBox(inc);
    highlightIncidentInList(inc.id);
  }

  function updateInspectorBox(inc) {
    if (!inspectorContent || !inspectorEmpty) return;

    if (!inc) {
      inspectorContent.style.display = 'none';
      inspectorEmpty.style.display = 'block';
      return;
    }

    inspectorEmpty.style.display = 'none';
    inspectorContent.style.display = 'block';

    if (inspStatus) {
      inspStatus.textContent = inc.status;
      inspStatus.className = `badge ${getStatusBadgeClass(inc.status)}`;
    }
    if (inspFolio) inspFolio.textContent = `#${inc.id}`;
    if (inspTitle) inspTitle.textContent = `${getCategoryIcon(inc.categoria)} ${inc.titulo}`;
    if (inspLoc) inspLoc.textContent = `📍 ${inc.ubicacion} (${inc.colonia}, ${inc.municipio}) • Prioridad: ${inc.prioridad}`;
    if (inspDesc) inspDesc.textContent = `Descripción: "${inc.descripcion}"`;

    if (btnInspResolve) {
      if (currentRole === 'operator') {
        btnInspResolve.style.display = inc.status === 'Resuelto' ? 'none' : 'inline-flex';
        btnInspResolve.textContent = inc.status === 'Pendiente' ? 'Asignar Cuadrilla' : 'Marcar como Resuelto';
      } else {
        // In citizen mode, the button explains permissions
        btnInspResolve.style.display = 'inline-flex';
        btnInspResolve.textContent = '🔒 Requiere Rol Operador';
        btnInspResolve.className = 'btn btn-sm btn-ghost';
      }
    }
  }

  btnInspResolve?.addEventListener('click', () => {
    if (!currentInspectedIncident) return;
    if (currentRole !== 'operator') {
      showToast('⚠️ Cambia al rol "Operador Municipal" arriba para actualizar este folio.');
      return;
    }

    const nextStatus = currentInspectedIncident.status === 'Pendiente' ? 'En Proceso' : 'Resuelto';
    changeIncidentStatus(currentInspectedIncident.id, nextStatus);
  });

  btnCloseInspector?.addEventListener('click', () => {
    currentInspectedIncident = null;
    updateInspectorBox(null);
  });

  // ==========================================================================
  // INCIDENTS LIST & FILTERING
  // ==========================================================================
  const incidentsContainer = document.getElementById('incidentsContainer');
  const visibleCounter = document.getElementById('visibleCounter');

  function renderIncidentsList(list) {
    if (!incidentsContainer) return;
    incidentsContainer.innerHTML = '';

    if (visibleCounter) {
      visibleCounter.textContent = `Mostrando ${list.length} reportes`;
    }

    if (list.length === 0) {
      incidentsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-dim); font-size: 0.85rem;">
          <p>No se encontraron reportes con los criterios seleccionados.</p>
        </div>
      `;
      return;
    }

    list.forEach(inc => {
      const item = document.createElement('div');
      item.className = 'incident-item';
      item.id = `card-${inc.id}`;

      // Check if this is the currently inspected one
      if (currentInspectedIncident && currentInspectedIncident.id === inc.id) {
        item.classList.add('highlighted');
      }

      item.innerHTML = `
        <div class="incident-top">
          <span class="inc-folio">#${inc.id}</span>
          <span class="badge ${getStatusBadgeClass(inc.status)}">${inc.status}</span>
        </div>

        <div class="inc-title">${getCategoryIcon(inc.categoria)} ${inc.titulo}</div>

        <div class="inc-loc">
          <span>${inc.ubicacion} (${inc.municipio})</span>
        </div>

        <div class="inc-meta-row">
          <span>Prioridad: <strong>${inc.prioridad}</strong> • ${inc.tiempo}</span>
          <div class="inc-actions">
            ${currentRole === 'operator' ? `
              ${inc.status === 'Pendiente' ? `<button class="btn btn-sm btn-ghost btn-action-step" data-id="${inc.id}" data-next="En Proceso">Asignar</button>` : ''}
              ${inc.status === 'En Proceso' ? `<button class="btn btn-sm btn-secondary btn-action-step" data-id="${inc.id}" data-next="Resuelto">Resolver</button>` : ''}
              ${inc.status === 'Resuelto' ? `<span class="badge badge-success">✓ Resuelto</span>` : ''}
            ` : `
              <span class="badge badge-info" style="font-size: 0.65rem;">Consulta</span>
            `}
          </div>
        </div>
      `;

      // Status change buttons for operator
      const btnStep = item.querySelector('.btn-action-step');
      if (btnStep) {
        btnStep.addEventListener('click', (e) => {
          e.stopPropagation();
          const next = btnStep.getAttribute('data-next');
          changeIncidentStatus(inc.id, next);
        });
      }

      // Card click inspects on map
      item.addEventListener('click', () => {
        selectAndInspectIncident(inc);
      });

      incidentsContainer.appendChild(item);
    });
  }

  function changeIncidentStatus(id, newStatus) {
    const inc = incidents.find(i => i.id === id);
    if (inc) {
      inc.status = newStatus;
      updateKPIs();
      applyFilters();
      if (currentInspectedIncident && currentInspectedIncident.id === id) {
        updateInspectorBox(inc);
      }
      showToast(`Folio #${id} actualizado a "${newStatus}"`);
    }
  }

  function highlightIncidentInList(id) {
    const card = document.getElementById(`card-${id}`);
    if (card) {
      document.querySelectorAll('.incident-item').forEach(c => c.classList.remove('highlighted'));
      card.classList.add('highlighted');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Filter toolbar listeners
  const filterSearch = document.getElementById('filterSearch');
  const filterMunicipio = document.getElementById('filterMunicipio');
  const filterCategoria = document.getElementById('filterCategoria');

  function applyFilters() {
    const searchVal = (filterSearch?.value || '').toLowerCase().trim();
    const munVal = filterMunicipio?.value || 'all';
    const catVal = filterCategoria?.value || 'all';

    const filtered = incidents.filter(inc => {
      const matchSearch = !searchVal || 
        inc.id.toLowerCase().includes(searchVal) ||
        inc.titulo.toLowerCase().includes(searchVal) ||
        inc.colonia.toLowerCase().includes(searchVal) ||
        inc.ubicacion.toLowerCase().includes(searchVal);

      const matchMun = munVal === 'all' || inc.municipio === munVal;
      const matchCat = catVal === 'all' || inc.categoria === catVal;

      return matchSearch && matchMun && matchCat;
    });

    renderIncidentsList(filtered);
    renderMapPins(filtered);
  }

  filterSearch?.addEventListener('input', applyFilters);
  filterMunicipio?.addEventListener('change', applyFilters);
  filterCategoria?.addEventListener('change', applyFilters);

  // ==========================================================================
  // CITIZEN REPORT FORM (ANONYMOUS SUBMISSION)
  // ==========================================================================
  const citizenForm = document.getElementById('citizenReportForm');
  const btnSimulateGPS = document.getElementById('btnSimulateGPS');
  const gpsCoordsText = document.getElementById('gpsCoordsText');

  let currentCoordinates = { lat: 20.7214, lng: -103.3912, x: 280, y: 110 };

  btnSimulateGPS?.addEventListener('click', () => {
    const randLat = (20.64 + Math.random() * 0.08).toFixed(4);
    const randLng = (-103.40 + Math.random() * 0.08).toFixed(4);
    const randX = Math.floor(220 + Math.random() * 300);
    const randY = Math.floor(100 + Math.random() * 250);

    currentCoordinates = { lat: parseFloat(randLat), lng: parseFloat(randLng), x: randX, y: randY };

    if (gpsCoordsText) {
      gpsCoordsText.textContent = `GPS Georreferenciado: ${randLat}° N, ${randLng}° W (Precisión ±3m)`;
    }
    showToast('Coordenadas GPS capturadas');
  });

  citizenForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedCat = document.querySelector('input[name="reportCat"]:checked')?.value || 'Bacheo';
    const municipio = document.getElementById('formMunicipio')?.value || 'Zapopan';
    const colonia = document.getElementById('formColonia')?.value || 'Zapopan Centro';
    const calle = document.getElementById('formCalle')?.value || 'Av. Hidalgo';
    const descripcion = document.getElementById('formDescripcion')?.value || 'Reporte de anomalía en vía pública';

    // Generate unique Folio
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newFolio = `FOL-GDL-2026-${randomNum}`;

    const newIncident = {
      id: newFolio,
      categoria: selectedCat,
      titulo: `${selectedCat} en ${colonia}`,
      municipio: municipio,
      colonia: colonia,
      ubicacion: calle,
      coords: { ...currentCoordinates },
      status: 'Pendiente',
      prioridad: selectedCat === 'Protección Civil' ? 'Crítica' : 'Media',
      tiempo: 'Justo ahora',
      anonimo: true,
      descripcion: descripcion
    };

    // Add to local dataset
    incidents.unshift(newIncident);
    updateKPIs();
    applyFilters();

    // Show clean success modal
    showReportSuccessModal(newIncident);
  });

  // Query folio widget
  const inputQueryFolio = document.getElementById('inputQueryFolio');
  const btnQueryFolio = document.getElementById('btnQueryFolio');
  const queryResultBox = document.getElementById('queryResultBox');

  btnQueryFolio?.addEventListener('click', () => {
    const q = (inputQueryFolio?.value || '').trim().toUpperCase();
    if (!q) {
      showToast('Ingresa un número de folio');
      return;
    }

    const found = incidents.find(i => i.id.toUpperCase() === q || i.id.toUpperCase().includes(q));

    if (!queryResultBox) return;
    queryResultBox.style.display = 'block';

    if (found) {
      queryResultBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <strong style="color: var(--color-primary); font-family: var(--font-mono);">#${found.id}</strong>
          <span class="badge ${getStatusBadgeClass(found.status)}">${found.status}</span>
        </div>
        <p style="font-weight: 700; color: #fff;">${found.titulo}</p>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">📍 ${found.ubicacion}, ${found.municipio}</p>
        <p style="font-size: 0.72rem; color: #6ee7b7; margin-top: 0.35rem;">Modalidad anónima protegida por LGPDPDP.</p>
      `;
    } else {
      queryResultBox.innerHTML = `
        <p style="color: #fca5a5; font-size: 0.78rem;">❌ No se encontró el folio "<strong>${q}</strong>". Verifica que coincida con el emitido al levantar el reporte.</p>
      `;
    }
  });

  // ==========================================================================
  // WHATSAPP CHATBOT SIMULATOR MODAL
  // ==========================================================================
  const btnOpenBotSim = document.getElementById('btnOpenBotSim');
  const botModal = document.getElementById('botModal');
  const btnCloseBotModal = document.getElementById('btnCloseBotModal');
  const waChatBody = document.getElementById('waChatBody');
  const waInputForm = document.getElementById('waInputForm');
  const waInputText = document.getElementById('waInputText');
  const waPills = document.querySelectorAll('.wa-pill');

  btnOpenBotSim?.addEventListener('click', () => {
    if (botModal) botModal.style.display = 'flex';
  });

  btnCloseBotModal?.addEventListener('click', () => {
    if (botModal) botModal.style.display = 'none';
  });

  function addWaMessage(content, isSent = false) {
    if (!waChatBody) return;
    const msg = document.createElement('div');
    msg.className = `wa-msg ${isSent ? 'wa-sent' : 'wa-received'}`;

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    msg.innerHTML = `
      ${content}
      <span class="wa-time">${timeStr}</span>
    `;

    waChatBody.appendChild(msg);
    waChatBody.scrollTop = waChatBody.scrollHeight;
  }

  function handleWaInput(text) {
    const clean = text.trim().toLowerCase();
    addWaMessage(text, true);

    setTimeout(() => {
      if (clean === '1' || clean.includes('bache') || clean.includes('falla') || clean.includes('luz')) {
        const genFolio = `FOL-WA-2026-${Math.floor(100 + Math.random() * 900)}`;
        addWaMessage(`
          <strong>¡Reporte cívico registrado! 📝</strong><br><br>
          Se ha asignado el <strong>Folio #${genFolio}</strong>.<br>
          📍 Ubicación registrada: ZMG.<br>
          🔒 Acceso anónimo LGPDPDP resguardado.
        `);
      } else if (clean === '2' || clean.includes('folio') || clean.includes('consultar')) {
        addWaMessage(`
          🔍 <strong>Consulta de Folio:</strong><br>
          El reporte #FOL-2026-001 (Bache en Av. Chapultepec) se encuentra: <br>
          🟡 <strong>ESTATUS: PENDIENTE DE ASIGNACIÓN</strong>
        `);
      } else if (clean === '3' || clean.includes('alerta') || clean.includes('pc')) {
        addWaMessage(`
          ⚠️ <strong>AVISO PROTECCIÓN CIVIL:</strong><br>
          Monitoreo activo por precipitaciones en pasos a desnivel de Guadalajara y Zapopan.
        `);
      } else {
        addWaMessage(`
          Respuesta automática de Ágora Bot:<br>
          Escribe <strong>1</strong> para reportar falla, <strong>2</strong> para consultar folio o <strong>3</strong> para alertas.
        `);
      }
    }, 500);
  }

  waInputForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!waInputText?.value) return;
    const val = waInputText.value;
    waInputText.value = '';
    handleWaInput(val);
  });

  waPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const msg = pill.getAttribute('data-msg');
      if (msg) handleWaInput(msg);
    });
  });

  // ==========================================================================
  // EMERGENCY ALERT BROADCAST (OPERATOR ONLY)
  // ==========================================================================
  const alertModal = document.getElementById('alertModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const btnConfirmAlert = document.getElementById('btnConfirmAlert');
  const alertBanner = document.getElementById('alertBanner');
  const btnCloseAlert = document.getElementById('btnCloseAlert');

  [btnCloseModal, btnCancelModal].forEach(b => {
    b?.addEventListener('click', () => {
      if (alertModal) alertModal.style.display = 'none';
    });
  });

  btnConfirmAlert?.addEventListener('click', () => {
    const zone = document.getElementById('modalAlertZone')?.value || 'ZMG';
    const msg = document.getElementById('modalAlertMsg')?.value || 'Aviso preventivo emitido.';

    if (alertBanner) {
      alertBanner.innerHTML = `
        <div class="alert-banner-content">
          <div class="alert-tag">AVISO PREVENTIVO PC (${zone})</div>
          <p class="alert-text"><strong>Aviso Oficial:</strong> ${msg}</p>
        </div>
        <button class="alert-close" id="btnCloseAlertDyn">&times;</button>
      `;
      alertBanner.style.display = 'flex';
      document.getElementById('btnCloseAlertDyn')?.addEventListener('click', () => {
        alertBanner.style.display = 'none';
      });
    }

    if (alertModal) alertModal.style.display = 'none';
    showToast('Aviso de Protección Civil emitido con éxito');
  });

  btnCloseAlert?.addEventListener('click', () => {
    if (alertBanner) alertBanner.style.display = 'none';
  });

  // ==========================================================================
  // REPORT SUCCESS MODAL
  // ==========================================================================
  const detailModal = document.getElementById('detailModal');
  const detailModalContent = document.getElementById('detailModalContent');

  function showReportSuccessModal(newInc) {
    if (!detailModal || !detailModalContent) return;

    detailModalContent.innerHTML = `
      <div class="modal-header">
        <div class="modal-title-group">
          <span class="badge badge-success">Reporte Registrado</span>
          <h3 class="modal-title">Folio Cívico: #${newInc.id}</h3>
        </div>
        <button class="modal-close" id="btnCloseSuccessModal">&times;</button>
      </div>

      <div class="modal-body" style="font-size: 0.825rem; line-height: 1.5;">
        <p style="color: var(--text-muted); margin-bottom: 0.75rem;">
          Tu reporte se ha registrado en el sistema bajo modalidad <strong>100% anónima</strong> (LGPDPDP).
        </p>

        <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 0.85rem;">
          <p><strong>Categoría:</strong> ${newInc.categoria}</p>
          <p><strong>Ubicación:</strong> ${newInc.ubicacion}, ${newInc.colonia} (${newInc.municipio})</p>
          <p><strong>Coordenadas:</strong> ${newInc.coords.lat}° N, ${newInc.coords.lng}° W</p>
          <p><strong>Estatus Inicial:</strong> <span class="badge badge-warning">Pendiente</span></p>
        </div>

        <p style="color: #6ee7b7; font-size: 0.78rem;">
          ✓ Ya puedes consultar el estado de tu folio o visualizarlo en el mapa metropolitano.
        </p>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" id="btnStayHere">Cerrar</button>
        <button class="btn btn-primary" id="btnGoToDashboard">Ver en el Mapa</button>
      </div>
    `;

    detailModal.style.display = 'flex';

    document.getElementById('btnCloseSuccessModal')?.addEventListener('click', () => {
      detailModal.style.display = 'none';
    });
    document.getElementById('btnStayHere')?.addEventListener('click', () => {
      detailModal.style.display = 'none';
    });
    document.getElementById('btnGoToDashboard')?.addEventListener('click', () => {
      detailModal.style.display = 'none';
      switchTab('tab-dashboard');
      selectAndInspectIncident(newInc);
    });
  }

  // Backdrop modal dismissal
  window.addEventListener('click', (e) => {
    if (e.target === alertModal) alertModal.style.display = 'none';
    if (e.target === detailModal) detailModal.style.display = 'none';
    if (e.target === botModal) botModal.style.display = 'none';
  });

  // ==========================================================================
  // TOAST HELPER
  // ==========================================================================
  const toast = document.getElementById('appToast');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  updateKPIs();
  applyFilters();
});
