# EPIC: GESTIÓN DE EQUIPOS POR CAPITANES

## **Descripción de la EPIC**

Implementar un sistema de gestión de equipos que permita a los capitanes registrar, modificar y eliminar jugadores de sus equipos, con un flujo de aprobación por parte de administradores, manteniendo la integridad de datos y proporcionando una experiencia de usuario optimizada.

## **Valor de Negocio**

- **Para Capitanes**: Autonomía para gestionar su equipo sin depender completamente de administradores
- **Para Administradores**: Control y supervisión de cambios antes de que se apliquen definitivamente
- **Para el Sistema**: Integridad de datos y flujo de aprobación que previene errores y conflictos

## **Criterios de Aceptación de la EPIC**

- ✅ Capitanes pueden gestionar jugadores de su equipo (CRUD)
- ✅ Sistema de aprobación por administradores
- ✅ Validaciones de negocio (números únicos, formatos, etc.)
- ✅ Previsualización de credenciales
- ✅ Integración con flujo de fotos existente
- ✅ Eliminación lógica de jugadores
- ✅ Arquitectura escalable con lazy loading

---

# HISTORIAS DE USUARIO

## **HISTORIA 1: Autorización y Acceso de Capitanes**

**Como** capitán de equipo  
**Quiero** acceder al módulo de gestión de mi equipo  
**Para** poder administrar los jugadores de mi equipo de forma autónoma

### **Criterios de Aceptación:**

- [ ] El sistema valida que tengo un jugador asociado a mi email
- [ ] El sistema verifica que soy capitán (campo capitan === true || capitan === 1)
- [ ] Muestro mensaje claro si no tengo permisos o jugador asociado
- [ ] Solo puedo acceder a gestionar MI equipo específico

### **Tareas:**

- [ ] **T1.1** - Crear CaptainGuard para validar permisos
- [ ] **T1.2** - Implementar consulta de jugador por email en PlayerService
- [ ] **T1.3** - Validar campo 'capitan' en el modelo Player
- [ ] **T1.4** - Agregar mensajes de error específicos
- [ ] **T1.5** - Configurar rutas con AuthGuard + CaptainGuard

**Estimación:** 8 puntos  
**Prioridad:** Alta

---

## **HISTORIA 2: Registro de Nuevos Jugadores por Capitán**

**Como** capitán de equipo  
**Quiero** registrar nuevos jugadores en mi equipo  
**Para** completar la plantilla con los datos necesarios para el torneo

### **Criterios de Aceptación:**

- [ ] Puedo abrir un formulario de registro desde la lista de jugadores
- [ ] El formulario valida todos los campos requeridos
- [ ] Veo previsualización de la credencial antes de guardar
- [ ] El jugador se guarda en estado pendiente de aprobación
- [ ] Recibo feedback claro del estado de la operación

### **Tareas:**

- [ ] **T2.1** - Crear componente MyTeamManagementComponent
- [ ] **T2.2** - Crear PlayerFormComponent (MatBottomSheet)
- [ ] **T2.3** - Implementar validaciones de formulario (ReactiveFormsModule)
- [ ] **T2.4** - Integrar componente badge-item para previsualización
- [ ] **T2.5** - Crear PlayerPendingService para colección temporal
- [ ] **T2.6** - Implementar CaptainPlayerStrategy para guardar en players_pending
- [ ] **T2.7** - Crear validadores personalizados (número único, teléfono, edad)

**Estimación:** 13 puntos  
**Prioridad:** Alta

---

## **HISTORIA 3: Modificación de Jugadores Existentes**

**Como** capitán de equipo  
**Quiero** modificar los datos de jugadores existentes  
**Para** mantener la información actualizada y corregir errores

### **Criterios de Aceptación:**

- [ ] Puedo editar jugadores de mi equipo desde la lista
- [ ] El formulario precarga los datos actuales del jugador
- [ ] Las modificaciones requieren aprobación del administrador
- [ ] No puedo editar jugadores en estado "under_review"
- [ ] Veo previsualización actualizada de la credencial

### **Tareas:**

- [ ] **T3.1** - Extender PlayerFormComponent para modo edición
- [ ] **T3.2** - Implementar lógica de precarga de datos
- [ ] **T3.3** - Crear flujo pending_update en PlayerPendingService
- [ ] **T3.4** - Implementar bloqueo por estado "under_review"
- [ ] **T3.5** - Actualizar validaciones para excluir jugador actual

**Estimación:** 8 puntos  
**Prioridad:** Alta

---

## **HISTORIA 4: Eliminación de Jugadores**

**Como** capitán de equipo  
**Quiero** eliminar jugadores de mi equipo  
**Para** mantener la plantilla actualizada con los jugadores activos

### **Criterios de Aceptación:**

- [ ] Puedo solicitar eliminación desde el formulario de edición
- [ ] El sistema muestra confirmación antes de proceder
- [ ] La eliminación requiere aprobación del administrador
- [ ] Veo advertencia específica si intento eliminar un capitán
- [ ] El jugador permanece visible hasta aprobación

### **Tareas:**

- [ ] **T4.1** - Agregar botón eliminar en PlayerFormComponent
- [ ] **T4.2** - Implementar ConfirmationDialogComponent para confirmación
- [ ] **T4.3** - Crear flujo pending_deletion en PlayerPendingService
- [ ] **T4.4** - Implementar validación especial para capitanes
- [ ] **T4.5** - Actualizar lógica de eliminación lógica en DeletePlayerCommand

**Estimación:** 5 puntos  
**Prioridad:** Media

---

## **HISTORIA 5: Visualización de Estado del Equipo**

**Como** capitán de equipo  
**Quiero** ver el estado actual de mi equipo con cambios pendientes  
**Para** tener visibilidad completa de la situación de mi plantilla

### **Criterios de Aceptación:**

- [ ] Veo lista combinada de jugadores activos y pendientes
- [ ] Los estados se distinguen visualmente con colores/iconos
- [ ] Puedo identificar qué jugadores están en revisión
- [ ] Las acciones se deshabilitan apropiadamente por estado
- [ ] La lista se actualiza automáticamente tras cambios

### **Tareas:**

- [ ] **T5.1** - Implementar consulta combinada (Jugadores + players_pending)
- [ ] **T5.2** - Crear indicadores visuales de estado (MatChip)
- [ ] **T5.3** - Implementar lógica de deshabilitación de acciones
- [ ] **T5.4** - Agregar manejo de estados en tiempo real
- [ ] **T5.5** - Implementar filtros de jugadores activos en PlayerService

**Estimación:** 8 puntos  
**Prioridad:** Media

---

## **HISTORIA 6: Aprobación de Jugadores Nuevos por Administrador**

**Como** administrador del sistema  
**Quiero** aprobar registros de nuevos jugadores  
**Para** mantener control sobre la integridad de los datos del torneo

### **Criterios de Aceptación:**

- [ ] Veo lista de jugadores pendientes de aprobación
- [ ] Puedo revisar datos completos y previsualización de credencial
- [ ] Al aprobar, el jugador se mueve a la colección principal
- [ ] La operación es atómica y no deja datos inconsistentes
- [ ] Se genera log de auditoría de la operación

### **Tareas:**

- [ ] **T6.1** - Crear módulo teams.module.ts (lazy loaded)
- [ ] **T6.2** - Crear PendingPlayersListComponent
- [ ] **T6.3** - Crear PendingPlayerDetailComponent (MatBottomSheet)
- [ ] **T6.4** - Implementar ApprovePlayerCreationCommand con transacciones
- [ ] **T6.5** - Integrar conversión de fechas con ExcelService
- [ ] **T6.6** - Crear sistema de auditoría básico

**Estimación:** 13 puntos  
**Prioridad:** Alta

---

## **HISTORIA 7: Aprobación de Modificaciones por Administrador**

**Como** administrador del sistema  
**Quiero** aprobar cambios propuestos a jugadores existentes  
**Para** validar que los cambios son correctos antes de aplicarlos

### **Criterios de Aceptación:**

- [ ] Veo comparación lado a lado de datos actuales vs propuestos
- [ ] Puedo aprobar o rechazar cambios individualmente
- [ ] Al aprobar, se actualizan datos en colección principal y badge
- [ ] La operación es atómica y mantiene consistencia
- [ ] Se registra quién aprobó y cuándo

### **Tareas:**

- [ ] **T7.1** - Implementar vista de comparación en PendingPlayerDetailComponent
- [ ] **T7.2** - Crear ApprovePlayerUpdateCommand con transacciones
- [ ] **T7.3** - Implementar lógica de actualización de badges
- [ ] **T7.4** - Agregar manejo de estado "under_review"
- [ ] **T7.5** - Implementar sistema de release automático

**Estimación:** 10 puntos  
**Prioridad:** Alta

---

## **HISTORIA 8: Aprobación de Eliminaciones por Administrador**

**Como** administrador del sistema  
**Quiero** aprobar solicitudes de eliminación de jugadores  
**Para** mantener control sobre los jugadores activos en el torneo

### **Criterios de Aceptación:**

- [ ] Veo información completa del jugador a eliminar
- [ ] Puedo aprobar eliminación marcando como INACTIVO
- [ ] Se elimina el badge asociado al jugador
- [ ] La operación es atómica y reversible
- [ ] Se mantiene historial de eliminaciones

### **Tareas:**

- [ ] **T8.1** - Crear ApprovePlayerDeletionCommand con transacciones
- [ ] **T8.2** - Implementar eliminación lógica (status = INACTIVO)
- [ ] **T8.3** - Agregar eliminación de badges en la transacción
- [ ] **T8.4** - Actualizar consultas para filtrar jugadores inactivos
- [ ] **T8.5** - Implementar confirmaciones específicas para eliminación

**Estimación:** 8 puntos  
**Prioridad:** Media

---

## **HISTORIA 9: Rechazo de Solicitudes por Administrador**

**Como** administrador del sistema  
**Quiero** rechazar solicitudes que no cumplan criterios  
**Para** mantener la calidad de los datos y prevenir errores

### **Criterios de Aceptación:**

- [ ] Puedo rechazar cualquier tipo de solicitud pendiente
- [ ] Al rechazar, se elimina el registro temporal
- [ ] La operación es atómica y no deja residuos
- [ ] Se registra la acción en el log de auditoría
- [ ] El capitán puede volver a intentar después del rechazo

### **Tareas:**

- [ ] **T9.1** - Crear RejectPendingPlayerCommand simplificado
- [ ] **T9.2** - Implementar botones de rechazo en PendingPlayerDetailComponent
- [ ] **T9.3** - Agregar confirmaciones antes de rechazar
- [ ] **T9.4** - Implementar limpieza atómica de registros temporales
- [ ] **T9.5** - Actualizar logs de auditoría para rechazos

**Estimación:** 5 puntos  
**Prioridad:** Media

---

## **HISTORIA 10: Validaciones de Negocio**

**Como** usuario del sistema (capitán o administrador)  
**Quiero** que el sistema valide automáticamente las reglas de negocio  
**Para** prevenir errores de datos y mantener la integridad del torneo

### **Criterios de Aceptación:**

- [ ] Los números de playera son únicos por equipo (incluyendo pendientes)
- [ ] Los teléfonos siguen el formato XXX XXX XXXX
- [ ] Se advierte sobre jugadores menores de 18 años
- [ ] Se validan todos los campos requeridos
- [ ] Las validaciones son claras y ayudan al usuario

### **Tareas:**

- [ ] **T10.1** - Crear PlayerNumberValidator (async, considera ambas colecciones)
- [ ] **T10.2** - Crear PhoneValidator con regex específico
- [ ] **T10.3** - Crear AgeValidator con advertencias no bloqueantes
- [ ] **T10.4** - Implementar validaciones de formulario en tiempo real
- [ ] **T10.5** - Agregar mensajes de error personalizados y claros

**Estimación:** 8 puntos  
**Prioridad:** Alta

---

# TAREAS TÉCNICAS TRANSVERSALES

## **INFRAESTRUCTURA Y ARQUITECTURA**

### **TA1: Configuración de Módulos y Routing**

- [ ] Crear my-team.module.ts con componentes y servicios
- [ ] Configurar teams.module.ts para lazy loading desde admin
- [ ] Actualizar admin-routing.module.ts para cargar teams module
- [ ] Configurar MaterialModule con componentes requeridos
- [ ] Implementar guards y servicios compartidos

**Estimación:** 5 puntos

### **TA2: Servicios de Datos**

- [ ] Extender PlayerService con filtros de jugadores activos
- [ ] Crear PlayerPendingService para gestión de colección temporal
- [ ] Implementar métodos de consulta combinada (activos + pendientes)
- [ ] Agregar manejo de transacciones Firestore
- [ ] Crear servicios de auditoría básicos

**Estimación:** 8 puntos

### **TA3: Commands y Strategy Patterns**

- [ ] Actualizar DeletePlayerCommand para eliminación lógica
- [ ] Crear Commands de aprobación con transacciones atómicas
- [ ] Implementar PlayerSaveStrategy (Admin vs Captain)
- [ ] Crear Commands de rechazo simplificados
- [ ] Agregar manejo de errores y rollbacks

**Estimación:** 10 puntos

### **TA4: Componentes Compartidos y Reutilización**

- [ ] Actualizar badge-item.component para modo preview
- [ ] Verificar compatibilidad con player-photo-capture-view
- [ ] Configurar ModalService y ConfirmationDialogComponent
- [ ] Implementar componentes de estado y progreso
- [ ] Agregar pipes de fecha y formateo

**Estimación:** 5 puntos

## **TESTING Y CALIDAD**

### **TA5: Tests Unitarios**

- [ ] Tests para CaptainGuard y validaciones de permisos
- [ ] Tests para validadores customizados (número, teléfono, edad)
- [ ] Tests para PlayerPendingService y operaciones CRUD
- [ ] Tests para Commands con transacciones
- [ ] Tests para estrategias de guardado

**Estimación:** 13 puntos

### **TA6: Tests de Integración**

- [ ] Tests de flujo completo capitán → admin → aprobación
- [ ] Tests de manejo de estados y bloqueos
- [ ] Tests de validaciones combinadas entre colecciones
- [ ] Tests de transacciones atómicas
- [ ] Tests de casos edge y manejo de errores

**Estimación:** 8 puntos

---

# RESUMEN DE ESTIMACIONES

## **Por Historia de Usuario:**

- Historia 1 (Autorización): **8 puntos**
- Historia 2 (Registro): **13 puntos**
- Historia 3 (Modificación): **8 puntos**
- Historia 4 (Eliminación): **5 puntos**
- Historia 5 (Visualización): **8 puntos**
- Historia 6 (Aprobación Nuevos): **13 puntos**
- Historia 7 (Aprobación Cambios): **10 puntos**
- Historia 8 (Aprobación Eliminaciones): **8 puntos**
- Historia 9 (Rechazo): **5 puntos**
- Historia 10 (Validaciones): **8 puntos**

## **Tareas Técnicas:**

- TA1 (Módulos): **5 puntos**
- TA2 (Servicios): **8 puntos**
- TA3 (Commands): **10 puntos**
- TA4 (Componentes): **5 puntos**
- TA5 (Tests Unitarios): **13 puntos**
- TA6 (Tests Integración): **8 puntos**

## **TOTAL ESTIMADO: 135 puntos**

---

# SPRINTS RECOMENDADOS

## **Sprint 1 - Fundamentos (32 puntos)**

- Historia 1: Autorización y Acceso (8)
- Historia 2: Registro de Jugadores (13)
- TA1: Configuración de Módulos (5)
- TA2: Servicios de Datos (8)

## **Sprint 2 - CRUD Completo (31 puntos)**

- Historia 3: Modificación de Jugadores (8)
- Historia 4: Eliminación de Jugadores (5)
- Historia 5: Visualización de Estado (8)
- Historia 10: Validaciones de Negocio (8)

## **Sprint 3 - Flujo de Aprobación (36 puntos)**

- Historia 6: Aprobación de Nuevos (13)
- Historia 7: Aprobación de Cambios (10)
- Historia 8: Aprobación de Eliminaciones (8)
- Historia 9: Rechazo de Solicitudes (5)

## **Sprint 4 - Calidad y Pulimiento (36 puntos)**

- TA3: Commands y Patterns (10)
- TA4: Componentes Compartidos (5)
- TA5: Tests Unitarios (13)
- TA6: Tests de Integración (8)

---

# DEFINICIÓN DE TERMINADO (DoD)

Para cada Historia de Usuario:

- [ ] ✅ Código implementado según especificaciones
- [ ] ✅ Tests unitarios con cobertura > 80%
- [ ] ✅ Tests de integración para flujos principales
- [ ] ✅ Documentación actualizada
- [ ] ✅ Code review aprobado
- [ ] ✅ QA testing completado
- [ ] ✅ Accesibilidad validada (WCAG básico)
- [ ] ✅ Performance aceptable (< 2s carga inicial)
- [ ] ✅ Compatible con navegadores objetivo
- [ ] ✅ Deploy exitoso en ambiente de testing
