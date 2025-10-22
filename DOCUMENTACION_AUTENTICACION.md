# 📚 Documentación - Sistema de Autenticación

## 📋 Índice
1. [Resumen de Cambios](#resumen-de-cambios)
2. [Nueva Estructura de Carpetas](#nueva-estructura-de-carpetas)
3. [Componentes Implementados](#componentes-implementados)
4. [Contexto de Autenticación](#contexto-de-autenticación)
5. [Flujo de Navegación](#flujo-de-navegación)
6. [Funciones y Hooks](#funciones-y-hooks)
7. [Recomendaciones](#recomendaciones)
8. [Próximos Pasos](#próximos-pasos)

---

## 🔄 Resumen de Cambios

### Cambios Principales Realizados:
- ✅ **Reorganización completa** de la estructura de carpetas
- ✅ **Implementación de rutas agrupadas** (public), (auth), (protected)
- ✅ **Sistema de autenticación** con Context API
- ✅ **Navbar inteligente** que se adapta al estado del usuario
- ✅ **Formularios mejorados** con validación y estados de carga
- ✅ **Componentes modulares** para acciones que requieren autenticación
- ✅ **Flujo de usuario optimizado** para visitantes y usuarios registrados

### Beneficios Obtenidos:
- 🚀 **Mejor UX**: Navegación libre con acciones protegidas
- 🏗️ **Arquitectura escalable**: Fácil agregar nuevas funcionalidades
- 🔧 **Mantenibilidad**: Código organizado y modular
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos
- 🎯 **SEO friendly**: Páginas públicas indexables

---

## 📁 Nueva Estructura de Carpetas

```
src/
├── app/
│   ├── (public)/              # 🟢 Rutas públicas (acceso libre)
│   │   ├── page.tsx          # Página de inicio
│   │   ├── catalogo/         # Catálogo de vehículos
│   │   │   └── page.tsx
│   │   ├── subastas/         # Página de subastas
│   │   │   └── page.tsx
│   │   └── contacto/         # Página de contacto
│   │       └── page.tsx
│   ├── (auth)/               # 🔐 Rutas de autenticación
│   │   ├── login/            # Página de login
│   │   │   └── page.tsx
│   │   ├── register/         # Página de registro
│   │   │   └── page.tsx
│   │   └── layout.tsx        # Layout sin navbar para auth
│   ├── (protected)/          # 🛡️ Rutas protegidas (preparadas)
│   │   ├── dashboard/        # Dashboard del usuario
│   │   ├── perfil/           # Perfil del usuario
│   │   ├── mis-pujas/        # Historial de pujas
│   │   └── mis-compras/      # Historial de compras
│   └── layout.tsx            # Layout principal con AuthProvider
├── components/
│   ├── auth/                 # 🔑 Componentes de autenticación
│   │   ├── LoginForm.tsx     # Formulario de login mejorado
│   │   ├── RegisterForm.tsx  # Formulario de registro mejorado
│   │   ├── AuthLayout.tsx    # Layout para páginas de auth
│   │   └── AuthPrompt.tsx    # Modal para acciones que requieren auth
│   ├── layout/               # 🏗️ Componentes de layout
│   │   ├── Navbar.tsx        # Navbar con estados de auth
│   │   ├── Footer.tsx        # Footer
│   │   └── UserMenu.tsx      # Menú desplegable del usuario
│   ├── vehicle/              # 🚗 Componentes de vehículos
│   │   ├── Carta_v.tsx       # Tarjeta de vehículo
│   │   ├── BidButton.tsx     # Botón de puja con lógica de auth
│   │   └── BuyButton.tsx     # Botón de compra con lógica de auth
│   └── ui/                   # 🎨 Componentes UI reutilizables
│       └── boton_catalogo.tsx
├── context/
│   └── AuthContext.tsx       # 🌐 Contexto global de autenticación
├── hooks/
│   └── useAuth.ts            # 🪝 Hook personalizado para auth
└── lib/
    └── (preparado para utilidades)
```

---

## 🧩 Componentes Implementados

### 1. **AuthContext.tsx** - Contexto Global
```typescript
// Ubicación: src/context/AuthContext.tsx
// Función: Maneja el estado global de autenticación

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;           // Usuario actual
  isAuthenticated: boolean;    // Estado de autenticación
  isLoading: boolean;          // Estado de carga
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

**Características:**
- ✅ Estado global de autenticación
- ✅ Funciones de login, register y logout
- ✅ Manejo de estados de carga
- ✅ Simulación de API (listo para integración real)

### 2. **useAuth.ts** - Hook Personalizado
```typescript
// Ubicación: src/hooks/useAuth.ts
// Función: Hook para acceder fácilmente al contexto de auth

export const useAuth = useAuthContext;
```

**Uso:**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### 3. **Navbar.tsx** - Navegación Inteligente
```typescript
// Ubicación: src/components/layout/Navbar.tsx
// Función: Navbar que se adapta al estado del usuario

// Estados del navbar:
// - Usuario NO autenticado: Muestra botones "Iniciar Sesión/Registrarse"
// - Usuario autenticado: Muestra menú de usuario con dropdown
// - Estado de carga: Muestra spinner de carga
```

**Características:**
- ✅ Navegación siempre visible (Inicio, Catálogo, Subastas, Contacto)
- ✅ Botones de auth condicionales
- ✅ Menú de usuario desplegable
- ✅ Estados de carga
- ✅ Responsive design

### 4. **UserMenu.tsx** - Menú de Usuario
```typescript
// Ubicación: src/components/layout/UserMenu.tsx
// Función: Menú desplegable para usuarios autenticados

// Opciones del menú:
// - Mi Dashboard
// - Mi Perfil
// - Mis Pujas
// - Mis Compras
// - Cerrar Sesión
```

**Características:**
- ✅ Dropdown con información del usuario
- ✅ Enlaces a páginas protegidas
- ✅ Función de logout
- ✅ Overlay para cerrar el menú
- ✅ Animaciones suaves

### 5. **LoginForm.tsx** - Formulario de Login
```typescript
// Ubicación: src/components/auth/LoginForm.tsx
// Función: Formulario de inicio de sesión mejorado

// Campos:
// - Email (requerido)
// - Contraseña (requerido)
// - Recordarme (checkbox)
// - ¿Olvidaste tu contraseña? (enlace)
```

**Características:**
- ✅ Validación de campos
- ✅ Estados de carga
- ✅ Manejo de errores
- ✅ Integración con AuthContext
- ✅ Redirección automática después del login
- ✅ Diseño responsive

### 6. **RegisterForm.tsx** - Formulario de Registro
```typescript
// Ubicación: src/components/auth/RegisterForm.tsx
// Función: Formulario de registro mejorado

// Campos:
// - Nombre completo (requerido)
// - Email (requerido)
// - Contraseña (requerido, mínimo 8 caracteres)
// - Confirmar contraseña (requerido)
// - Términos y condiciones (checkbox requerido)
```

**Características:**
- ✅ Validación de contraseñas coincidentes
- ✅ Estados de carga
- ✅ Manejo de errores
- ✅ Integración con AuthContext
- ✅ Redirección automática después del registro
- ✅ Enlaces a términos y condiciones

### 7. **AuthPrompt.tsx** - Modal de Autenticación
```typescript
// Ubicación: src/components/auth/AuthPrompt.tsx
// Función: Modal que aparece cuando se intenta una acción que requiere auth

// Props:
// - onClose: Función para cerrar el modal
// - action: Descripción de la acción que requiere auth
```

**Características:**
- ✅ Modal centrado con overlay
- ✅ Mensaje personalizable según la acción
- ✅ Botones para login y registro
- ✅ Botón de cancelar
- ✅ Diseño atractivo

### 8. **BidButton.tsx** - Botón de Puja
```typescript
// Ubicación: src/components/vehicle/BidButton.tsx
// Función: Botón para pujar en subastas con lógica de auth

// Props:
// - vehicle: Información del vehículo
// - currentBid: Puja actual (opcional)
```

**Características:**
- ✅ Verifica estado de autenticación
- ✅ Muestra AuthPrompt si no está autenticado
- ✅ Texto dinámico según el estado
- ✅ Integración con AuthContext

### 9. **BuyButton.tsx** - Botón de Compra
```typescript
// Ubicación: src/components/vehicle/BuyButton.tsx
// Función: Botón para comprar vehículos con lógica de auth

// Props:
// - vehicle: Información del vehículo
```

**Características:**
- ✅ Verifica estado de autenticación
- ✅ Muestra AuthPrompt si no está autenticado
- ✅ Texto dinámico según el estado
- ✅ Integración con AuthContext

---

## 🌐 Contexto de Autenticación

### **AuthProvider** - Proveedor del Contexto
```typescript
// Ubicación: src/context/AuthContext.tsx

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Funciones implementadas:
  const login = async (email: string, password: string) => Promise<void>;
  const register = async (name: string, email: string, password: string) => Promise<void>;
  const logout = () => void;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### **Integración en Layout Principal**
```typescript
// Ubicación: src/app/layout.tsx

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 🚦 Flujo de Navegación

### **Usuario NO Autenticado (Visitante)**
```
1. Llega al sitio → Ve navbar con botones "Iniciar Sesión/Registrarse"
2. Navega libremente → Inicio, Catálogo, Subastas, Contacto
3. Ve vehículos → Puede ver todos los detalles y precios
4. Intenta pujar/comprar → Aparece AuthPrompt
5. Se registra/inicia sesión → Accede a funcionalidades completas
```

### **Usuario Autenticado**
```
1. Navbar cambia → Muestra menú de usuario
2. Acceso completo → Todas las páginas + funcionalidades premium
3. Puede pujar/comprar → Botones funcionan directamente
4. Dashboard personal → Acceso a historial y configuraciones
```

---

## 🪝 Funciones y Hooks

### **useAuth Hook**
```typescript
// Ubicación: src/hooks/useAuth.ts

import { useAuth as useAuthContext } from '../context/AuthContext';
export const useAuth = useAuthContext;

// Uso en componentes:
const { 
  user,           // Usuario actual o null
  isAuthenticated, // boolean
  isLoading,      // boolean
  login,          // función
  register,       // función
  logout          // función
} = useAuth();
```

### **Funciones del Contexto**

#### **login(email, password)**
- **Parámetros**: email (string), password (string)
- **Retorna**: Promise<void>
- **Función**: Autentica al usuario
- **Estado**: Actualiza user, isAuthenticated, isLoading

#### **register(name, email, password)**
- **Parámetros**: name (string), email (string), password (string)
- **Retorna**: Promise<void>
- **Función**: Registra nuevo usuario
- **Estado**: Actualiza user, isAuthenticated, isLoading

#### **logout()**
- **Parámetros**: Ninguno
- **Retorna**: void
- **Función**: Cierra sesión del usuario
- **Estado**: Limpia user, isAuthenticated = false

---

## 💡 Recomendaciones

### **1. Seguridad**
- 🔐 **Implementar validación real** en el backend
- 🔐 **Usar HTTPS** para todas las comunicaciones
- 🔐 **Implementar JWT** o tokens seguros
- 🔐 **Validar contraseñas** con criterios de seguridad
- 🔐 **Implementar rate limiting** para prevenir ataques

### **2. UX/UI**
- 🎨 **Agregar animaciones** de transición entre estados
- 🎨 **Implementar notificaciones** toast para feedback
- 🎨 **Agregar loading states** más detallados
- 🎨 **Implementar dark mode** si es necesario
- 🎨 **Optimizar para móviles** con gestos táctiles

### **3. Performance**
- ⚡ **Implementar lazy loading** para componentes pesados
- ⚡ **Optimizar imágenes** con Next.js Image
- ⚡ **Implementar caching** para datos de usuario
- ⚡ **Usar React.memo** para componentes que no cambian frecuentemente
- ⚡ **Implementar service workers** para offline support

### **4. Funcionalidades Adicionales**
- 🔄 **Implementar "Recordarme"** con persistencia
- 🔄 **Agregar recuperación de contraseña**
- 🔄 **Implementar verificación de email**
- 🔄 **Agregar autenticación social** (Google, Facebook)
- 🔄 **Implementar 2FA** para mayor seguridad

### **5. Testing**
- 🧪 **Implementar tests unitarios** para componentes
- 🧪 **Agregar tests de integración** para flujos de auth
- 🧪 **Implementar tests E2E** con Playwright
- 🧪 **Agregar tests de accesibilidad**
- 🧪 **Implementar tests de performance**

---

## 🚀 Próximos Pasos

### **Fase 1: Integración Backend (Inmediata)**
1. **Reemplazar funciones simuladas** en AuthContext.tsx
2. **Conectar con API real** (REST, GraphQL, etc.)
3. **Implementar manejo de errores** real
4. **Agregar persistencia** (localStorage, cookies)

### **Fase 2: Funcionalidades Avanzadas (Corto plazo)**
1. **Implementar rutas protegidas** reales
2. **Agregar middleware de auth** para Next.js
3. **Implementar refresh tokens**
4. **Agregar validación de formularios** más robusta

### **Fase 3: Optimización (Mediano plazo)**
1. **Implementar lazy loading** de rutas
2. **Agregar caching** de datos de usuario
3. **Optimizar bundle size**
4. **Implementar PWA** features

### **Fase 4: Escalabilidad (Largo plazo)**
1. **Implementar microservicios** de auth
2. **Agregar analytics** de uso
3. **Implementar A/B testing**
4. **Agregar internacionalización**

---

## 📞 Soporte y Contacto

### **Archivos Clave para Modificaciones:**
- `src/context/AuthContext.tsx` - Lógica principal de auth
- `src/components/layout/Navbar.tsx` - Navegación principal
- `src/components/auth/` - Formularios de autenticación
- `src/hooks/useAuth.ts` - Hook para usar auth

### **Comandos Útiles:**
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar linter
npm run lint
```

### **Estructura de URLs:**
- `/` - Página de inicio (pública)
- `/catalogo` - Catálogo de vehículos (pública)
- `/subastas` - Subastas (pública)
- `/contacto` - Contacto (pública)
- `/login` - Iniciar sesión (auth)
- `/register` - Registrarse (auth)
- `/dashboard` - Dashboard (protegida)
- `/perfil` - Perfil de usuario (protegida)

---

## ✅ Estado Actual del Proyecto

### **Completado:**
- ✅ Estructura de carpetas reorganizada
- ✅ Sistema de autenticación implementado
- ✅ Navbar con estados dinámicos
- ✅ Formularios mejorados
- ✅ Componentes modulares
- ✅ Flujo de usuario optimizado
- ✅ Diseño responsive
- ✅ TypeScript implementado

### **Pendiente (Para integración real):**
- ⏳ Conexión con backend real
- ⏳ Persistencia de sesión
- ⏳ Validación de formularios robusta
- ⏳ Manejo de errores avanzado
- ⏳ Testing implementado
- ⏳ Documentación de API

---

**📝 Documentación creada el:** $(date)  
**🔄 Última actualización:** $(date)  
**👨‍💻 Desarrollado por:** Asistente AI  
**📧 Contacto:** Para dudas sobre la implementación
