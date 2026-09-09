/**
 * CASA FÉNIX - Lógica de la Página de Inicio
 * Consume los datos compartidos en localStorage desde el Dashboard.
 */

// Catálogo Predeterminado de Tratamientos Oficiales
const INITIAL_SERVICES = [
  {
    id: "serv_1",
    name: "Transforma",
    subtitle: "Todo tu Cuerpo",
    category: "corporal",
    sessions: "16 Sesiones",
    desc: "Reafirma, moldea y define. Combinación de 8 sesiones de aparatología y 8 de lipoenzimas focalizadas.",
    specs: ["Radiofrecuencia, Cavitación & Vacuodermia", "Ondas de choque & Drenaje Linfático", "Abdomen, flancos, glúteos y piernas"],
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
    desc: "Mirada fresca, descansada y luminosa. Estimula el colágeno y desintoxica tejidos periorbitales.",
    specs: ["Carbóx Facial oxigenante", "Bioestimulación celular profunda", "Radiofrecuencia periocular"],
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
    desc: "Define y tonifica el óvalo mandibular y cuello. Reduce adiposidad submentoniana con tensión dérmica.",
    specs: ["6 RF + 6 Ultrasonido Tonificante", "3 Sesiones de Lipoenzimas Reductoras", "Valoración diagnóstica incluida"],
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
    desc: "Restaura la elasticidad cutánea rompiendo septos fibrosos en glúteos, cadera y piernas.",
    specs: ["Ondas de choque acústicas", "Vacuoterapia & Drenaje linfático", "Efecto push-up reafirmante"],
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
    desc: "Depilación láser médica indolora, de alta potencia y efectiva en todo tipo de piel.",
    specs: ["Piernas completas, Brazos, Axilas y Bikini", "Espalda, Abdomen y Glúteos", "Ahorro especial de $4,501"],
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
    desc: "Cierra una suite privada con masajes, faciales glow, mimosas ilimitadas y amenidades gourmet.",
    specs: ["Grupos de 2 a 15 personas", "Batas bordadas, brindis y aromaterapia", "Duración: de 3 a 5 horas privadas"],
    regularPrice: "Desde 2 personas",
    specialPrice: "Desde $1,800 p/p",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    active: true
  }
];

const INITIAL_ANNOUNCEMENT = {
  text: "<i class='fa-solid fa-sparkles'></i> <strong>Especial Septiembre:</strong> Hasta 12 Meses Sin Intereses en todos los protocolos integrales.",
  enabled: true
};

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = "5215500000000";

  // Recuperación y autodiagnóstico de localStorage
  let storedServices = JSON.parse(localStorage.getItem('fenix_services'));
  
  // Si no existe o está vacío, reinyectar catálogo inicial para que siempre sea visible
  if (!storedServices || !Array.isArray(storedServices) || storedServices.length === 0) {
    storedServices = INITIAL_SERVICES;
    localStorage.setItem('fenix_services', JSON.stringify(INITIAL_SERVICES));
  }

  let announcement = JSON.parse(localStorage.getItem('fenix_announcement')) || INITIAL_ANNOUNCEMENT;
  if (!localStorage.getItem('fenix_announcement')) {
    localStorage.setItem('fenix_announcement', JSON.stringify(INITIAL_ANNOUNCEMENT));
  }

  /* 1. RENDER CINTILLA SUPERIOR */
  const announcementBar = document.getElementById('announcementBar');
  const announcementText = document.getElementById('announcementText');

  if (announcementBar && announcementText) {
    if (!announcement.enabled) {
      announcementBar.style.display = 'none';
    } else {
      announcementBar.style.display = 'flex';
      announcementText.innerHTML = announcement.text;
    }
  }

  /* 2. RENDER TRATAMIENTOS ACTIVOS */
  const servicesGrid = document.getElementById('servicesGrid');
  const bookServiceSelect = document.getElementById('bookService');

  function renderPublicCards() {
    if (!servicesGrid) return;
    servicesGrid.innerHTML = '';
    if (bookServiceSelect) bookServiceSelect.innerHTML = '';

    // Filtrar los que tengan la propiedad active !== false
    const activeServices = storedServices.filter(s => s.active !== false);

    activeServices.forEach(serv => {
      // Poblar el select del Hero
      if (bookServiceSelect) {
        const opt = document.createElement('option');
        opt.value = `${serv.name} ${serv.subtitle} (${serv.specialPrice})`;
        opt.textContent = `${serv.name} ${serv.subtitle} - ${serv.specialPrice}`;
        bookServiceSelect.appendChild(opt);
      }

      // Crear tarjeta HTML
      const card = document.createElement('article');
      card.className = `card-item ${serv.category === 'spa-party' ? 'featured-spa-card' : ''}`;
      card.setAttribute('data-cat', serv.category);

      const specsList = (serv.specs || []).map(sp => `<li><i class="fa-solid fa-check"></i> ${sp}</li>`).join('');

      card.innerHTML = `
        <div class="card-image-wrap">
          <span class="card-ribbon">${serv.sessions}</span>
          <img src="${serv.image}" alt="${serv.name}" loading="lazy" />
        </div>
        <div class="card-content">
          <span class="card-category">${(serv.category || 'ESTÉTICA').toUpperCase()}</span>
          <h3 class="card-title">${serv.name}</h3>
          <div class="card-subtitle">${serv.subtitle}</div>
          <p class="card-desc">${serv.desc}</p>
          <ul class="card-specs">${specsList}</ul>
          <div class="card-footer">
            <div class="price-block">
              <span class="regular">${serv.regularPrice}</span>
              <span class="current">${serv.specialPrice}</span>
            </div>
            <button class="btn-select-service" data-name="${serv.name} ${serv.subtitle}" data-price="${serv.specialPrice}">Reservar</button>
          </div>
        </div>
      `;
      servicesGrid.appendChild(card);
    });

    attachBookingModalListeners();
  }

  renderPublicCards();

  /* 3. COTIZADOR DE SPA PARTY */
  const partyPackage = document.getElementById('partyPackage');
  const partyGuestsRange = document.getElementById('partyGuestsRange');
  const partyGuestsCount = document.getElementById('partyGuestsCount');
  const addMimosas = document.getElementById('addMimosas');
  const addGourmet = document.getElementById('addGourmet');
  const partyEstimatedTotal = document.getElementById('partyEstimatedTotal');
  const btnBookParty = document.getElementById('btnBookParty');

  function calculateParty() {
    if (!partyPackage || !partyGuestsRange) return;
    const base = parseInt(partyPackage.value, 10);
    const guests = parseInt(partyGuestsRange.value, 10);
    const mimosas = addMimosas && addMimosas.checked ? parseInt(addMimosas.value, 10) : 0;
    const gourmet = addGourmet && addGourmet.checked ? parseInt(addGourmet.value, 10) : 0;

    const total = (base + mimosas + gourmet) * guests;
    if (partyGuestsCount) partyGuestsCount.textContent = `${guests} personas`;
    if (partyEstimatedTotal) partyEstimatedTotal.textContent = `$${total.toLocaleString('es-MX')} MXN`;

    return {
      guests,
      pkg: partyPackage.options[partyPackage.selectedIndex].text.split(' - ')[0],
      total
    };
  }

  if (partyPackage && partyGuestsRange) {
    partyPackage.addEventListener('change', calculateParty);
    partyGuestsRange.addEventListener('input', calculateParty);
    if (addMimosas) addMimosas.addEventListener('change', calculateParty);
    if (addGourmet) addGourmet.addEventListener('change', calculateParty);
    calculateParty();

    if (btnBookParty) {
      btnBookParty.addEventListener('click', () => {
        const data = calculateParty();
        const message = `🥂 *Reserva Spa Party - Casa Fénix* 🥂\n\n` +
                        `• *Plan:* ${data.pkg}\n` +
                        `• *Asistentes:* ${data.guests} personas\n` +
                        `• *Total Estimado:* $${data.total.toLocaleString('es-MX')} MXN\n\n` +
                        `Deseo consultar fechas y suite disponible.`;
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
      });
    }
  }

  /* 4. BUSCADOR & FILTROS POR CATEGORÍA */
  const toggleSearch = document.getElementById('toggleSearch');
  const searchContainer = document.getElementById('searchContainer');
  const closeSearch = document.getElementById('closeSearch');
  const searchInput = document.getElementById('searchInput');

  if (toggleSearch && searchContainer && searchInput) {
    toggleSearch.addEventListener('click', () => {
      searchContainer.classList.toggle('open');
      if (searchContainer.classList.contains('open')) searchInput.focus();
    });

    closeSearch.addEventListener('click', () => searchContainer.classList.remove('open'));

    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.card-item').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? 'flex' : 'none';
      });
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      document.querySelectorAll('.card-item').forEach(card => {
        card.style.display = (cat === 'todos' || card.getAttribute('data-cat') === cat) ? 'flex' : 'none';
      });
    });
  });

  /* 5. MODAL DE RESERVACIÓN */
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalServiceName = document.getElementById('modalServiceName');
  const modalServicePrice = document.getElementById('modalServicePrice');
  const modalBookingForm = document.getElementById('modalBookingForm');

  function attachBookingModalListeners() {
    document.querySelectorAll('.btn-select-service').forEach(btn => {
      btn.addEventListener('click', () => {
        if (modalServiceName) modalServiceName.textContent = btn.getAttribute('data-name');
        if (modalServicePrice) modalServicePrice.textContent = btn.getAttribute('data-price');
        if (bookingModal) bookingModal.classList.add('active');
      });
    });
  }

  if (closeModalBtn && bookingModal) {
    closeModalBtn.addEventListener('click', () => bookingModal.classList.remove('active'));
  }

  if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const branch = document.getElementById('custBranch').value;
      const service = modalServiceName.textContent;
      const price = modalServicePrice.textContent;

      const message = `✨ *Solicitud de Cita - Casa Fénix* ✨\n\n` +
                      `• *Protocolo:* ${service} (${price})\n` +
                      `• *Sucursal:* ${branch}\n` +
                      `• *Paciente:* ${name}\n` +
                      `• *WhatsApp:* ${phone}\n\n` +
                      `Deseo confirmar disponibilidad en cabina.`;

      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
      bookingModal.classList.remove('active');
      modalBookingForm.reset();
    });
  }

  const quickBookingForm = document.getElementById('bookingForm');
  if (quickBookingForm) {
    quickBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const branch = document.getElementById('bookBranch').value;
      const service = document.getElementById('bookService').value;
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;

      const message = `🌿 *Reserva en Línea - Casa Fénix* 🌿\n\n` +
                      `• *Servicio:* ${service}\n` +
                      `• *Sucursal:* ${branch}\n` +
                      `• *Fecha sugerida:* ${date}\n` +
                      `• *Horario:* ${time}\n\n` +
                      `Favor de confirmar cita diagnóstica.`;

      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
    });
  }

  /* 6. FAQ ACCORDION */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const isActive = parent.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      if (!isActive) parent.classList.add('active');
    });
  });
});
