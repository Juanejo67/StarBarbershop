// Datos de ejemplo
const services = [
    {
      id: 1,
      name: "Corte Clásico",
      description: "Corte tradicional con tijeras y máquina, incluye lavado y peinado.",
      price: 15,
      duration: 30,
      image: "logo.jpeg",
    },
    {
      id: 2,
      name: "Corte + Barba",
      description: "Corte de cabello completo más arreglo y perfilado de barba.",
      price: 25,
      duration: 45,
      image: "logo.jpeg",
    },
    {
      id: 3,
      name: "Afeitado Tradicional",
      description: "Afeitado con navaja tradicional, incluye toalla caliente y mascarilla.",
      price: 18,
      duration: 30,
      image: "logo.jpeg",
    },
    {
      id: 4,
      name: "Corte Fade",
      description: "Degradado perfecto con detalles personalizados según tu estilo.",
      price: 20,
      duration: 40,
      image: "logo.jpeg",
    },
    {
      id: 5,
      name: "Coloración",
      description: "Aplicación de color para cubrir canas o cambiar tu look.",
      price: 35,
      duration: 60,
      image: "logo.jpeg",
    },
    {
      id: 6,
      name: "Diseño Personalizado",
      description: "Diseños y figuras personalizadas en tu corte de cabello.",
      price: 30,
      duration: 45,
      image: "logo.jpeg",
    },
  ]
  
  let appointments = [
    {
      id: 1,
      service: "Corte + Barba",
      date: "15 de abril, 2025",
      rawDate: "2025-04-15T10:30:00.000Z",
      time: "10:30",
      price: 25,
      status: "confirmed",
      client: "Juan Pérez",
      phone: "555-123-4567",
    },
    {
      id: 2,
      service: "Corte Fade",
      date: "22 de abril, 2025",
      rawDate: "2025-04-22T16:00:00.000Z",
      time: "16:00",
      price: 20,
      status: "confirmed",
      client: "Carlos Rodríguez",
      phone: "555-987-6543",
    },
    {
      id: 3,
      service: "Corte Clásico",
      date: "1 de marzo, 2025",
      rawDate: "2025-03-01T11:00:00.000Z",
      time: "11:00",
      price: 15,
      status: "completed",
      client: "Miguel Ángel",
      phone: "555-456-7890",
    },
    {
      id: 4,
      service: "Afeitado Tradicional",
      date: "15 de marzo, 2025",
      rawDate: "2025-03-15T09:30:00.000Z",
      time: "09:30",
      price: 18,
      status: "cancelled",
      client: "Roberto Sánchez",
      phone: "555-789-0123",
    },
  ]
  
  // Variables globales para la reserva
  let selectedDate = null
  let selectedTime = null
  let selectedService = null
  let reservationStep = 1
  let currentAppointmentToCancel = null
  
  // Inicialización cuando el DOM está cargado
  document.addEventListener("DOMContentLoaded", () => {
    // Inicializar año actual en el footer
    document.getElementById("currentYear").textContent = new Date().getFullYear()
  
    // Cargar servicios
    loadServices()
  
    // Cargar citas
    loadAppointments()
  
    // Inicializar eventos
    initEvents()
  
    // Inicializar calendario
    initCalendar()
  })
  
  // Cargar servicios en la sección de servicios
  function loadServices() {
    const servicesGrid = document.getElementById("servicesGrid")
  
    services.forEach((service) => {
      const serviceCard = document.createElement("div")
      serviceCard.className = "service-card"
      serviceCard.innerHTML = `
        <div class="service-image" style="background-image: url('${service.image}')"></div>
        <div class="service-content">
          <div class="service-header">
            <h3 class="service-title">${service.name}</h3>
            <span class="service-price">$${service.price}</span>
          </div>
          <p class="service-duration">${service.duration} minutos</p>
          <p class="service-description">${service.description}</p>
          <div class="service-footer">
            <button class="btn btn-outline book-service" data-service-id="${service.id}">Reservar</button>
          </div>
        </div>
      `
      servicesGrid.appendChild(serviceCard)
    })
  
    // Agregar eventos a los botones de reserva
    document.querySelectorAll(".book-service").forEach((button) => {
      button.addEventListener("click", function () {
        const serviceId = Number.parseInt(this.getAttribute("data-service-id"))
        selectedService = serviceId
        document.getElementById("reservar").scrollIntoView({ behavior: "smooth" })
  
        // Si estamos en el paso 2, actualizar la selección
        if (reservationStep === 2) {
          updateServiceSelection()
        }
      })
    })
  }
  
  // Cargar citas en las pestañas
  function loadAppointments() {
    // Filtrar citas por estado
    const upcomingAppointments = appointments.filter((app) => app.status === "confirmed")
    const pastAppointments = appointments.filter((app) => app.status === "completed")
    const cancelledAppointments = appointments.filter((app) => app.status === "cancelled")
  
    // Cargar citas próximas
    const upcomingContainer = document.getElementById("upcomingAppointments")
    if (upcomingAppointments.length === 0) {
      upcomingContainer.innerHTML = `
        <div class="empty-state">
          <p>No tienes citas próximas programadas.</p>
          <button class="btn btn-primary" id="bookNowBtn">Reservar Ahora</button>
        </div>
      `
      document.getElementById("bookNowBtn")?.addEventListener("click", () => {
        document.getElementById("reservar").scrollIntoView({ behavior: "smooth" })
      })
    } else {
      upcomingContainer.innerHTML = ""
      upcomingAppointments.forEach((appointment) => {
        upcomingContainer.appendChild(createAppointmentCard(appointment, false, false))
      })
    }
  
    // Cargar citas pasadas
    const pastContainer = document.getElementById("pastAppointments")
    if (pastAppointments.length === 0) {
      pastContainer.innerHTML = `
        <div class="empty-state">
          <p>No tienes citas pasadas.</p>
        </div>
      `
    } else {
      pastContainer.innerHTML = ""
      pastAppointments.forEach((appointment) => {
        pastContainer.appendChild(createAppointmentCard(appointment, true, false))
      })
    }
  
    // Cargar citas canceladas
    const cancelledContainer = document.getElementById("cancelledAppointments")
    if (cancelledAppointments.length === 0) {
      cancelledContainer.innerHTML = `
        <div class="empty-state">
          <p>No tienes citas canceladas.</p>
        </div>
      `
    } else {
      cancelledContainer.innerHTML = ""
      cancelledAppointments.forEach((appointment) => {
        cancelledContainer.appendChild(createAppointmentCard(appointment, false, true))
      })
    }
  }
  
  // Crear tarjeta de cita
  function createAppointmentCard(appointment, isPast = false, isCancelled = false) {
    const card = document.createElement("div")
    card.className = "appointment-card"
  
    let statusClass = "status-confirmed"
    let statusText = "Confirmada"
  
    if (isPast) {
      statusClass = "status-completed"
      statusText = "Completada"
    } else if (isCancelled) {
      statusClass = "status-cancelled"
      statusText = "Cancelada"
    }
  
    card.innerHTML = `
      <div class="appointment-header">
        <div>
          <h3 class="appointment-title">${appointment.service}</h3>
          <p class="appointment-status ${statusClass}">${statusText}</p>
        </div>
        ${
          !isPast && !isCancelled
            ? `
          <button class="btn btn-outline cancel-appointment" data-appointment-id="${appointment.id}">
            <i class="fas fa-times"></i> Cancelar
          </button>
        `
            : ""
        }
      </div>
      <div class="appointment-content">
        <div class="appointment-detail">
          <i class="fas fa-calendar"></i>
          <span>${appointment.date}</span>
        </div>
        <div class="appointment-detail">
          <i class="fas fa-clock"></i>
          <span>${appointment.time}</span>
        </div>
        ${
          appointment.client
            ? `
          <div class="appointment-info">
            <span class="appointment-label">Cliente:</span>
            <span>${appointment.client}</span>
          </div>
        `
            : ""
        }
        ${
          appointment.phone
            ? `
          <div class="appointment-info">
            <span class="appointment-label">Teléfono:</span>
            <span>${appointment.phone}</span>
          </div>
        `
            : ""
        }
        <div class="appointment-info">
          <span class="appointment-label">Precio:</span>
          <span class="appointment-value">$${appointment.price}</span>
        </div>
      </div>
    `
  
    // Agregar evento para cancelar cita
    setTimeout(() => {
      const cancelBtn = card.querySelector(".cancel-appointment")
      if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
          const appointmentId = Number.parseInt(this.getAttribute("data-appointment-id"))
          currentAppointmentToCancel = appointmentId
          document.getElementById("cancelModal").classList.add("active")
        })
      }
    }, 0)
  
    return card
  }
  
  // Inicializar eventos
  function initEvents() {
    // Navegación móvil
    document.getElementById("menuToggle").addEventListener("click", () => {
      document.getElementById("mobileMenu").classList.add("active")
    })
  
    document.getElementById("closeMenu").addEventListener("click", () => {
      document.getElementById("mobileMenu").classList.remove("active")
    })
  
    // Enlaces de navegación
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        document.getElementById("mobileMenu").classList.remove("active")
      })
    })
  
    // Selector de fecha
    document.getElementById("datePickerInput").addEventListener("click", () => {
      document.getElementById("datePickerPopup").classList.toggle("active")
    })
  
    // Pestañas de citas
    document.querySelectorAll(".tab-button").forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabId = this.getAttribute("data-tab")
  
        // Actualizar botones de pestañas
        document.querySelectorAll(".tab-button").forEach((t) => t.classList.remove("active"))
        this.classList.add("active")
  
        // Actualizar contenido de pestañas
        document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))
        document.getElementById(`${tabId}Tab`).classList.add("active")
      })
    })
  
    // Botones de navegación de reserva
    document.getElementById("nextButton").addEventListener("click", handleReservationNext)
    document.getElementById("backButton").addEventListener("click", handleReservationBack)
  
    // Modal de cancelación
    document.getElementById("closeModal").addEventListener("click", () => {
      document.getElementById("cancelModal").classList.remove("active")
    })
  
    document.getElementById("cancelModalBack").addEventListener("click", () => {
      document.getElementById("cancelModal").classList.remove("active")
    })
  
    document.getElementById("confirmCancel").addEventListener("click", () => {
      if (currentAppointmentToCancel) {
        cancelAppointment(currentAppointmentToCancel)
        document.getElementById("cancelModal").classList.remove("active")
      }
    })
  }
  
  // Inicializar calendario
  function initCalendar() {
    const today = new Date()
    let currentMonth = today.getMonth()
    let currentYear = today.getFullYear()
  
    // Actualizar mes actual en el encabezado
    updateCalendarHeader(currentMonth, currentYear)
  
    // Generar días del mes
    generateCalendarDays(currentMonth, currentYear)
  
    // Botones de navegación del calendario
    document.getElementById("prevMonth").addEventListener("click", () => {
      currentMonth--
      if (currentMonth < 0) {
        currentMonth = 11
        currentYear--
      }
      updateCalendarHeader(currentMonth, currentYear)
      generateCalendarDays(currentMonth, currentYear)
    })
  
    document.getElementById("nextMonth").addEventListener("click", () => {
      currentMonth++
      if (currentMonth > 11) {
        currentMonth = 0
        currentYear++
      }
      updateCalendarHeader(currentMonth, currentYear)
      generateCalendarDays(currentMonth, currentYear)
    })
  }
  
  // Actualizar encabezado del calendario
  function updateCalendarHeader(month, year) {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    document.getElementById("currentMonth").textContent = `${monthNames[month]} ${year}`
  }
  
  // Generar días del calendario
  function generateCalendarDays(month, year) {
    const calendarDays = document.getElementById("calendarDays")
    calendarDays.innerHTML = ""
  
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
  
    // Ajustar el primer día de la semana (0 = domingo, 1 = lunes, etc.)
    let firstDayOfWeek = firstDay.getDay() - 1
    if (firstDayOfWeek < 0) firstDayOfWeek = 6 // Si es domingo (0), convertir a 6
  
    // Días del mes anterior
    for (let i = 0; i < firstDayOfWeek; i++) {
      const dayElement = document.createElement("div")
      dayElement.className = "day disabled"
      calendarDays.appendChild(dayElement)
    }
  
    // Días del mes actual
    const today = new Date()
    today.setHours(0, 0, 0, 0)
  
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div")
      dayElement.className = "day"
      dayElement.textContent = i
  
      const currentDate = new Date(year, month, i)
  
      // Marcar día actual
      if (currentDate.getTime() === today.getTime()) {
        dayElement.classList.add("today")
      }
  
      // Deshabilitar días pasados y domingos
      if (currentDate < today || currentDate.getDay() === 0) {
        dayElement.classList.add("disabled")
      } else {
        dayElement.addEventListener("click", function () {
          // Desmarcar día seleccionado anterior
          document.querySelectorAll(".day.selected").forEach((day) => day.classList.remove("selected"))
  
          // Marcar día seleccionado
          this.classList.add("selected")
  
          // Actualizar fecha seleccionada
          selectedDate = new Date(year, month, i)
  
          // Actualizar texto de fecha seleccionada
          const options = { day: "numeric", month: "long", year: "numeric" }
          document.getElementById("selectedDateText").textContent = selectedDate.toLocaleDateString("es-ES", options)
  
          // Cerrar popup de calendario
          document.getElementById("datePickerPopup").classList.remove("active")
  
          // Generar horarios disponibles
          generateAvailableTimeSlots()
        })
      }
  
      calendarDays.appendChild(dayElement)
    }
  }
  
  // Generar horarios disponibles
  function generateAvailableTimeSlots() {
    const timeSlotsContainer = document.getElementById("timeSlots")
    timeSlotsContainer.innerHTML = ""
  
    let availableHours = []
  
    if (selectedDate) {
      const day = selectedDate.getDay() // 0 = domingo, 1 = lunes, etc.
  
      // Menos horarios disponibles los sábados, cerrado los domingos
      if (day === 6) {
        // Sábado
        availableHours = ["09:00", "10:00", "11:00", "12:00", "13:00"]
      } else if (day === 0) {
        // Domingo
        availableHours = []
      } else {
        // Lunes a viernes
        availableHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "16:00", "17:00", "18:00"]
      }
  
      // Filtrar horas ya ocupadas
      const bookedTimes = appointments
        .filter((app) => {
          const appDate = new Date(app.rawDate)
          return (
            appDate.getDate() === selectedDate.getDate() &&
            appDate.getMonth() === selectedDate.getMonth() &&
            appDate.getFullYear() === selectedDate.getFullYear()
          )
        })
        .map((app) => app.time)
  
      availableHours = availableHours.filter((time) => !bookedTimes.includes(time))
    }
  
    if (availableHours.length === 0) {
      timeSlotsContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <p>No hay horarios disponibles para esta fecha.</p>
          <p>Por favor, selecciona otra fecha.</p>
        </div>
      `
    } else {
      availableHours.forEach((time) => {
        const timeSlot = document.createElement("div")
        timeSlot.className = "time-slot"
        timeSlot.textContent = time
  
        if (selectedTime === time) {
          timeSlot.classList.add("selected")
        }
  
        timeSlot.addEventListener("click", function () {
          document.querySelectorAll(".time-slot.selected").forEach((slot) => slot.classList.remove("selected"))
          this.classList.add("selected")
          selectedTime = time
  
          // Actualizar botón siguiente
          updateNextButton()
  
          // Actualizar resumen
          updateBookingSummary()
        })
  
        timeSlotsContainer.appendChild(timeSlot)
      })
    }
  
    // Mostrar contenedor de horarios
    document.getElementById("timeSelectionContainer").style.display = "block"
  
    // Actualizar botón siguiente
    updateNextButton()
  }
  
  // Actualizar selección de servicio
  function updateServiceSelection() {
    const serviceSelection = document.getElementById("serviceSelection")
    serviceSelection.innerHTML = ""
  
    services.forEach((service) => {
      const serviceOption = document.createElement("div")
      serviceOption.className = "service-option"
      if (selectedService === service.id) {
        serviceOption.classList.add("selected")
      }
  
      serviceOption.innerHTML = `
        <div class="service-option-image" style="background-image: url('${service.image}')"></div>
        <div class="service-option-content">
          <div class="service-option-header">
            <h4 class="service-option-title">${service.name}</h4>
            <span class="service-option-price">$${service.price}</span>
          </div>
          <p class="service-option-duration">${service.duration} min</p>
        </div>
      `
  
      serviceOption.addEventListener("click", function () {
        document.querySelectorAll(".service-option.selected").forEach((option) => option.classList.remove("selected"))
        this.classList.add("selected")
        selectedService = service.id
  
        // Actualizar botón siguiente
        updateNextButton()
  
        // Actualizar resumen
        updateBookingSummary()
      })
  
      serviceSelection.appendChild(serviceOption)
    })
  }
  
  // Actualizar botón siguiente
  function updateNextButton() {
    const nextButton = document.getElementById("nextButton")
  
    switch (reservationStep) {
      case 1:
        nextButton.disabled = !selectedDate || !selectedTime
        break
      case 2:
        nextButton.disabled = selectedService === null
        break
      case 3:
        const clientName = document.getElementById("clientName").value
        const clientPhone = document.getElementById("clientPhone").value
        nextButton.disabled = !clientName || !clientPhone
        break
    }
  }
  
  // Actualizar resumen de reserva
  function updateBookingSummary() {
    const summaryContent = document.getElementById("summaryContent")
    const bookingSummary = document.getElementById("bookingSummary")
  
    if (selectedService !== null && selectedDate && selectedTime) {
      const service = services.find((s) => s.id === selectedService)
  
      if (service) {
        summaryContent.innerHTML = `
          <div class="summary-item">
            <span class="summary-label">Servicio:</span>
            <span class="summary-value">${service.name}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Fecha:</span>
            <span class="summary-value">${selectedDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Hora:</span>
            <span class="summary-value">${selectedTime}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Precio:</span>
            <span class="summary-value">$${service.price}</span>
          </div>
        `
  
        bookingSummary.style.display = "block"
      } else {
        bookingSummary.style.display = "none"
      }
    } else {
      bookingSummary.style.display = "none"
    }
  }
  
  // Manejar botón siguiente en reserva
  function handleReservationNext() {
    if (reservationStep < 3) {
      // Avanzar al siguiente paso
      reservationStep++
  
      // Actualizar indicadores de paso
      updateStepIndicators()
  
      // Actualizar contenido del paso
      updateStepContent()
  
      // Si es paso 2, cargar servicios
      if (reservationStep === 2) {
        updateServiceSelection()
      }
  
      // Si es paso 3, actualizar validación
      if (reservationStep === 3) {
        document.getElementById("clientName").addEventListener("input", updateNextButton)
        document.getElementById("clientPhone").addEventListener("input", updateNextButton)
      }
  
      // Actualizar botón siguiente
      updateNextButton()
    } else {
      // Crear nueva cita
      const clientName = document.getElementById("clientName").value
      const clientPhone = document.getElementById("clientPhone").value
      const service = services.find((s) => s.id === selectedService)
  
      if (service && selectedDate && selectedTime) {
        const newAppointment = {
          id: appointments.length + 1,
          service: service.name,
          date: selectedDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
          rawDate: selectedDate.toISOString(),
          time: selectedTime,
          price: service.price,
          status: "confirmed",
          client: clientName,
          phone: clientPhone,
        }
  
        // Agregar la nueva cita
        appointments.push(newAppointment)
  
        // Mostrar confirmación
        document.getElementById("bookingForm").style.display = "none"
        document.getElementById("bookingSummary").style.display = "none"
  
        // Actualizar resumen de confirmación
        const confirmationSummary = document.getElementById("confirmationSummary")
        confirmationSummary.innerHTML = `
          <div class="summary-item">
            <span class="summary-label">Servicio:</span>
            <span class="summary-value">${service.name}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Fecha:</span>
            <span class="summary-value">${newAppointment.date}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Hora:</span>
            <span class="summary-value">${selectedTime}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Precio:</span>
            <span class="summary-value">$${service.price}</span>
          </div>
        `
  
        document.getElementById("bookingConfirmation").style.display = "block"
  
        // Recargar citas después de un tiempo
        setTimeout(() => {
          // Resetear formulario
          selectedDate = null
          selectedTime = null
          selectedService = null
          reservationStep = 1
  
          document.getElementById("selectedDateText").textContent = "Selecciona una fecha"
          document.getElementById("clientName").value = ""
          document.getElementById("clientPhone").value = ""
  
          // Ocultar confirmación
          document.getElementById("bookingConfirmation").style.display = "none"
          document.getElementById("bookingForm").style.display = "block"
  
          // Actualizar indicadores de paso
          updateStepIndicators()
  
          // Actualizar contenido del paso
          updateStepContent()
  
          // Recargar citas
          loadAppointments()
  
          // Desplazarse a la sección de citas
          document.getElementById("citas").scrollIntoView({ behavior: "smooth" })
        }, 3000)
      }
    }
  }
  
  // Manejar botón atrás en reserva
  function handleReservationBack() {
    if (reservationStep > 1) {
      // Retroceder al paso anterior
      reservationStep--
  
      // Actualizar indicadores de paso
      updateStepIndicators()
  
      // Actualizar contenido del paso
      updateStepContent()
  
      // Actualizar botón siguiente
      updateNextButton()
    } else {
      // Resetear formulario
      selectedDate = null
      selectedTime = null
      selectedService = null
  
      document.getElementById("selectedDateText").textContent = "Selecciona una fecha"
      document.getElementById("timeSelectionContainer").style.display = "none"
      document.getElementById("bookingSummary").style.display = "none"
  
      // Actualizar botón siguiente
      updateNextButton()
    }
  }
  
  // Actualizar indicadores de paso
  function updateStepIndicators() {
    const indicators = document.querySelectorAll(".step-indicator")
  
    indicators.forEach((indicator, index) => {
      if (index < reservationStep) {
        indicator.classList.add("active")
      } else {
        indicator.classList.remove("active")
      }
    })
  
    // Actualizar título y descripción
    const stepTitle = document.getElementById("stepTitle")
    const stepDescription = document.getElementById("stepDescription")
  
    stepTitle.textContent = `Paso ${reservationStep} de 3`
  
    switch (reservationStep) {
      case 1:
        stepDescription.textContent = "Selecciona fecha y hora disponible"
        document.getElementById("backButton").textContent = "Cancelar"
        document.getElementById("nextButton").textContent = "Continuar"
        break
      case 2:
        stepDescription.textContent = "Elige el servicio que deseas"
        document.getElementById("backButton").textContent = "Atrás"
        document.getElementById("nextButton").textContent = "Continuar"
        break
      case 3:
        stepDescription.textContent = "Completa tus datos personales"
        document.getElementById("backButton").textContent = "Atrás"
        document.getElementById("nextButton").textContent = "Confirmar Cita"
        break
    }
  }
  
  // Actualizar contenido del paso
  function updateStepContent() {
    document.querySelectorAll(".step-content").forEach((content) => {
      content.classList.remove("active")
    })
  
    document.getElementById(`step${reservationStep}`).classList.add("active")
  }
  
  // Cancelar cita
  function cancelAppointment(id) {
    appointments = appointments.map((app) => (app.id === id ? { ...app, status: "cancelled" } : app))
  
    // Recargar citas
    loadAppointments()
  
    currentAppointmentToCancel = null
  }
  
  