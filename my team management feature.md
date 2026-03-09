## MÓDULO MY-TEAM - ADMINISTRACIÓN DE MI EQUIPO

CU: Registrar jugador por capitan

Happy path

1. el capitan navega a /{zone}/my-team
2. el sistema en base al correo del usuario busca un jugador (él mismo) donde capitan === true || capitan === 1 para saber a qué equipo pertenece y así listar los jugadores pertenecientes a ese equipo
3. hacer clic en registrar jugador
4. abrir un mat bottom sheet y muestra el formulario de registro de un jugador
5. el sistema inicializa el estado (nuevo) del jugador nuevo
6. llenar los campos requeridos:

- nombre completo (jugador/name)
- fecha de nacimiento (dateBirth) - capturada por el sistema, fechaNacimiento se genera automáticamente para compatibilidad Excel
- numero de playera (numero) - validar único por equipo
- telefono celular (celular)
- si es jugador bautizado (noBautizado: si-default/no)
- si es portero (portero: si/no-default)
- si es de otra denominación cristiana (otraDenominacion: si/no-default)

7. **Previsualización**: el sistema muestra una vista previa de la credencial usando el componente badge-item para que el capitán pueda revisar cómo quedará antes de guardar (sin foto, se agregará después por el jugador)
8. clic en el botón registrar
9. el sistema guarda en la **colección temporal** 'players_pending' con estado 'pending_creation' (siguiendo principios DRY, YAGNI, SOLID)

Alternative path
2.1 no se encuentra un jugador asociado al correo del usuario, mostrar mensaje "No tienes un jugador asociado. Contacta al administrador."
2.2 el jugador asociado no es capitán (capitan !== true && capitan !== 1), mostrar mensaje "No tienes permisos de capitán para gestionar el equipo."
6.1 número de playera ya existe en el equipo, el sistema muestra error y solicita un número diferente
6.2 fecha de nacimiento indica menor de 18 años, mostrar advertencia "El jugador es menor de 18 años. ¿Confirmar registro?"
6.3 formato de teléfono incorrecto (debe ser XXX XXX XXXX), mostrar error de validación
7.1 el capitán no está conforme con la previsualización, puede regresar a editar los campos

CU: Modificar jugador por capitan

Happy path

1. el capitan navega a /{zone}/my-team
2. el sistema en base al correo del usuario busca un jugador (él mismo) donde capitan === true || capitan === 1 para saber a qué equipo pertenece y así listar los jugadores pertenecientes a ese equipo
3. hacer clic en un jugador existente
4. abrir un mat bottom sheet y muestra el formulario de edición de un jugador
5. el sistema inicializa el estado (modificado) del jugador con los datos actuales
6. modifica alguno de los campos disponibles:

- nombre completo (jugador/name)
- fecha de nacimiento (dateBirth) - capturada por el sistema, fechaNacimiento se genera automáticamente para compatibilidad Excel
- numero de playera (numero) - validar único por equipo
- telefono celular (celular)
- si es jugador bautizado (noBautizado: si-default/no)
- si es portero (portero: si/no-default)
- si es de otra denominación cristiana (otraDenominacion: si/no-default)

7. **Previsualización**: el sistema muestra una vista previa actualizada de la credencial usando el componente badge-item (manteniendo la foto existente si la hay)
8. clic en el botón guardar cambios
9. el sistema guarda los cambios en la **colección temporal** 'players_pending' con estado 'pending_update' referenciando el jugador original

Alternative path
6.1 número de playera ya existe en el equipo (diferente al actual), el sistema muestra error y solicita un número diferente
6.2 fecha de nacimiento indica menor de 18 años, mostrar advertencia "El jugador es menor de 18 años. ¿Confirmar cambios?"
6.3 formato de teléfono incorrecto (debe ser XXX XXX XXXX), mostrar error de validación
7.1 el capitán no está conforme con la previsualización, puede regresar a editar los campos

CU: Eliminar jugador por capitan

Happy path

1. el capitan navega a /{zone}/my-team
2. el sistema lista los jugadores del equipo del capitán
3. hacer clic en un jugador existente
4. abrir un mat bottom sheet con opciones de edición
5. hacer clic en el botón eliminar
6. el sistema muestra confirmación de eliminación
7. confirmar eliminación
8. el sistema crea un registro en la **colección temporal** 'players_pending' con estado 'pending_deletion' referenciando el jugador a eliminar

Alternative path
6.1 el capitán cancela la eliminación, regresa al formulario de edición

CU: Listar jugadores del equipo

Happy path

1. el capitan navega a /{zone}/my-team
2. el sistema en base al correo del usuario identifica al jugador-capitán (capitan === true || capitan === 1) y obtiene su equipo
3. el sistema muestra la lista de jugadores del equipo combinando:
   - **Jugadores activos**: de la colección 'Jugadores'
   - **Cambios pendientes**: de la colección 'players_pending' con indicadores visuales del estado:
     - 🟡 Cambios pendientes de aprobación (estado: pending\_\*)
     - 🟢 Nuevos jugadores pendientes de aprobación (estado: pending_creation)
     - 🔴 Eliminaciones pendientes de aprobación (estado: pending_deletion)
     - 🔵 En revisión por administrador (estado: under_review)
4. para cada jugador mostrar:
   - foto de perfil (thumbnail)
   - nombre del jugador
   - número de playera
   - rol (capitán/portero si aplica)
   - estado de aprobación
   - acciones (editar/eliminar) - **DESHABILITADAS si está "under_review"**

Alternative path
2.1 el jugador no es capitán, mostrar mensaje "No tienes permisos de capitán para gestionar el equipo."

---

## MÓDULO TEAMS - ADMINISTRACIÓN DE EQUIPOS

CU: Aprobar nuevos jugadores registrados por capitanes

Happy path

1. el administrador navega a /{zone}/admin/teams
2. el sistema lista todos los registros pendientes de la colección 'players_pending' con estado 'pending_creation'
3. el administrador revisa los datos del nuevo jugador y la previsualización de credencial
4. hacer clic en "Aprobar"
5. el sistema:
   - mueve el jugador de 'players_pending' a 'Jugadores'
   - convierte dateBirth a fechaNacimiento usando ExcelService.convertJavascriptDateToExcel()
   - actualiza el badge en la colección 'badges'
   - elimina el registro temporal

Alternative path
4.1 hacer clic en "Rechazar" - el sistema muestra confirmación de que se descartarán los cambios solicitados por el capitán, al confirmar elimina el registro temporal

CU: Aprobar cambios de jugadores por capitanes

Happy path

1. el administrador navega a /{zone}/admin/teams
2. el sistema lista todos los registros pendientes con estado 'pending_update'
3. el administrador revisa los cambios propuestos vs datos actuales
4. hacer clic en "Aprobar cambios"
5. el sistema:
   - actualiza el jugador en la colección 'Jugadores' con los nuevos datos
   - convierte dateBirth a fechaNacimiento usando ExcelService.convertJavascriptDateToExcel()
   - actualiza el badge correspondiente
   - elimina el registro temporal

Alternative path
4.1 hacer clic en "Rechazar cambios" - el sistema muestra confirmación de que se descartarán los cambios solicitados por el capitán, al confirmar elimina el registro temporal

CU: Aprobar eliminación de jugadores por capitanes

Happy path

1. el administrador navega a /{zone}/admin/teams
2. el sistema lista todos los registros pendientes con estado 'pending_deletion'
3. el administrador revisa la información del jugador a eliminar
4. hacer clic en "Aprobar eliminación"
5. el sistema:
   - marca el jugador como INACTIVO en la colección 'Jugadores' (eliminación lógica)
   - elimina el badge asociado de la colección 'badges'
   - elimina el registro temporal

Alternative path
4.1 hacer clic en "Rechazar eliminación" - el sistema muestra confirmación de que se descartará la solicitud de eliminación del capitán, al confirmar elimina el registro temporal y mantiene el jugador activo

NFR (Requerimientos No Funcionales)

2. **Módulos de Angular**:

   - `my-team.module.ts`: administración de equipo por capitanes
   - `teams.module.ts`: administración de equipos por administradores (aprobar cambios) - lazy loading desde admin.module.ts
   - Ruta: `/{zone}/admin/teams` (teams.module.ts cargado lazy desde admin-routing.module.ts)

3. **Colecciones de Firestore**:

   - `Jugadores`: colección principal con jugadores activos
   - `players_pending`: colección temporal para cambios pendientes de aprobación
   - `badges`: credenciales de jugadores

4. **Estados de la colección temporal**:

   - `pending_creation`: nuevo jugador registrado por capitán (puede editarse)
   - `pending_update`: modificación de jugador existente (puede editarse)
   - `pending_deletion`: eliminación solicitada por capitán (puede cancelarse)
   - `under_review`: registro siendo revisado por administrador (NO puede editarse por capitán)

5. **Gestión de estados y bloqueos**:

   - **Estado "under_review"**: Se activa cuando administrador abre el detalle de un registro pendiente
   - **Bloqueo temporal**: Capitanes no pueden editar/eliminar registros en "under_review"
   - **Auto-liberación**: Estado regresa a pending\_\* si admin cierra sin acción después de timeout
   - **Validación de capitán**: Sistema verifica que correo esté asociado a jugador con capitan === true || capitan === 1

6. **Foto de perfil**:

   - **CAMBIO**: Los capitanes NO capturan fotos
   - **Flujo simplificado**: Jugadores usan la funcionalidad pública existente (`/{zone}/public-players`) para tomarse la foto directamente
   - Los administradores pueden aprobar jugadores sin foto, la foto se agrega después por el jugador mismo
   - Reutilizar `player-photo-capture-view.component` existente para el flujo público

7. **Previsualización de credencial**:

   - reutilizar el componente `badge-item.component.html` existente
   - mostrar vista previa en tiempo real mientras se editan los campos
   - **IMPORTANTE**: credencial se muestra sin foto inicialmente, se agregará después por el jugador
   - permitir ajustes antes de guardar definitivamente

8. **Validaciones de negocio**:

   - **Número de playera único por equipo**: validar en Jugadores (activos) + players_pending
   - **Formato de teléfono**: XXX XXX XXXX (ej: 555 123 4567)
   - **Formato de correo electrónico**: validación estándar para capitanes
   - **Edad mínima**: advertencia (no bloqueo) si menor de 18 años
   - **Límite de jugadores**: sin máximo por equipo
   - **Eliminación de capitán**: permitida con advertencia "Estás eliminando un capitán"

9. **Retro compatibilidad de fechas**:

   - `fechaNacimiento`: fecha en formato numérico Excel (solo para importaciones masivas)
   - `dateBirth`: fecha capturada manualmente por el sistema (Date object)
   - usar `ExcelService.convertExcelDateToJSDate()` para leer fechas de importaciones
   - usar `ExcelService.convertJavascriptDateToExcel()` para convertir dateBirth a fechaNacimiento
   - usar `ExcelDatePipe` para mostrar fechas en templates

10. **Mapeo de campos del modelo Player**:

    - `jugador/name`: nombre completo
    - `numero`: número de playera
    - `celular`: teléfono celular (formato XXX XXX XXXX)
    - `fechaNacimiento`: fecha de nacimiento (formato Excel numérico - solo importaciones)
    - `dateBirth`: fecha de nacimiento (Date object - captura manual)
    - `noBautizado`: si es jugador bautizado (booleano invertido)
    - `portero`: si es portero (número 0/1)
    - `capitan`: si es capitán (boolean true o número 1)
    - `otraDenominacion`: si es de otra denominación cristiana
    - `correo`: email del jugador (requerido para capitanes)
    - `status`: estado del jugador (ACTIVO/INACTIVO - para eliminación lógica, retrocompatible)

11. **Principios de desarrollo**:

    - **DRY (Don't Repeat Yourself)**: reutilizar componentes existentes como badge-item
    - **YAGNI (You Ain't Gonna Need It)**: implementar solo funcionalidades requeridas
    - **SOLID**: separación de responsabilidades con Commands y Services
    - **Single Source of Truth**: colección temporal como única fuente de cambios pendientes

12. **Componentes de Angular Material recomendados**:

    - **MatBottomSheet**: para formularios de edición/registro (capitanes) y detalle de aprobación (administradores)
    - **MatStepper**: para flujo de registro paso a paso
    - **MatFormField + MatInput**: campos de texto (nombre, teléfono)
    - **MatDatepicker**: selector de fecha de nacimiento
    - **MatSelect**: selección de equipo y opciones
    - **MatCheckbox/MatSlideToggle**: opciones booleanas (portero, bautizado)
    - **MatButton + MatIcon**: botones de acción
    - **MatCard**: contenedores de información
    - **MatList + MatListItem**: lista de jugadores y jugadores pendientes
    - **MatChip**: indicadores de estado (pendiente, aprobado)
    - **MatBadge**: notificaciones de cambios pendientes
    - **MatDialog**: confirmaciones de eliminación (**reutilizar ConfirmationDialogComponent existente**)
    - **MatSnackBar**: notificaciones de éxito/error
    - **MatProgressSpinner**: indicadores de carga
    - **MatTabs**: organización de formularios y estados de aprobación
    - **MatTooltip**: ayuda contextual

13. **Eliminación lógica y retrocompatibilidad**:

    - **Campo status**: ACTIVO/INACTIVO para eliminación lógica
    - **Consultas**: filtrar automáticamente jugadores con status !== 'INACTIVO'
    - **Retrocompatibilidad**: documentos sin campo status se consideran ACTIVO
    - **Componentes existentes**: reutilizar ModalService y ConfirmationDialogComponent

14. **Arquitectura técnica**:

- **Módulos**: my-team.module.ts (capitanes) + teams.module.ts (administradores, lazy loaded)
- **Lazy Loading**: teams.module.ts cargado desde admin-routing.module.ts
- **Transacciones Firestore**: operaciones atómicas para aprobación/rechazo
- **Guards de autorización**: validar que usuario es capitán antes de acceder
- Commands para CRUD operations (Create, Update, Delete)
- Service para consultas (PlayerService + PlayerPendingService)
- Guards para autenticación (AuthGuard) y autorización (CaptainGuard)
- Reactive Forms con validaciones
- ExcelService para conversiones de fecha

13. **Flujo de aprobación**:
    - Capitanes: crean/modifican/eliminan → van a colección temporal
    - Administradores: revisan y aprueban/rechazan → mueven a colección principal
    - **Transacciones atómicas**: garantizan consistencia en operaciones complejas

---

## PLANIFICACIÓN TÉCNICA DE IMPLEMENTACIÓN

### **1. Modificaciones al modelo Player**

```typescript
// Agregar enum para status
export enum PlayerStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

// Actualizar interface IPlayer
interface IPlayer {
  // ... campos existentes
  status?: PlayerStatus; // Nuevo campo opcional para retrocompatibilidad
}

// Actualizar clase Player constructor
constructor(player: IPlayer) {
  // ... asignaciones existentes
  this.status = player.status ?? PlayerStatus.ACTIVO; // Default ACTIVO
}
```

### **2. Modificaciones al PlayerService**

#### **Eliminación lógica:**

```typescript
// Método para marcar como inactivo (eliminación lógica)
async markPlayerAsInactive(playerId: string): Promise<void> {
  const ref = this.db.firestore.collection('Jugadores').doc(playerId);
  await ref.update({ status: PlayerStatus.INACTIVO });
}

// Filtro para retrocompatibilidad en consultas
private isPlayerActive(player: IPlayer): boolean {
  return !player.status || player.status !== PlayerStatus.INACTIVO;
}
```

#### **Actualización de métodos existentes:**

```typescript
// getPlayersByTeam - agregar filtro de jugadores activos
getPlayersByTeam(teamName: string): Observable<IPlayer[]> {
  return this.db.collection<IPlayer>('Jugadores', ref =>
    ref.orderBy('jugador').where('equipo', '==', teamName)
  )
  .snapshotChanges()
  .pipe(
    map(actions => actions
      .map(action => { /* conversión existente */ })
      .filter(player => this.isPlayerActive(player)) // NUEVO: Filtrar activos
    )
  );
}

// Aplicar mismo filtro a otros métodos:
// - getGoalKeepers()
// - getCaptains()
// - getFiltered()
```

### **3. Nuevo servicio para colección temporal**

```typescript
// Crear PlayerPendingService
@Injectable({ providedIn: 'root' })
export class PlayerPendingService {

  // Estados de la colección temporal
  enum PendingStatus {
    PENDING_CREATION = 'pending_creation',
    PENDING_UPDATE = 'pending_update',
    PENDING_DELETION = 'pending_deletion',
    UNDER_REVIEW = 'under_review'
  }

  // Interface para registro temporal
  interface IPendingPlayer extends IPlayer {
    pendingStatus: PendingStatus;
    originalPlayerId?: string; // Para updates y deletes
    requestedBy: string; // Email del capitán
    requestedAt: Date;
    reviewedBy?: string; // Email del admin en revisión
    reviewedAt?: Date;
  }

  // Métodos principales
  async createPendingPlayer(player: IPlayer, captainEmail: string): Promise<void>
  async createPendingUpdate(playerId: string, updates: Partial<IPlayer>, captainEmail: string): Promise<void>
  async createPendingDeletion(playerId: string, captainEmail: string): Promise<void>

  // Control de estado "under_review"
  async markAsUnderReview(pendingId: string, adminEmail: string): Promise<void>
  async releaseFromReview(pendingId: string): Promise<void>

  // Para administradores
  getPendingPlayersByStatus(status: PendingStatus): Observable<IPendingPlayer[]>
  async approvePendingPlayer(pendingId: string, adminEmail: string): Promise<void>
  async rejectPendingPlayer(pendingId: string, adminEmail: string): Promise<void>
}
```

### **4. Commands actualizados**

#### **DeletePlayerCommand - usar eliminación lógica:**

```typescript
@Injectable({ providedIn: "root" })
export class DeletePlayerCommand {
  async execute(player: IPlayer): Promise<void> {
    // CAMBIO: En lugar de eliminar físicamente, marcar como INACTIVO
    const ref = this.db.firestore.collection("Jugadores").doc(player.id);
    await ref.update({ status: PlayerStatus.INACTIVO });

    // Mantener eliminación de badge
    await this.deleteBadge(player);
  }
}
```

#### **Nuevos Commands para flujo de aprobación:**

```typescript
// ApprovePlayerCreationCommand - con transacciones
@Injectable({ providedIn: "root" })
export class ApprovePlayerCreationCommand {
  async execute(pendingPlayer: IPendingPlayer, adminEmail: string): Promise<void> {
    const batch = this.db.firestore.batch();

    // 1. Crear jugador en colección principal
    const playerRef = this.db.firestore.collection("Jugadores").doc();
    batch.set(playerRef, { ...pendingPlayer, status: PlayerStatus.ACTIVO });

    // 2. Crear badge
    const badgeRef = this.db.firestore.collection("badges").doc(playerRef.id);
    batch.set(badgeRef, {
      /* datos del badge */
    });

    // 3. Eliminar registro temporal
    const pendingRef = this.db.firestore.collection("players_pending").doc(pendingPlayer.id);
    batch.delete(pendingRef);

    // 4. Log de auditoria
    const auditRef = this.db.firestore.collection("audit_log").doc();
    batch.set(auditRef, {
      action: "approve_creation",
      playerId: playerRef.id,
      adminEmail,
      timestamp: new Date(),
    });

    await batch.commit(); // Transacción atómica
  }
}

// ApprovePlayerUpdateCommand
// ApprovePlayerDeletionCommand
// RejectPendingPlayerCommand - simplificado sin motivo
@Injectable({ providedIn: "root" })
export class RejectPendingPlayerCommand {
  async execute(pendingId: string, adminEmail: string): Promise<void> {
    const batch = this.db.firestore.batch();

    // 1. Eliminar registro temporal
    const pendingRef = this.db.firestore.collection("players_pending").doc(pendingId);
    batch.delete(pendingRef);

    // 2. Log de auditoria
    const auditRef = this.db.firestore.collection("audit_log").doc();
    batch.set(auditRef, {
      action: "reject",
      pendingId,
      adminEmail,
      timestamp: new Date(),
    });

    await batch.commit();
  }
}
```

### **5. Componentes de UI a crear**

#### **Módulo my-team:**

```typescript
// my-team-management.component.ts - Componente principal
// - Lista jugadores activos + pendientes
// - Botón "Registrar jugador"
// - Indicadores de estado (🟡🟢🔴)

// player-form.component.ts - Formulario unificado
// - Reutilizar lógica de player-editor.component.ts
// - Agregar previsualización con badge-item (sin foto)
// - **SIMPLIFICADO**: Sin captura de foto, formulario más simple y rápido
```

#### **Módulo teams (lazy loaded):**

```typescript
// teams.module.ts - Módulo independiente para gestión de equipos
// teams-routing.module.ts - Rutas específicas para equipos
// pending-players-list.component.ts
// - Lista pendientes por estado
// - Botones aprobar/rechazar rápido en la lista
// - Clic en jugador → abre MatBottomSheet con pending-player-detail.component

// pending-player-detail.component.ts (MatBottomSheet)
// - Componente mostrado en MatBottomSheet
// - Comparación datos actuales vs propuestos
// - Previsualización de credencial lado a lado
// - Botones aprobar/rechazar con confirmación
// - Cierra el bottom sheet al completar acción
```

### **6. Integración con componentes existentes**

#### **Reutilización:**

```typescript
// ✅ ModalService - para confirmaciones
// ✅ ConfirmationDialogComponent - para rechazos
// ✅ badge-item.component - para previsualización (sin foto)
// ✅ player-photo-capture-view - MANTENER para flujo público de jugadores
// ✅ ExcelService - conversión de fechas
```

#### **Modificaciones mínimas:**

```typescript
// player-editor.component.ts
// - **PATRÓN ESTRATEGIA**: Determinar destino según contexto (admin vs capitán)
// - Integrar previsualización
// - Strategy: AdminPlayerStrategy vs CaptainPlayerStrategy

// badge-item.component.ts
// - Agregar modo "preview" para datos temporales

// **NUEVO**: PlayerSaveStrategy
interface IPlayerSaveStrategy {
  save(player: IPlayer): Promise<void>;
}

class AdminPlayerStrategy implements IPlayerSaveStrategy {
  async save(player: IPlayer): Promise<void> {
    // Guardar directamente en colección 'Jugadores'
  }
}

class CaptainPlayerStrategy implements IPlayerSaveStrategy {
  async save(player: IPlayer): Promise<void> {
    // Guardar en colección temporal 'players_pending'
  }
}
```

### **7. Rutas y navegación**

```typescript
// my-team-routing.module.ts
const routes: Routes = [
  {
    path: "",
    component: MyTeamManagementComponent,
    canActivate: [AuthGuard, CaptainGuard], // Agregar CaptainGuard
  },
];

// admin-routing.module.ts (existente)
// Lazy loading del módulo teams
const routes: Routes = [{ path: "teams", loadChildren: () => import("../teams/teams.module").then((m) => m.TeamsModule) }];

// teams-routing.module.ts (nuevo)
// Rutas específicas del módulo teams
const routes: Routes = [
  { path: "", component: PendingPlayersListComponent },
  // Nota: detail/:id se maneja como MatBottomSheet desde PendingPlayersListComponent
];
```

### **8. Validaciones de negocio**

```typescript
// Validador para números únicos considerando pendientes
class PlayerNumberValidator {
  static uniqueNumber(teamName: string, excludePlayerId?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      // Verificar en ambas colecciones
      const activePlayersQuery = this.db.collection("Jugadores", (ref) => ref.where("equipo", "==", teamName).where("numero", "==", control.value).where("status", "!=", PlayerStatus.INACTIVO));

      const pendingPlayersQuery = this.db.collection("players_pending", (ref) => ref.where("equipo", "==", teamName).where("numero", "==", control.value).where("pendingStatus", "in", ["pending_creation", "pending_update", "under_review"]));

      return combineLatest([activePlayersQuery.get(), pendingPlayersQuery.get()]).pipe(
        map(([active, pending]) => {
          const duplicates = [...active.docs, ...pending.docs].filter((doc) => (excludePlayerId ? doc.id !== excludePlayerId : true));

          return duplicates.length > 0 ? { numberExists: true } : null;
        })
      );
    };
  }
}

// Validador de formato de teléfono
class PhoneValidator {
  static phoneFormat(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const phoneRegex = /^\d{3} \d{3} \d{4}$/; // XXX XXX XXXX
    return phoneRegex.test(control.value) ? null : { invalidPhoneFormat: true };
  }
}

// Validador de edad
class AgeValidator {
  static ageWarning(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    // No es error, solo advertencia
    return age < 18 ? { underAge: { age } } : null;
  }
}

// Guard para capitanes
@Injectable({ providedIn: "root" })
export class CaptainGuard implements CanActivate {
  constructor(private playerService: PlayerService, private accountService: AccountService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const userEmail = this.accountService.currentUser?.email;
    if (!userEmail) {
      this.router.navigate(["/login"]);
      return of(false);
    }

    return this.playerService.getPlayerByEmail(userEmail).pipe(
      map((player) => {
        if (!player) {
          this.showMessage("No tienes un jugador asociado. Contacta al administrador.");
          return false;
        }

        if (!this.isCaptain(player)) {
          this.showMessage("No tienes permisos de capitán para gestionar el equipo.");
          return false;
        }

        return true;
      })
    );
  }

  private isCaptain(player: IPlayer): boolean {
    return player.capitan === true || player.capitan === 1;
  }
}
```

### **11. Flujo simplificado de fotos**

```typescript
// **DECISIÓN**: Prescindir de captura de foto por capitán
// **MOTIVO**: Ya existe funcionalidad pública para que jugadores se tomen la foto

// **FLUJO ACTUAL**:
// 1. Capitán registra jugador (sin foto) → players_pending
// 2. Administrador aprueba → Jugadores (sin foto aún)
// 3. Jugador usa /{zone}/public-players para tomarse la foto
// 4. player-photo-capture-view.component maneja el upload a Firebase + badge

// **VENTAJAS**:
// ✅ Formulario más simple y rápido para capitanes
// ✅ Reutiliza componente existente sin modificaciones
// ✅ Jugador controla su propia foto
// ✅ Menos responsabilidad para capitanes
// ✅ Flujo más natural: datos primero, foto después

// **CONSIDERACIONES**:
// - badge-item.component debe manejar estado "sin foto"
// - Credencial se completa en dos pasos separados
```

### **12. Migración y retrocompatibilidad**

```typescript
// Script de migración (opcional)
// - Agregar campo status: 'ACTIVO' a documentos existentes
// - O manejar en código con valor default

// Estrategia recomendada: manejar en código
// - Más flexible, sin necesidad de migración masiva
// - Constructor de Player asigna ACTIVO por default
```

### **13. Tests a implementar**

````typescript
// PlayerService
// - Filtrado de jugadores activos
// - Retrocompatibilidad sin campo status

// PlayerPendingService
// - CRUD de registros temporales
// - Flujo de aprobación/rechazo

// PlayerSaveStrategy
// - AdminPlayerStrategy vs CaptainPlayerStrategy
// - Contexto correcto según usuario

// **REMOVIDO**: PhotoCaptureComponent - no necesario
// - Usar player-photo-capture-view existente para flujo público

### **14. Flujo completo de registro de jugador**

```typescript
// **FASE 1: Registro por Capitán** (/{zone}/my-team)
// 1. CaptainGuard valida que usuario es capitán (capitan === true || capitan === 1)
// 2. Capitán llena formulario básico (sin foto)
// 3. Validaciones en tiempo real:
//    - Número único en equipo (Jugadores + players_pending)
//    - Formato teléfono XXX XXX XXXX
//    - Advertencia si menor de 18 años
// 4. Previsualización de credencial (badge sin foto)
// 5. Guarda en players_pending con estado 'pending_creation'

// **FASE 2: Aprobación por Administrador** (/{zone}/admin/teams)
// 1. Administrador ve lista de pendientes por estado
// 2. Clic en jugador → MatBottomSheet con detalle
// 3. Al abrir detalle → cambia estado a 'under_review' (bloquea edición por capitán)
// 4. Administrador puede:
//    - Aprobar → Transacción atómica: mover a Jugadores + crear badge + log
//    - Rechazar → Solicitar motivo + eliminar registro + notificar capitán
// 5. Estado regresa a normal después de acción

// **FASE 3: Foto por Jugador** (/{zone}/public-players)
// 1. Jugador accede con equipo + nombre
// 2. Usa player-photo-capture-view.component existente
// 3. Toma foto + crop + upload automático
// 4. Badge se actualiza con foto

// **RESULTADO**: Credencial completa con todos los datos + foto

// **Validaciones implementadas**:
// ✅ Identificación de capitán por campo 'capitan'
// ✅ Mensaje de error si no tiene jugador asociado
// ✅ Validación de permisos de capitán
// ✅ Transacciones atómicas en Firestore
// ✅ Estado "under_review" para prevenir conflictos
// ✅ Motivo obligatorio al rechazar
// ✅ Validaciones de negocio (número único, teléfono, edad)
// ✅ Guards de autorización (CaptainGuard)

// **Tests a implementar**:
// - CaptainGuard: validación de permisos
// - PlayerNumberValidator: números únicos considerando pendientes
// - PhoneValidator: formato XXX XXX XXXX
// - AgeValidator: advertencia menor de 18
// - Transacciones atómicas de Commands
// - Estados "under_review" y bloqueos
// - Motivos de rechazo y notificaciones
````

```

```
