# 📚 Documentación - Pantalla de Perfil de Usuario

## 📋 Índice
1. [Resumen de Implementación](#resumen-de-implementación)
2. [Estructura de Componentes](#estructura-de-componentes)
3. [Dos Contextos de Vista](#dos-contextos-de-vista)
4. [Funcionalidades Implementadas](#funcionalidades-implementadas)
5. [Componentes Creados](#componentes-creados)
6. [Navegación y Rutas](#navegación-y-rutas)
7. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Resumen de Implementación

Se ha implementado una pantalla completa de perfil de usuario con dos modos de visualización:

### ✅ **Modo Propietario (Vista Propia)**
- El usuario puede ver y editar sus datos personales
- Gestión de vehículos (ver, agregar, filtrar por estado)
- Panel de control con estadísticas
- Opciones de configuración

### 👥 **Modo Visitante (Vista Pública)**
- Los usuarios pueden ver el perfil de otros vendedores
- Visualización de vehículos disponibles del vendedor
- Ver valoraciones y reviews
- Contactar al vendedor

---

## 🏗️ Estructura de Componentes

```
src/
├── app/
│   └── (protected)/
│       └── perfil/
│           └── page.tsx              # Página principal del perfil
│
└── components/
    └── profile/
        ├── ProfileHeader.tsx         # Header del perfil
        ├── ProfileVehicles.tsx       # Lista de vehículos
        ├── ProfileReviews.tsx        # Valoraciones/reviews
        ├── owner/                    # (Preparado para componentes del propietario)
        └── visitor/                   # (Preparado para componentes del visitante)
```

---

## 🔄 Dos Contextos de Vista

### **1. Modo Propietario (Usuario Es el Dueño del Perfil)**

**Características:**
- ✅ **Edición de datos**: Nombre, email, teléfono, ubicación, biografía
- ✅ **Gestión de vehículos**: Ver, agregar, editar, eliminar
- ✅ **Estadísticas**: Contador de vehículos, valoraciones, promedio
- ✅ **Filtros avanzados**: Por estado (activo, vendido, pendiente)
- ✅ **Acciones rápidas**: Cerrar sesión, configuraciones
- ✅ **Tipo de usuario**: Indicadores de Vendedor/Comprador

**Elementos únicos del propietario:**
```typescript
// Botones y funcionalidades solo para propietario
- Botón "Editar Perfil"
- Botón "Cerrar Sesión"  
- Botón "Agregar Vehículo"
- Indicadores de tipo de usuario (Vendedor/Comprador)
- Filtro de "Pendientes" en vehículos
- Edición de avatar y biografía
```

### **2. Modo Visitante (Usuario Ve Perfil de Otro)**

**Características:**
- ✅ **Visualización de datos**: Información básica del vendedor
- ✅ **Vehículos disponibles**: Solo vehículos en estado "activo"
- ✅ **Valoraciones**: Ver reviews y calificaciones
- ✅ **Información de contacto**: Email, teléfono (si está público)
- ✅ **Contacto**: Botón para contactar al vendedor

**Elementos únicos del visitante:**
```typescript
// Solo lectura, sin edición
- Sin botones de edición
- No puede agregar vehículos
- Solo ve vehículos activos
- Puede ver reviews pero no escribirlas (aún)
- Botón "Contactar Vendedor"
```

---

## 🎨 Funcionalidades Implementadas

### **1. ProfileHeader Component**

**Ubicación:** `src/components/profile/ProfileHeader.tsx`

**Funcionalidades:**
- 📸 **Avatar**: Imagen del usuario o inicial
- ✏️ **Edición de biografía** (solo propietario)
- 📱 **Información de contacto**: Email, teléfono, ubicación
- 🏷️ **Tipo de usuario**: Badges de Vendedor/Comprador
- 📊 **Estadísticas**: Vehículos, valoraciones, promedio
- 🗓️ **Fecha de ingreso**: "Miembro desde..."
- ⚙️ **Acciones**: Editar perfil, cerrar sesión

**Props:**
```typescript
interface ProfileHeaderProps {
  user: User;
  isOwner: boolean;
}
```

### **2. ProfileVehicles Component**

**Ubicación:** `src/components/profile/ProfileVehicles.tsx`

**Funcionalidades:**
- 📋 **Lista de vehículos**: Grid responsive
- 🔍 **Filtros**: Todos, Activos, Vendidos, Pendientes
- ➕ **Agregar vehículo** (solo propietario)
- 🏷️ **Badges de estado**: Color por estado
- 🔗 **Enlaces a detalles**: Click en vehículo
- 📊 **Contador de vehículos**: Por filtro seleccionado

**Props:**
```typescript
interface ProfileVehiclesProps {
  vehicles: Vehicle[];
  isOwner: boolean;
}
```

**Estados de vehículos:**
- `active` - Activo (verde)
- `sold` - Vendido (gris)
- `pending` - Pendiente (amarillo)

### **3. ProfileReviews Component**

**Ubicación:** `src/components/profile/ProfileReviews.tsx`

**Funcionalidades:**
- ⭐ **Sistema de rating**: 1-5 estrellas
- 📊 **Promedio de rating**: Cálculo automático
- 📝 **Comentarios de usuarios**: Reviews detallados
- 👤 **Avatar del reviewer**: Inicial o foto
- 📅 **Fecha de review**: Formato español

**Props:**
```typescript
interface ProfileReviewsProps {
  reviews: Review[];
}
```

---

## 🧩 Componentes Creados

### **ProfileHeader.tsx**
```typescript
// Características principales:
- Edición de biografía inline
- Información de contacto
- Estadísticas del usuario
- Badges de tipo de usuario
- Botones de acción condicionales
```

### **ProfileVehicles.tsx**
```typescript
// Características principales:
- Grid responsive de vehículos
- Sistema de filtros
- Imágenes o placeholders
- Estados de vehículos
- Botón para agregar (propietario)
```

### **ProfileReviews.tsx**
```typescript
// Características principales:
- Sistema de rating visual
- Lista de reviews
- Promedio calculado
- Fechas formateadas
- Avatar de reviewers
```

### **page.tsx (Perfil Principal)**
```typescript
// Características principales:
- Determina si es propietario o visitante
- Layout responsive (2/3 - 1/3)
- Integración con useAuth
- Preparado para API real
```

---

## 🚦 Navegación y Rutas

### **Rutas Implementadas:**

```typescript
// Perfil propio (requiere autenticación)
/perfil

// Perfil de otro usuario (público o privado según implementación)
/perfil/:id
```

### **Navegación desde el Menú:**
El perfil es accesible desde:
1. **UserMenu** (dropdown del usuario)
2. **Enlaces directos** a perfiles de vendedores
3. **Desde la página de un vehículo** → "Ver perfil del vendedor"

### **Flujo de Acceso:**

```
Usuario autenticado → Click en avatar → UserMenu → "Mi Perfil"
Usuario navegando → Ve vehículo → "Ver perfil del vendedor" → Perfil público
```

---

## 🎯 Uso de los Componentes

### **Ejemplo de Uso Básico:**

```typescript
"use client";

import ProfileHeader from '../../../components/profile/ProfileHeader';
import ProfileVehicles from '../../../components/profile/ProfileVehicles';
import ProfileReviews from '../../../components/profile/ProfileReviews';
import { useAuth } from '../../../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const isOwner = true; // Determinar basado en URL params
  
  return (
    <div>
      <ProfileHeader user={userData} isOwner={isOwner} />
      <ProfileVehicles vehicles={vehicles} isOwner={isOwner} />
      <ProfileReviews reviews={reviews} />
    </div>
  );
}
```

### **Detección de Propietario vs Visitante:**

```typescript
import { useAuth } from '../../../hooks/useAuth';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useAuth();
  const params = useParams();
  
  // El perfil es del usuario si:
  // 1. No hay ID en la URL (perfil propio)
  // 2. El ID coincide con el usuario actual
  const profileId = params?.id as string;
  const isOwner = !profileId || profileId === user?.id;
  
  // TODO: Cargar datos del usuario desde API
  // const { data: profileUser } = useSWR(profileId ? `/api/users/${profileId}` : null);
}
```

---

## 📝 Estructura de Datos

### **User Interface:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  isSeller: boolean;
  isBuyer: boolean;
  joinDate: string;
}
```

### **Vehicle Interface:**
```typescript
interface Vehicle {
  id: string;
  name: string;
  year: string;
  price: string;
  image?: string;
  status: 'active' | 'sold' | 'pending';
}
```

### **Review Interface:**
```typescript
interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
}
```

---

## 💡 Próximos Pasos

### **Fase 1: Integración con API**
- [ ] Conectar con backend real para datos de usuario
- [ ] Implementar carga de vehículos desde API
- [ ] Implementar carga de reviews desde API
- [ ] Agregar manejo de estados de carga

### **Fase 2: Funcionalidades Avanzadas**
- [ ] Implementar edición de avatar (upload de imagen)
- [ ] Agregar sistema de favoritos
- [ ] Implementar "Contactar Vendedor" (chat o email)
- [ ] Agregar funcionalidad de seguir/dejar de seguir

### **Fase 3: Funcionalidades de Propietario**
- [ ] Formulario para agregar vehículo
- [ ] Edición de vehículos existentes
- [ ] Eliminar vehículos
- [ ] Cambiar estado de vehículos
- [ ] Panel de mensajes recibidos

### **Fase 4: Funcionalidades Sociales**
- [ ] Sistema de reviews (escribir reviews)
- [ ] Sistema de likes en vehículos
- [ ] Compartir perfil en redes sociales
- [ ] Notificaciones de interacciones

### **Fase 5: Optimización**
- [ ] Implementar lazy loading de imágenes
- [ ] Agregar paginación para vehículos
- [ ] Implementar búsqueda en vehículos
- [ ] Optimizar performance con React.memo

---

## 🔐 Seguridad y Privacidad

### **Consideraciones Implementadas:**
- ✅ Solo el propietario puede editar sus datos
- ✅ Visibilidad de datos personales configurable
- ✅ Privacidad de información de contacto
- ✅ Protección de rutas con autenticación

### **Por Implementar:**
- [ ] Validación de permisos en backend
- [ ] Rate limiting para ediciones
- [ ] Validación de datos en formularios
- [ ] Sanitización de inputs (biografía, reviews)
- [ ] Modo de perfil privado/público

---

## 📊 Estadísticas y Métricas

### **Estadísticas Mostradas:**
1. **Vehículos**: Contador total de vehículos del usuario
2. **Valoraciones**: Número de reviews recibidos
3. **Promedio**: Rating promedio basado en reviews

### **Futuras Métricas:**
- [ ] Vehículos vendidos este mes
- [ ] Tasa de respuesta a mensajes
- [ ] Tiempo promedio de venta
- [ ] Satisfacción del cliente

---

## ✅ Estado Actual

### **Completado:**
- ✅ Estructura de componentes
- ✅ Vista del propietario
- ✅ Vista del visitante
- ✅ Sistema de filtros
- ✅ Sistema de reviews
- ✅ Diseño responsive
- ✅ Integración con AuthContext

### **Preparado para:**
- 🔄 Conexión con API real
- 🔄 Implementación de edición
- 🔄 Sistema de permisos
- 🔄 Funcionalidades sociales

---

**📝 Documentación creada:** $(date)  
**🔄 Última actualización:** $(date)  
**👨‍💻 Estado:** Listo para integración con backend

