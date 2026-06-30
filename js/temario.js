/**
 * Página Individual de Temario - Sagomu
 * Carga dinámica del temario de certificaciones
 */

const TemarioPage = {
    certificacion: null,

    /**
     * Inicializar la página
     */
    async init() {
        try {
            // Obtener el ID de la certificación de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const certId = urlParams.get('cert');

            if (!certId) {
                throw new Error('No se proporcionó ID de certificación');
            }

            // Cargar los datos de la certificación
            await this.cargarCertificacion(certId);

            // Renderizar el contenido
            this.renderizarTemario();

        } catch (error) {
            console.error('Error al cargar el temario:', error);
            this.mostrarError(error.message);
        }
    },

    /**
     * Cargar los datos de la certificación
     */
    async cargarCertificacion(certId) {
        try {
            const response = await fetch('data/certificaciones.json');

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const jsonData = await response.json();

            // Verificar si los datos están en un objeto con propiedad certificaciones
            const certificaciones = jsonData.certificaciones || jsonData;

            // Buscar la certificación específica
            this.certificacion = certificaciones.find(cert => cert.id === certId);

            if (!this.certificacion) {
                throw new Error(`No se encontró la certificación con ID: ${certId}`);
            }

            // Verificar si tiene información de temario (objetivos o módulos)
            if (!this.certificacion.objetivos && !this.certificacion.modulos) {
                throw new Error('La certificación no tiene temario disponible');
            }

            console.log('✅ Certificación cargada:', this.certificacion.nombreExamen);

        } catch (error) {
            console.error('Error al cargar certificación:', error);
            throw error;
        }
    },

    /**
     * Renderizar el temario en la página
     */
    renderizarTemario() {
        // Actualizar el título de la página
        document.title = `Temario: ${this.certificacion.nombreExamen} | Sagomu`;

        // Actualizar breadcrumbs
        const breadcrumbCurrent = document.querySelector('.breadcrumbs .current');
        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = this.certificacion.nombreExamen;
        }

        // Actualizar header de certificación
        const logoImg = document.querySelector('.cert-logo img');
        if (logoImg) {
            logoImg.src = this.certificacion.imagenLogo;
            logoImg.alt = `${this.certificacion.marca} Logo`;
        }

        const categorySpan = document.querySelector('.cert-category');
        if (categorySpan) {
            categorySpan.textContent = this.certificacion.categoria;
        }

        const titleH1 = document.querySelector('.cert-info h1');
        if (titleH1) {
            titleH1.textContent = this.certificacion.nombreExamen;
        }

        const brandP = document.querySelector('.cert-brand');
        if (brandP) {
            brandP.textContent = this.certificacion.marca;
        }

        const descP = document.querySelector('.cert-description');
        if (descP) {
            descP.textContent = this.certificacion.descripcion;
        }

        // Actualizar enlaces de agendar
        const agendarLinks = document.querySelectorAll('a[href*="agendar.html?cert="]');
        agendarLinks.forEach(link => {
            link.href = `agendar.html?cert=${this.certificacion.id}`;
        });

        // Renderizar objetivos
        this.renderizarObjetivos();

        // Renderizar módulos
        this.renderizarModulos();

        // Renderizar información del examen
        this.renderizarInfoExamen();

        // Renderizar requisitos
        this.renderizarRequisitos();

        // Renderizar duración total
        this.renderizarDuracionTotal();

        console.log('✅ Temario renderizado completamente');
    },

    /**
     * Renderizar objetivos
     */
    renderizarObjetivos() {
        const objetivosList = document.getElementById('objetivos');
        if (!objetivosList) return;

        objetivosList.innerHTML = '';

        if (!this.certificacion.objetivos || this.certificacion.objetivos.length === 0) {
            objetivosList.innerHTML = '<li>No hay objetivos disponibles para esta certificación.</li>';
            return;
        }

        this.certificacion.objetivos.forEach(objetivo => {
            const li = document.createElement('li');
            li.textContent = objetivo;
            objetivosList.appendChild(li);
        });
    },

    /**
     * Renderizar módulos
     */
    renderizarModulos() {
        const modulosContainer = document.getElementById('modulos');
        if (!modulosContainer) return;

        modulosContainer.innerHTML = '';

        if (!this.certificacion.modulos || this.certificacion.modulos.length === 0) {
            modulosContainer.innerHTML = '<p>No hay módulos disponibles para esta certificación.</p>';
            return;
        }

        this.certificacion.modulos.forEach((modulo, index) => {
            const moduloDiv = document.createElement('div');
            moduloDiv.className = 'modulo';

            // Adaptar a la nueva estructura que usa "nombre" en lugar de "titulo"
            const tituloModulo = modulo.nombre || modulo.titulo || `Módulo ${index + 1}`;
            const duracionModulo = modulo.porcentaje ? `${modulo.porcentaje}%` : (modulo.duracion || '');

            const tituloHTML = `
                <h4>
                    <span>${tituloModulo}</span>
                    ${duracionModulo ? `<span class="modulo-duracion">⏱️ ${duracionModulo}</span>` : ''}
                </h4>
            `;

            const temasListHTML = `
                <ul class="modulo-temas">
                    ${modulo.temas.map(tema => `<li>${tema}</li>`).join('')}
                </ul>
            `;

            moduloDiv.innerHTML = tituloHTML + temasListHTML;
            modulosContainer.appendChild(moduloDiv);
        });
    },

    /**
     * Renderizar información del examen
     */
    renderizarInfoExamen() {
        // Verificar si existe información de examen
        if (!this.certificacion.numeroExamenes) {
            console.log('No hay información de examen disponible');
            return;
        }

        const info = {
            'numeroExamenes': this.certificacion.numeroExamenes,
            'duracionExamen': this.certificacion.duracionExamen,
            'preguntas': this.certificacion.preguntas,
            'puntuacionMinima': this.certificacion.puntuacionMinima,
            'costo': this.certificacion.costo
        };

        Object.entries(info).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && value) {
                element.textContent = value;
            } else if (element) {
                element.textContent = 'No disponible';
            }
        });
    },

    /**
     * Renderizar requisitos
     */
    renderizarRequisitos() {
        const requisitosList = document.getElementById('requisitos');
        if (!requisitosList) return;

        requisitosList.innerHTML = '';

        if (!this.certificacion.requisitos || this.certificacion.requisitos.length === 0) {
            requisitosList.innerHTML = '<li>No hay requisitos específicos para esta certificación.</li>';
            return;
        }

        this.certificacion.requisitos.forEach(requisito => {
            const li = document.createElement('li');
            li.textContent = requisito;
            requisitosList.appendChild(li);
        });
    },

    /**
     * Renderizar duración total
     */
    renderizarDuracionTotal() {
        const duracionElement = document.getElementById('duracionTotal');
        if (duracionElement) {
            if (this.certificacion.duracionTotal) {
                duracionElement.textContent = this.certificacion.duracionTotal;
            } else if (this.certificacion.horasEstimadas) {
                duracionElement.textContent = `${this.certificacion.horasEstimadas} horas de preparación estimadas`;
            } else {
                duracionElement.textContent = 'Duración estimada: Variable según experiencia previa';
            }
        }
    },

    /**
     * Mostrar error
     */
    mostrarError(mensaje) {
        const container = document.querySelector('.temario-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="text-align: center; padding: var(--spacing-xl);">
                    <h2>Error</h2>
                    <p>${mensaje}</p>
                    <a href="certificaciones.html" class="btn btn-primary">Volver a Certificaciones</a>
                </div>
            `;
        }
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        TemarioPage.init();
    });
} else {
    TemarioPage.init();
}