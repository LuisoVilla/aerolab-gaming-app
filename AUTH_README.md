# 🔐 Sistema de Autenticación - Gaming Haven Z

## ✨ Funcionalidades Implementadas

- **NextAuth.js** - Sistema de autenticación robusto y seguro
- **Múltiples proveedores**:
  - 📧 **Email/Password** (credenciales personalizadas)
  - 🔍 **Google OAuth** (opcional)
  - 🐙 **GitHub OAuth** (opcional)
- **UI personalizada** - Página de signin con Material UI
- **Protección de rutas** - Middleware y componente ProtectedRoute
- **Estado global** - Hook useAuth para gestionar autenticación

## 🚀 Cómo Usar

### 1. **Login Demo**
```
Email: demo@example.com
Password: password123
```

### 2. **Navegación**
- Botón "Sign In" aparece en el header cuando no estás logueado
- Avatar del usuario aparece cuando estás logueado
- Click en el avatar para ver menú con opción "Sign Out"

### 3. **Rutas Disponibles**
- `/auth/signin` - Página de login
- `/` - Home (accesible sin login)
- `/game/[id]` - Detalle de juego (accesible sin login)

## 🔧 Configuración Opcional

### Variables de Entorno (.env.local)
```bash
# NextAuth.js (Requerido)
NEXTAUTH_SECRET=your-secret-key-here-make-it-long-and-random-gaming-app-2025
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (Opcional)  
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Para Configurar Google OAuth:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita la Google+ API
4. Crea credenciales OAuth 2.0
5. Agrega `http://localhost:3000/api/auth/callback/google` como URL de callback
6. Copia Client ID y Client Secret al .env.local

### Para Configurar GitHub OAuth:
1. Ve a GitHub Settings > Developer settings > OAuth Apps
2. Crea una nueva OAuth App
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copia Client ID y Client Secret al .env.local

## 📁 Archivos Principales

### Configuración
- `src/lib/auth.ts` - Configuración de NextAuth
- `src/app/api/auth/[...nextauth]/route.ts` - API route para NextAuth
- `types/next-auth.d.ts` - Tipos TypeScript extendidos

### Componentes
- `src/components/AuthProvider.tsx` - Provider de sesión
- `src/app/auth/signin/page.tsx` - Página de login
- `src/hooks/useAuth.ts` - Hook personalizado para autenticación
- `src/components/ProtectedRoute.tsx` - Componente para proteger rutas

### Integración
- `src/app/layout.tsx` - AuthProvider agregado al layout
- `src/components/SearchHeader.tsx` - Botones de login/logout

## 🛡️ Protección de Rutas

### Automática (Middleware)
El middleware ya está configurado pero permite acceso libre a todas las rutas. Para proteger rutas específicas, modifica `middleware.ts`:

```typescript
// Ejemplo: Proteger solo rutas admin
if (pathname.startsWith('/admin/')) {
  return !!token; // Requiere autenticación
}
```

### Manual (Componente)
Envuelve cualquier página con `ProtectedRoute`:

```tsx
import ProtectedRoute from "../components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div>Contenido protegido</div>
    </ProtectedRoute>
  );
}
```

## 🎮 Estado de la Aplicación

- ✅ **Login funcional** con credenciales demo
- ✅ **UI integrada** en header existente
- ✅ **Sesión persistente** entre reloads
- ✅ **Logout funcional**
- ✅ **Preparado para OAuth** (Google/GitHub)
- ✅ **Protección de rutas** opcional disponible

## 🚀 Próximos Pasos

1. **Configurar OAuth** (opcional) - Google y/o GitHub
2. **Base de datos real** - Reemplazar array mock con DB
3. **Registro de usuarios** - Página de signup
4. **Recuperación de contraseña** - Reset password
5. **Roles y permisos** - Admin, user, etc.
6. **Proteger funcionalidades** - Guardar juegos solo si está logueado

¡El sistema de autenticación está listo para usar! 🎉
