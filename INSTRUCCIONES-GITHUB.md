# 📤 CÓMO SUBIR A GITHUB PAGES

## Paso 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `github-sagomu` (o el que prefieras)
3. Descripción: "Sistema de certificaciones internacionales Sagomu"
4. Marca **Public** (para GitHub Pages gratis)
5. **NO** marques "Initialize this repository with README"
6. Click en **Create repository**

## Paso 2: Subir Archivos

Abre terminal en la carpeta `github-sagomu` en tu escritorio:

```bash
cd ~/Desktop/github-sagomu

# Inicializar git
git init
git add .
git commit -m "Sistema Sagomu - Certificaciones Internacionales"

# Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/github-sagomu.git
git branch -M main
git push -u origin main
```

## Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (⚙️ arriba a la derecha)
3. Click en **Pages** (menú izquierdo)
4. Configuración:
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)
5. Click en **Save**

## Paso 4: Ver tu Sitio

En 2-3 minutos tu sitio estará en:

```
https://TU_USUARIO.github.io/github-sagomu/
```

## 🎯 Páginas Principales

- **Catálogo**: `[tu-url]/certificaciones.html`
- **Demo**: `[tu-url]/DEMO-SISTEMA.html`
- **Temario**: `[tu-url]/temario.html?cert=adobe-photoshop-professional`

## ⚠️ Nota Importante

- Si cambias el nombre del repositorio, la URL cambiará
- GitHub Pages es gratuito para repositorios públicos
- Los cambios tardan 1-3 minutos en aparecer

---

**🎉 ¡Tu sitio estará disponible mundialmente!**
