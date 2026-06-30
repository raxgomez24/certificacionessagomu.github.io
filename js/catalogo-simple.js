/**
 * Catálogo Simplificado para Diagnóstico - Sagomu
 * Versión reducida para identificar problemas
 */

console.log('🚀 Iniciando catálogo simplificado...');

const CatalogoSimple = {
    certificaciones: [],

    async init() {
        console.log('🔧 CatalogoSimple.init() llamado');
        try {
            await this.cargarCertificaciones();
            this.renderizarCertificaciones();
            console.log('✅ Catálogo inicializado exitosamente');
        } catch (error) {
            console.error('❌ Error al inicializar el catálogo:', error);
            this.mostrarError(error);
        }
    },

    async cargarCertificaciones() {
        console.log('📥 Cargando certificaciones desde: data/certificaciones.json');

        try {
            const response = await fetch('data/certificaciones.json');

            console.log('📡 Respuesta recibida:', {
                status: response.status,
                ok: response.ok,
                type: response.type
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }

            const jsonData = await response.json();
            console.log(`✅ Datos recibidos:`, jsonData);

            // Verificar si los datos están en un objeto con propiedad certificaciones o directamente como array
            this.certificaciones = jsonData.certificaciones || jsonData;

            console.log(`✅ Certificaciones extraídas: ${this.certificaciones.length}`);

            if (this.certificaciones.length === 0) {
                throw new Error('El archivo JSON está vacío');
            }

            console.log('📋 Primera certificación:', this.certificaciones[0]);

        } catch (error) {
            console.error('❌ Error en cargarCertificaciones():', error);
            throw error;
        }
    },

    renderizarCertificaciones() {
        console.log('🎨 Renderizando certificaciones...');

        const container = document.getElementById('catalogo-container');
        const errorMessage = document.getElementById('error-message');

        if (!container) {
            console.error('❌ No se encontró el contenedor #catalogo-container');
            return;
        }

        console.log('✅ Contenedor encontrado');

        // Limpiar el contenedor
        container.innerHTML = '';

        // Ocultar mensaje de error si existía
        if (errorMessage) {
            errorMessage.classList.add('hidden');
        }

        console.log(`📦 Renderizando ${this.certificaciones.length} certificaciones`);

        // Renderizar cada certificación
        this.certificaciones.forEach((cert, index) => {
            const tarjeta = this.crearTarjeta(cert);
            container.appendChild(tarjeta);
            console.log(`  ${index + 1}. ${cert.nombreExamen} - ${cert.marca}`);
        });

        console.log('✅ Renderizado completado');
    },

    crearTarjeta(cert) {
        const article = document.createElement('article');
        article.className = 'cert-card';
        article.setAttribute('data-categoria', this.normalizarCategoria(cert.categoria));

        article.innerHTML = `
            <div class="cert-image">
                <img src="${cert.imagenLogo}" alt="${cert.marca} Logo" loading="lazy">
            </div>
            <span class="cert-category">${cert.categoria}</span>
            <h3 class="cert-title">${cert.nombreExamen}</h3>
            <span class="cert-brand">${cert.marca}</span>
            <p class="cert-description">${cert.descripcion}</p>
            <div class="cert-buttons">
                <a href="temario.html?cert=${cert.id}" class="btn btn-outline-secondary">Ver Temario</a>
                <a href="agendar.html?cert=${cert.id}" class="btn btn-primary">Agendar</a>
            </div>
        `;

        return article;
    },

    normalizarCategoria(categoria) {
        return categoria.toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    },

    mostrarError(error) {
        console.error('🚨 Mostrando error al usuario:', error);
        const container = document.getElementById('catalogo-container');
        const errorMessage = document.getElementById('error-message');

        if (container) {
            container.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
                    <h3>Error al cargar certificaciones</h3>
                    <p>${error.message}</p>
                    <p><small>Revisa la consola del navegador para más detalles.</small></p>
                </div>
            `;
        }

        if (errorMessage) {
            errorMessage.classList.remove('hidden');
        }
    }
};

// Inicializar el catálogo simplificado cuando el DOM esté listo
console.log('⏳ Esperando a que el DOM esté listo...');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOMContentLoaded evento disparado');
        CatalogoSimple.init();
    });
} else {
    console.log('✅ DOM ya está listo');
    CatalogoSimple.init();
}