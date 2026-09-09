/**
 * CASA FÉNIX - Lógica del Dashboard de Staff
 * Autenticación, Métricas, Editor de Cintilla y CRUD completo de Tratamientos.
 */

// Tratamientos por defecto para autodiagnóstico
const DEFAULT_SERVICES = [
  {
    id: "serv_1",
    name: "Transforma",
    subtitle: "Todo tu Cuerpo",
    category: "corporal",
    sessions: "16 Sesiones",
    desc: "Reafirma, moldea y define. 8 sesiones aparatología + 8 lipoenzimas.",
    specs: ["Radiofrecuencia, Cavitación & Vacuodermia", "Ondas de choque & Drenaje", "Abdomen, glúteos y piernas"],
    regularPrice: "Hasta 12 MSI",
    specialPrice: "$14,999",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "serv_2",
    name: "Bye",
    subtitle: "Ojeras Radiantes",
    category: "facial",
    sessions: "8 Sesiones",
    desc: "Mirada fresca y luminosa con oxigenación y bioestimulación dérmica.",
    specs: ["Carbóx Facial oxigenante", "Bioestimulación celular", "Radiofrecuencia periocular"],
    regularPrice: "$5,200",
    specialPrice: "$3,900",
    image: "https://images.unsplash.com/photo-1512290900672-1f408a000165?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "serv_3",
    name: "Lifting",
    subtitle: "Facial 360°",
    category: "facial",
    sessions: "15 Sesiones Totales",
    desc: "Define el contorno facial, mentón y cuello con tensión dérmica progresiva.",
    specs: ["6 RF + 6 Ultrasonido Tonificante", "3 Sesiones de Lipoenzimas Reductoras", "Valoración incluida"],
    regularPrice: "$5,500",
    specialPrice: "$3,900",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "serv_4",
    name: "Bye",
    subtitle: "Celulitis & Glúteos",
    category: "corporal",
    sessions: "8 Sesiones",
    desc: "Restaura la elasticidad rompiendo septos fibrosos en piernas y glúteos.",
    specs: ["Ondas de choque acústicas", "Vacuoterapia activa", "Efecto push-up"],
    regularPrice: "$8,500",
    specialPrice: "$6,200",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "serv_5",
    name: "Full Body",
    subtitle: "Libertad sin Límites",
    category: "laser",
    sessions: "10 Sesiones",
    desc: "Depilación médica con cabezal frío Soprano Titanium. Indolora y efectiva.",
    specs: ["Piernas, Brazos, Axilas y Bikini", "Espalda, Abdomen y Glúteos", "Ahorro de $4,501"],
    regularPrice: "$19,500",
    specialPrice: "$14,999",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    active: true
  },
  {
    id: "serv_6",
    name: "Spa Party",
    subtitle: "Exclusividad & Amigos",
    category: "spa-party",
    sessions: "Experiencia Grupal VIP",
    desc: "Suite privada con masajes, faciales, mimosas ilimitadas y catering fino.",
    specs: ["Grupos de 2 a 15 personas", "Batas, brindis y aromaterapia", "Duración de 3 a 5 horas"],
    regularPrice: "Desde 2 personas",
    specialPrice: "Desde $1,800 p/p",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    active: true
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const authGate = document.getElementById('authGate');
  const dashboardApp = document.getElementById('dashboardApp');
  const staffLoginForm = document.getElementById('staffLoginForm');
  const logoutBtn = document.getElementById('logoutBtn');

  let isAuthenticated = sessionStorage.getItem('fenix_staff_logged') === 'true';

  function checkAuth() {
    if (isAuthenticated) {
      if (authGate) authGate.style.display = 'none';
      if (dashboardApp) dashboardApp.style.display = 'flex';
      initDashboard();
    } else {
      if (authGate) authGate.style.display = 'flex';
      if (dashboardApp) dashboardApp.style.display = 'none';
    }
  }

  if (staffLoginForm) {
    staffLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const pass = document.getElementById('loginPassword').value.trim();

      if (email === "admin@casafenix.mx" && pass === "fenix2026") {
        isAuthenticated = true;
        sessionStorage.setItem('fenix_staff_logged', 'true');
        checkAuth();
      } else {
        alert("Credenciales incorrectas. Usa admin@casafenix.mx y fenix2026.");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isAuthenticated = false;
      sessionStorage.removeItem('fenix_staff_logged');
      checkAuth();
    });
  }

  checkAuth();

  function initDashboard() {
    // Autodiagnóstico y carga segura de servicios
    let stored = JSON.parse(localStorage.getItem('fenix_services'));
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      stored = DEFAULT_SERVICES;
      localStorage.setItem('fenix_services', JSON.stringify(DEFAULT_SERVICES));
    }
    let services = stored;

    let announcement = JSON.parse(localStorage.getItem('fenix_announcement')) || {
      text: "<i class='fa-solid fa-sparkles'></i> <strong>Especial Septiembre:</strong> Hasta 12 Meses Sin Intereses en todos los protocolos integrales.",
      enabled: true
    };

    function saveServices() {
      localStorage.setItem('fenix_services', JSON.stringify(services));
    }

    function saveAnnouncement() {
      localStorage.setItem('fenix_announcement', JSON.stringify(announcement));
    }

    /* 1. CONTROL DE LA CINTILLA */
    const announcementToggle = document.getElementById('announcementToggle');
    const announcementInputText = document.getElementById('announcementInputText');
    const announcementStatusText = document.getElementById('announcementStatusText');
    const saveAnnouncementBtn = document.getElementById('saveAnnouncementBtn');

    if (announcementToggle && announcementInputText && announcementStatusText) {
      announcementToggle.checked = announcement.enabled;
      announcementInputText.value = announcement.text;
      announcementStatusText.textContent = announcement.enabled ? "Cintilla Activa" : "Cintilla Oculta";

      announcementToggle.addEventListener('change', () => {
        announcementStatusText.textContent = announcementToggle.checked ? "Cintilla Activa" : "Cintilla Oculta";
      });

      saveAnnouncementBtn.addEventListener('click', () => {
        announcement.text = announcementInputText.value.trim();
        announcement.enabled = announcementToggle.checked;
        saveAnnouncement();
        alert("¡Cintilla actualizada! Se verá reflejada en la página principal inmediatamente.");
      });
    }

    /* 2. RENDERIZADO DE TABLA CRUD Y KPIS */
    const adminServicesTableBody = document.getElementById('adminServicesTableBody');
    const activeServicesCount = document.getElementById('activeServicesCount');
    const totalServicesCount = document.getElementById('totalServicesCount');

    function renderTable() {
      if (!adminServicesTableBody) return;
      adminServicesTableBody.innerHTML = '';

      services.forEach(serv => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div class="service-preview-cell">
              <img src="${serv.image}" alt="${serv.name}" />
              <div>
                <strong>${serv.name}</strong> <em>${serv.subtitle}</em>
              </div>
            </div>
          </td>
          <td><span style="text-transform: capitalize;">${serv.category}</span></td>
          <td>${serv.sessions}</td>
          <td><strong style="color: var(--burgundy);">${serv.specialPrice}</strong></td>
          <td>
            <span class="status-pill ${serv.active !== false ? 'active' : 'inactive'}">
              ${serv.active !== false ? 'Habilitado' : 'Deshabilitado'}
            </span>
          </td>
          <td class="action-btns-cell">
            <button class="btn-action-icon" title="${serv.active !== false ? 'Deshabilitar' : 'Habilitar'}" onclick="toggleActive('${serv.id}')">
              <i class="fa-solid ${serv.active !== false ? 'fa-eye-slash' : 'fa-eye'}"></i>
            </button>
            <button class="btn-action-icon" title="Editar" onclick="editProtocol('${serv.id}')">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-action-icon delete" title="Eliminar" onclick="deleteProtocol('${serv.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        `;
        adminServicesTableBody.appendChild(tr);
      });

      const activeCount = services.filter(s => s.active !== false).length;
      if (activeServicesCount) activeServicesCount.textContent = `${activeCount} Activos`;
      if (totalServicesCount) totalServicesCount.textContent = `${services.length} en total`;
    }

    window.toggleActive = function(id) {
      const item = services.find(s => s.id === id);
      if (item) {
        item.active = !item.active;
        saveServices();
        renderTable();
      }
    };

    window.deleteProtocol = function(id) {
      if (confirm("¿Seguro que deseas eliminar este tratamiento?")) {
        services = services.filter(s => s.id !== id);
        saveServices();
        renderTable();
      }
    };

    /* 3. MODAL AGREGAR / EDITAR */
    const serviceModal = document.getElementById('serviceModal');
    const closeServiceModalBtn = document.getElementById('closeServiceModalBtn');
    const openCreateServiceModalBtn = document.getElementById('openCreateServiceModalBtn');
    const btnAddNewProtocol = document.getElementById('btnAddNewProtocol');
    const serviceForm = document.getElementById('serviceForm');
    const serviceModalTitle = document.getElementById('serviceModalTitle');

    const serviceIdInput = document.getElementById('serviceId');
    const serviceNameInput = document.getElementById('serviceNameInput');
    const serviceSubtitleInput = document.getElementById('serviceSubtitleInput');
    const serviceCategoryInput = document.getElementById('serviceCategoryInput');
    const serviceSessionsInput = document.getElementById('serviceSessionsInput');
    const serviceRegularPriceInput = document.getElementById('serviceRegularPriceInput');
    const serviceSpecialPriceInput = document.getElementById('serviceSpecialPriceInput');
    const serviceImageInput = document.getElementById('serviceImageInput');
    const serviceDescInput = document.getElementById('serviceDescInput');
    const serviceSpecsInput = document.getElementById('serviceSpecsInput');
    const serviceActiveCheckbox = document.getElementById('serviceActiveCheckbox');

    function openModalForCreate() {
      if (!serviceForm) return;
      serviceForm.reset();
      serviceIdInput.value = '';
      serviceModalTitle.textContent = "Nuevo Tratamiento";
      serviceModal.classList.add('active');
    }

    if (openCreateServiceModalBtn) openCreateServiceModalBtn.addEventListener('click', openModalForCreate);
    if (btnAddNewProtocol) btnAddNewProtocol.addEventListener('click', openModalForCreate);

    window.editProtocol = function(id) {
      const serv = services.find(s => s.id === id);
      if (!serv) return;

      serviceModalTitle.textContent = "Editar Tratamiento";
      serviceIdInput.value = serv.id;
      serviceNameInput.value = serv.name;
      serviceSubtitleInput.value = serv.subtitle;
      serviceCategoryInput.value = serv.category;
      serviceSessionsInput.value = serv.sessions;
      serviceRegularPriceInput.value = serv.regularPrice;
      serviceSpecialPriceInput.value = serv.specialPrice;
      serviceImageInput.value = serv.image;
      serviceDescInput.value = serv.desc;
      serviceSpecsInput.value = (serv.specs || []).join(', ');
      serviceActiveCheckbox.checked = serv.active !== false;

      serviceModal.classList.add('active');
    };

    if (closeServiceModalBtn) {
      closeServiceModalBtn.addEventListener('click', () => serviceModal.classList.remove('active'));
    }

    if (serviceForm) {
      serviceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = serviceIdInput.value;
        const specsArray = serviceSpecsInput.value.split(',').map(s => s.trim()).filter(Boolean);

        if (id) {
          const index = services.findIndex(s => s.id === id);
          if (index !== -1) {
            services[index] = {
              ...services[index],
              name: serviceNameInput.value,
              subtitle: serviceSubtitleInput.value,
              category: serviceCategoryInput.value,
              sessions: serviceSessionsInput.value,
              regularPrice: serviceRegularPriceInput.value || "12 MSI disponibles",
              specialPrice: serviceSpecialPriceInput.value,
              image: serviceImageInput.value,
              desc: serviceDescInput.value,
              specs: specsArray,
              active: serviceActiveCheckbox.checked
            };
          }
        } else {
          const newProtocol = {
            id: 'serv_' + Date.now(),
            name: serviceNameInput.value,
            subtitle: serviceSubtitleInput.value,
            category: serviceCategoryInput.value,
            sessions: serviceSessionsInput.value,
            regularPrice: serviceRegularPriceInput.value || "12 MSI disponibles",
            specialPrice: serviceSpecialPriceInput.value,
            image: serviceImageInput.value,
            desc: serviceDescInput.value,
            specs: specsArray,
            active: serviceActiveCheckbox.checked
          };
          services.unshift(newProtocol);
        }

        saveServices();
        renderTable();
        serviceModal.classList.remove('active');
      });
    }

    renderTable();
  }
});
