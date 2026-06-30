/**
 * Página de Agendamiento - Sagomu
 * Manejo del formulario de solicitudes de examen
 */

const AgendarPage = {
    certificaciones: [],
    certificacionSeleccionada: null,

    /**
     * Inicializar la página
     */
    async init() {
        try {
            // Cargar certificaciones
            await this.cargarCertificaciones();

            // Verificar si hay una certificación preseleccionada
            this.verificarCertificacionPreseleccionada();

            // Poblar el select de certificaciones
            this.poblarSelectCertificaciones();

            // Configurar el formulario
            this.configurarFormulario();

        } catch (error) {
            console.error('Error al inicializar la página:', error);
            this.mostrarError('Error al cargar las certificaciones. Por favor, recarga la página.');
        }
    },

    /**
     * Cargar certificaciones desde el JSON
     */
    async cargarCertificaciones() {
        try {
            const response = await fetch('data/certificaciones.json');

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const jsonData = await response.json();

            // Verificar si los datos están en un objeto con propiedad certificaciones
            this.certificaciones = jsonData.certificaciones || jsonData;

            console.log(`✅ Se cargaron ${this.certificaciones.length} certificaciones`);

        } catch (error) {
            console.error('Error al cargar certificaciones:', error);
            throw error;
        }
    },

    /**
     * Verificar si hay una certificación preseleccionada en la URL
     */
    verificarCertificacionPreseleccionada() {
        const urlParams = new URLSearchParams(window.location.search);
        const certId = urlParams.get('cert');

        if (certId) {
            this.certificacionSeleccionada = this.certificaciones.find(cert => cert.id === certId);

            if (this.certificacionSeleccionada) {
                this.mostrarCertificacionSeleccionada();
                // Preseleccionar en el select
                setTimeout(() => {
                    const select = document.getElementById('certificacion');
                    if (select) {
                        select.value = certId;
                    }
                }, 100);
            }
        }
    },

    /**
     * Mostrar la certificación seleccionada
     */
    mostrarCertificacionSeleccionada() {
        const certInfoSection = document.getElementById('cert-info');
        const logoImg = document.getElementById('selected-logo');
        const nameH3 = document.getElementById('selected-name');
        const brandP = document.getElementById('selected-brand');
        const categorySpan = document.getElementById('selected-category');

        if (certInfoSection) {
            certInfoSection.classList.remove('hidden');
        }

        if (logoImg && this.certificacionSeleccionada) {
            logoImg.src = this.certificacionSeleccionada.imagenLogo;
            logoImg.alt = `${this.certificacionSeleccionada.marca} Logo`;
        }

        if (nameH3 && this.certificacionSeleccionada) {
            nameH3.textContent = this.certificacionSeleccionada.nombreExamen;
        }

        if (brandP && this.certificacionSeleccionada) {
            brandP.textContent = this.certificacionSeleccionada.marca;
        }

        if (categorySpan && this.certificacionSeleccionada) {
            categorySpan.textContent = this.certificacionSeleccionada.categoria;
        }
    },

    /**
     * Poblar el select de certificaciones
     */
    poblarSelectCertificaciones() {
        const select = document.getElementById('certificacion');
        if (!select) return;

        // Ordenar certificaciones por categoría y nombre
        const certificacionesOrdenadas = [...this.certificaciones].sort((a, b) => {
            if (a.categoria !== b.categoria) {
                return a.categoria.localeCompare(b.categoria);
            }
            return a.nombreExamen.localeCompare(b.nombreExamen);
        });

        // Crear opciones agrupadas por categoría
        let categoriaActual = '';
        const grupos = {};

        certificacionesOrdenadas.forEach(cert => {
            if (!grupos[cert.categoria]) {
                grupos[cert.categoria] = [];
            }
            grupos[cert.categoria].push(cert);
        });

        // Limpiar select (mantener solo la opción por defecto)
        select.innerHTML = '<option value="">Seleccione una certificación</option>';

        // Agregar opciones agrupadas
        Object.keys(grupos).forEach(categoria => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = categoria;

            grupos[categoria].forEach(cert => {
                const option = document.createElement('option');
                option.value = cert.id;
                option.textContent = `${cert.nombreExamen} (${cert.marca})`;
                optgroup.appendChild(option);
            });

            select.appendChild(optgroup);
        });
    },

    /**
     * Configurar el formulario
     */
    configurarFormulario() {
        const form = document.getElementById('agendar-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarFormulario(form);
        });

        // Establecer fecha mínima (hoy)
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) {
            const hoy = new Date().toISOString().split('T')[0];
            fechaInput.min = hoy;
        }
    },

    /**
     * Procesar el formulario
     */
    procesarFormulario(form) {
        // Recopilar datos del formulario
        const formData = new FormData(form);
        const datos = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            certificacion: formData.get('certificacion'),
            fecha: formData.get('fecha'),
            horario: formData.get('horario'),
            mensaje: formData.get('mensaje'),
            terminos: formData.get('terminos') === 'on'
        };

        // Validar campos requeridos
        if (!datos.nombre || !datos.email || !datos.telefono || !datos.certificacion || !datos.terminos) {
            this.mostrarError('Por favor, completa todos los campos requeridos.');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.email)) {
            this.mostrarError('Por favor, ingresa un email válido.');
            return;
        }

        // Obtener información de la certificación seleccionada
        const certificacion = this.certificaciones.find(c => c.id === datos.certificacion);
        if (certificacion) {
            datos.certificacionInfo = {
                nombre: certificacion.nombreExamen,
                marca: certificacion.marca,
                categoria: certificacion.categoria
            };
        }

        console.log('📝 Datos del formulario:', datos);

        // Aquí iría la lógica para enviar los datos al servidor
        // Por ahora, mostramos un mensaje de éxito
        this.mostrarExito(datos);

        // En un caso real, aquí harías una petición AJAX al servidor
        // fetch('/api/agendar', { method: 'POST', body: JSON.stringify(datos) })
    },

    /**
     * Mostrar mensaje de éxito
     */
    mostrarExito(datos) {
        const form = document.getElementById('agendar-form');
        const certInfoSection = document.getElementById('cert-info');

        // Crear mensaje de éxito
        const successDiv = document.createElement('div');
        successDiv.className = 'status-message success';
        successDiv.innerHTML = `
            <h3>✅ Solicitud Enviada Exitosamente</h3>
            <p>Gracias ${datos.nombre}, hemos recibido tu solicitud para agendar:</p>
            <p><strong>${datos.certificacionInfo.nombre}</strong> - ${datos.certificacionInfo.marca}</p>
            <p>Te contactaremos a la brevedad posible en:</p>
            <p>📧 ${datos.email} | 📱 ${datos.telefono}</p>
            ${datos.fecha ? `<p>Fecha preferente: ${this.formatoFecha(datos.fecha)}</p>` : ''}
            ${datos.horario ? `<p>Horario: ${this.formatoHorario(datos.horario)}</p>` : ''}
            <div class="success-actions">
                <button class="btn btn-primary" onclick="window.location.href='certificaciones.html'">Ver Otras Certificaciones</button>
                <button class="btn btn-outline-secondary" onclick="window.location.href='index.html'">Volver al Inicio</button>
            </div>
        `;

        // Ocultar formularios y mostrar mensaje
        if (form) form.style.display = 'none';
        if (certInfoSection) certInfoSection.style.display = 'none';

        // Insertar el mensaje después del page header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader && pageHeader.nextSibling) {
            pageHeader.parentNode.insertBefore(successDiv, pageHeader.nextSibling);
        }
    },

    /**
     * Mostrar mensaje de error
     */
    mostrarError(mensaje) {
        // Remover mensajes anteriores
        const mensajesAnteriores = document.querySelectorAll('.status-message.error');
        mensajesAnteriores.forEach(msg => msg.remove());

        // Crear nuevo mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'status-message error';
        errorDiv.innerHTML = `
            <h3>❌ Error</h3>
            <p>${mensaje}</p>
            <button class="btn btn-outline-secondary" onclick="this.parentElement.remove()">Cerrar</button>
        `;

        // Insertar al inicio del formulario
        const form = document.getElementById('agendar-form');
        if (form && form.firstChild) {
            form.insertBefore(errorDiv, form.firstChild);
        }

        // Remover automáticamente después de 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    },

    /**
     * Formato de fecha
     */
    formatoFecha(fecha) {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones);
    },

    /**
     * Formato de horario
     */
    formatoHorario(horario) {
        const horarios = {
            'morning': 'Mañana (9:00 - 12:00)',
            'afternoon': 'Tarde (14:00 - 18:00)',
            'evening': 'Noche (18:00 - 21:00)'
        };
        return horarios[horario] || horario;
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AgendarPage.init();
    });
} else {
    AgendarPage.init();
}