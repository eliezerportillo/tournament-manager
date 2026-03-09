import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPlayer } from '@app-core/models/player';
import firebase from 'firebase/compat/app';

export enum PendingStatus {
  PENDING_CREATION = 'pending_creation',
  PENDING_UPDATE = 'pending_update',
  PENDING_DELETION = 'pending_deletion',
  UNDER_REVIEW = 'under_review',
  REJECTED = 'rejected',
}

export interface IPendingPlayer extends IPlayer {
  pendingStatus: PendingStatus;
  originalPlayerId?: string; // For updates and deletes
  requestedBy: string; // Email del capitán
  requestedAt: Date;
  reviewedBy?: string; // Email del admin en revisión
  reviewedAt?: Date;
  rejectedReason?: string; // Reason for rejection when status is REJECTED
}

@Injectable({
  providedIn: 'root',
})
export class PlayerPendingService {
  private db = inject(AngularFirestore);
  private collectionName = 'players_pending';

  /**
   * Converts Firestore timestamp fields to JavaScript Date objects
   */
  private convertTimestamps(data: any): IPendingPlayer {
    return {
      ...data,
      // Convert pending-specific timestamps
      requestedAt: data.requestedAt?.toDate
        ? data.requestedAt.toDate()
        : data.requestedAt,
      reviewedAt: data.reviewedAt?.toDate
        ? data.reviewedAt.toDate()
        : data.reviewedAt,
      // Convert player date fields that might be Firestore Timestamps
      dateBirth: data.dateBirth?.toDate
        ? data.dateBirth.toDate()
        : data.dateBirth,
      fechaRegistro: data.fechaRegistro?.toDate
        ? data.fechaRegistro.toDate()
        : data.fechaRegistro,
    } as IPendingPlayer;
  }

  /**
   * Sanitizes player data by removing undefined values and setting defaults
   */
  private sanitizePlayerData(player: IPlayer): IPlayer {
    const sanitized: any = {};

    // Copy all defined values
    Object.keys(player).forEach((key) => {
      const value = (player as any)[key];
      if (value !== undefined) {
        sanitized[key] = value;
      }
    });

    // Ensure required fields have default values and convert booleans to numbers
    return {
      ...sanitized,
      noAlinea: sanitized.noAlinea ? 1 : 0,
      amarillas: sanitized.amarillas ?? 0,
      rojas: sanitized.rojas ?? 0,
      goles: sanitized.goles ?? 0,
      autogoles: sanitized.autogoles ?? 0,
      asistencias: sanitized.asistencias ?? 0,
      faltas: sanitized.faltas ?? 0,
      capitan: sanitized.capitan ? 1 : 0,
      portero: sanitized.portero ? 1 : 0,
      noBautizado: sanitized.noBautizado ? 1 : 0,
      otraDenominacion: sanitized.otraDenominacion ? 1 : 0,
      estado: sanitized.estado ?? 'Activo',
    } as IPlayer;
  }

  /**
   * Creates a new pending player for creation approval
   */
  async createPendingPlayer(
    player: IPlayer,
    captainEmail: string
  ): Promise<void> {
    // Sanitize player data to remove undefined values
    const sanitizedPlayer = this.sanitizePlayerData(player);

    const pendingPlayer: IPendingPlayer = {
      ...sanitizedPlayer,
      pendingStatus: PendingStatus.PENDING_CREATION,
      requestedBy: captainEmail,
      requestedAt: new Date(),
    };

    const doc = this.db.firestore.collection(this.collectionName).doc();
    await doc.set(pendingPlayer);
  }

  /**
   * Creates a pending update request for an existing player
   */
  async createPendingUpdate(
    playerId: string,
    updates: Partial<IPlayer>,
    captainEmail: string
  ): Promise<void> {
    // Sanitize player data to remove undefined values
    const sanitizedUpdates = this.sanitizePlayerData(updates as IPlayer);

    const pendingPlayer: IPendingPlayer = {
      ...sanitizedUpdates,
      pendingStatus: PendingStatus.PENDING_UPDATE,
      originalPlayerId: playerId,
      requestedBy: captainEmail,
      requestedAt: new Date(),
    };

    const doc = this.db.firestore.collection(this.collectionName).doc();
    await doc.set(pendingPlayer);
  }

  /**
   * Creates a pending deletion request for an existing player
   */
  async createPendingDeletion(
    playerId: string,
    player: IPlayer,
    captainEmail: string
  ): Promise<void> {
    // Sanitize player data to remove undefined values
    const sanitizedPlayer = this.sanitizePlayerData(player);

    const pendingPlayer: IPendingPlayer = {
      ...sanitizedPlayer,
      pendingStatus: PendingStatus.PENDING_DELETION,
      originalPlayerId: playerId,
      requestedBy: captainEmail,
      requestedAt: new Date(),
    };

    const doc = this.db.firestore.collection(this.collectionName).doc();
    await doc.set(pendingPlayer);
  }

  /**
   * Gets pending players by status
   */
  getPendingPlayersByStatus(
    status: PendingStatus
  ): Observable<IPendingPlayer[]> {
    return this.db
      .collection<IPendingPlayer>(this.collectionName, (ref) =>
        ref.where('pendingStatus', '==', status).orderBy('requestedAt', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data();
            const convertedData = this.convertTimestamps(data);

            // Ensure the document ID is preserved and not overwritten by data.id
            return {
              ...convertedData,
              id: action.payload.doc.id, // Always use the actual document ID
            } as IPendingPlayer;
          })
        )
      );
  }

  /**
   * Gets pending players by team for captain view
   */
  getPendingPlayersByTeam(teamName: string): Observable<IPendingPlayer[]> {
    return this.db
      .collection<IPendingPlayer>(this.collectionName, (ref) =>
        ref.where('equipo', '==', teamName).orderBy('requestedAt', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data();
            const convertedData = this.convertTimestamps(data);

            // Ensure the document ID is preserved and not overwritten by data.id
            return {
              ...convertedData,
              id: action.payload.doc.id, // Always use the actual document ID
            } as IPendingPlayer;
          })
        )
      );
  }

  /**
   * Gets all pending players (for admin)
   */
  getAllPendingPlayers(): Observable<IPendingPlayer[]> {
    return this.db
      .collection<IPendingPlayer>(this.collectionName, (ref) =>
        ref.orderBy('requestedAt', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data();
            const convertedData = this.convertTimestamps(data);

            // Ensure the document ID is preserved and not overwritten by data.id
            return {
              ...convertedData,
              id: action.payload.doc.id, // Always use the actual document ID
            } as IPendingPlayer;
          })
        )
      );
  }

  /**
   * Marks a pending player as under review by admin
   */
  async markAsUnderReview(
    pendingId: string,
    adminEmail: string
  ): Promise<void> {
    const ref = this.db.firestore
      .collection(this.collectionName)
      .doc(pendingId);
    await ref.update({
      pendingStatus: PendingStatus.UNDER_REVIEW,
      reviewedBy: adminEmail,
      reviewedAt: new Date(),
    });
  }

  /**
   * Releases a pending player from review status
   */
  async releaseFromReview(pendingId: string): Promise<void> {
    const ref = this.db.firestore
      .collection(this.collectionName)
      .doc(pendingId);
    const doc = await ref.get();

    if (doc.exists) {
      const data = doc.data() as IPendingPlayer;
      let newStatus = PendingStatus.PENDING_CREATION;

      if (data.originalPlayerId) {
        newStatus = PendingStatus.PENDING_UPDATE;
      }

      await ref.update({
        pendingStatus: newStatus,
        reviewedBy: null,
        reviewedAt: null,
      });
    }
  }

  /**
   * Rejects a pending player request with a reason
   */
  async rejectPendingPlayer(
    pendingId: string,
    rejectedReason: string,
    reviewedBy: string
  ): Promise<void> {
    console.log('🔄 Starting rejection process:', {
      pendingId,
      rejectedReason: rejectedReason?.substring(0, 50) + '...',
      reviewedBy,
      collectionName: this.collectionName,
    });

    try {
      const ref = this.db.firestore
        .collection(this.collectionName)
        .doc(pendingId);

      console.log('📋 Checking document existence for ID:', pendingId);

      // Check if the document exists before trying to update it
      const doc = await ref.get();

      console.log('🔍 Document check result:', {
        exists: doc.exists,
        docId: doc.id,
        hasData: !!doc.data(),
      });

      if (!doc.exists) {
        console.error(
          '❌ Document not found in collection:',
          this.collectionName
        );
        throw new Error('Solicitud pendiente no encontrada');
      }

      const existingData = doc.data() as IPendingPlayer;
      console.log('📄 Existing document data:', {
        pendingStatus: existingData.pendingStatus,
        jugador: existingData.jugador,
        equipo: existingData.equipo,
        requestedBy: existingData.requestedBy,
      });

      // Prepare update data with proper validation
      const updateData = {
        pendingStatus: PendingStatus.REJECTED,
        rejectedReason: rejectedReason || '',
        reviewedBy: reviewedBy || '',
        reviewedAt: new Date(),
      };

      // Validate that all required fields are present
      if (!updateData.rejectedReason.trim()) {
        throw new Error('La razón de rechazo es requerida');
      }

      if (!updateData.reviewedBy.trim()) {
        throw new Error('El revisor es requerido');
      }

      console.log('💾 Attempting to update document with data:', updateData);

      await ref.update(updateData);

      console.log('✅ Document updated successfully');

      // Create audit log for rejection
      const auditRef = this.db.firestore.collection('audit_log').doc();

      const auditData = {
        action: 'reject_player_request',
        entityType: 'pending_player',
        entityId: pendingId,
        adminEmail: reviewedBy,
        playerName: existingData.jugador || 'Unknown',
        teamName: existingData.equipo || 'Unknown',
        timestamp: new Date(),
        details: {
          rejectedReason,
          originalStatus: existingData.pendingStatus,
          requestedBy: existingData.requestedBy,
        },
      };

      console.log('📝 Creating audit log');
      await auditRef.set(auditData);
      console.log('✅ Rejection process completed successfully');
    } catch (error) {
      console.error('❌ Error in rejectPendingPlayer:', error);
      console.error('🔍 Error details:', {
        errorCode: (error as any).code,
        errorMessage: (error as any).message,
        pendingId,
        collectionName: this.collectionName,
      });
      throw error;
    }
  }

  /**
   * Updates an existing pending player record
   */
  async updatePendingPlayer(
    pendingId: string,
    updates: Partial<IPlayer>,
    requestedBy: string
  ): Promise<void> {
    const ref = this.db.firestore
      .collection(this.collectionName)
      .doc(pendingId);

    // Sanitize update data to remove undefined values
    const sanitizedUpdates = this.sanitizePlayerData(updates as IPlayer);

    const updateData: any = {
      ...sanitizedUpdates,
      requestedBy,
      requestedAt: new Date(),
      // Reset review status when updated - use FieldValue.delete() instead of undefined
      reviewedBy: firebase.firestore.FieldValue.delete(),
      reviewedAt: firebase.firestore.FieldValue.delete(),
    };

    await ref.update(updateData);
  }

  /**
   * Deletes a pending player record
   */
  async deletePendingPlayer(pendingId: string): Promise<void> {
    const ref = this.db.firestore
      .collection(this.collectionName)
      .doc(pendingId);
    await ref.delete();
  }

  /**
   * Checks if a player number is unique in both active and pending collections
   * @param teamName Team name to check within
   * @param numero Jersey number to validate
   * @param playerName Player name - if provided, excludes records for this player (for edits)
   */
  async isPlayerNumberUnique(
    teamName: string,
    numero: string,
    playerName?: string
  ): Promise<boolean> {
    console.log('🔍 Validating jersey number uniqueness:', {
      teamName,
      numero,
      playerName,
      isEdit: !!playerName,
    });

    // Check active players
    const activePlayersQuery = this.db.firestore
      .collection('Jugadores')
      .where('equipo', '==', teamName)
      .where('numero', '==', numero);

    const activeSnapshot = await activePlayersQuery.get();
    let activeConflicts = activeSnapshot.docs;

    // If editing, exclude records with the same player name
    if (playerName) {
      const normalizedPlayerName = playerName.trim().toUpperCase();
      activeConflicts = activeSnapshot.docs.filter((doc) => {
        const data = doc.data();
        const activePlayerName = (data['jugador'] || data['name'] || '')
          .trim()
          .toUpperCase();
        const isCurrentPlayer = activePlayerName === normalizedPlayerName;

        if (isCurrentPlayer) {
          console.log(
            `⚪ Excluding active player: ${activePlayerName} (same as editing player)`
          );
        }

        return !isCurrentPlayer; // Only include if it's NOT the current player
      });
    }

    console.log('🏃‍♂️ Active players conflicts found:', activeConflicts.length);

    if (activeConflicts.length > 0) {
      console.log('❌ Number blocked by active player');
      return false;
    }

    // Check pending players
    const pendingPlayersQuery = this.db.firestore
      .collection(this.collectionName)
      .where('equipo', '==', teamName)
      .where('numero', '==', numero)
      .where('pendingStatus', 'in', [
        PendingStatus.PENDING_CREATION,
        PendingStatus.PENDING_UPDATE,
        PendingStatus.UNDER_REVIEW,
      ]);

    const pendingSnapshot = await pendingPlayersQuery.get();
    console.log(
      '⏳ Total pending players with same number:',
      pendingSnapshot.docs.length
    );

    const conflictingDocs: string[] = [];
    let pendingConflicts = pendingSnapshot.docs;

    // If editing, exclude records with the same player name
    if (playerName) {
      const normalizedPlayerName = playerName.trim().toUpperCase();
      pendingConflicts = pendingSnapshot.docs.filter((doc) => {
        const data = doc.data();
        const pendingPlayerName = (data['jugador'] || data['name'] || '')
          .trim()
          .toUpperCase();
        const isCurrentPlayer = pendingPlayerName === normalizedPlayerName;

        if (isCurrentPlayer) {
          console.log(
            `⚪ Excluding pending player: ${pendingPlayerName} (same as editing player)`
          );
        } else {
          console.log(`❌ Conflict found with pending player:`, {
            id: doc.id,
            name: pendingPlayerName,
            status: data['pendingStatus'],
          });
          conflictingDocs.push(doc.id);
        }

        return !isCurrentPlayer; // Only include if it's NOT the current player
      });
    } else {
      // Creating new player - all pending records are conflicts
      pendingConflicts.forEach((doc) => {
        const data = doc.data();
        console.log(`❌ Conflict found with pending player:`, {
          id: doc.id,
          name: data['jugador'] || data['name'],
          status: data['pendingStatus'],
        });
        conflictingDocs.push(doc.id);
      });
    }

    const hasPendingConflict = pendingConflicts.length > 0;

    console.log('🏁 Validation result:', {
      isUnique: !hasPendingConflict,
      conflictingDocs: conflictingDocs,
    });

    return !hasPendingConflict;
  }

  /**
   * Gets a pending player by ID
   */
  async getPendingPlayerById(
    pendingId: string
  ): Promise<IPendingPlayer | null> {
    const doc = await this.db.firestore
      .collection(this.collectionName)
      .doc(pendingId)
      .get();

    if (doc.exists) {
      const data = doc.data();
      const convertedData = this.convertTimestamps(data);

      // Ensure the document ID is preserved and not overwritten by data.id
      return {
        ...convertedData,
        id: doc.id, // Always use the actual document ID
      } as IPendingPlayer;
    }

    return null;
  }

  /**
   * Approves a pending player creation request
   * Moves player from pending to main collection atomically
   */
  async approvePendingCreation(
    pendingId: string,
    adminEmail: string
  ): Promise<void> {
    const batch = this.db.firestore.batch();

    try {
      // Get the pending player data
      const pendingRef = this.db.firestore
        .collection(this.collectionName)
        .doc(pendingId);
      const pendingDoc = await pendingRef.get();

      if (!pendingDoc.exists) {
        throw new Error('Solicitud pendiente no encontrada');
      }

      const pendingData = pendingDoc.data() as IPendingPlayer;

      if (pendingData.pendingStatus !== PendingStatus.PENDING_CREATION) {
        throw new Error('El estado de la solicitud no es válido para creación');
      }

      // Create player in main collection
      const playerRef = this.db.firestore.collection('Jugadores').doc();
      const playerData = { ...pendingData };

      // Remove pending-specific fields
      delete (playerData as any).pendingStatus;
      delete (playerData as any).originalPlayerId;
      delete (playerData as any).requestedBy;
      delete (playerData as any).requestedAt;
      delete (playerData as any).reviewedBy;
      delete (playerData as any).reviewedAt;
      delete (playerData as any).rejectedReason;

      // Ensure proper date conversion
      if (playerData.dateBirth) {
        // Handle both JavaScript Date objects and Firestore Timestamps
        let dateValue: Date | null = null;

        if (playerData.dateBirth instanceof Date) {
          dateValue = playerData.dateBirth;
        } else if (
          (playerData.dateBirth as any)?.toDate &&
          typeof (playerData.dateBirth as any).toDate === 'function'
        ) {
          // Firestore Timestamp
          dateValue = (playerData.dateBirth as any).toDate();
        } else if (
          typeof playerData.dateBirth === 'object' &&
          (playerData.dateBirth as any).seconds
        ) {
          // Manual Timestamp object conversion
          dateValue = new Date((playerData.dateBirth as any).seconds * 1000);
        }

        if (dateValue && !isNaN(dateValue.getTime())) {
          playerData.fechaNacimiento =
            this.convertJavascriptDateToExcel(dateValue);
        } else {
          console.warn(
            'Invalid dateBirth value, skipping conversion:',
            playerData.dateBirth
          );
        }
      }

      batch.set(playerRef, playerData);

      // Create badge entry without photo initially
      const badgeRef = this.db.firestore.collection('badges').doc(playerRef.id);
      const badgeData = {
        teamName: playerData.equipo,
        playerName: playerData.jugador,
        playerNumber: playerData.numero,
        playerId: playerRef.id,
        createdAt: new Date(),
        createdBy: adminEmail,
        // photoUrl: null, // No photo initially - will be added when photo is captured
      };
      batch.set(badgeRef, badgeData);

      // Delete pending record
      batch.delete(pendingRef);

      // Create audit log
      const auditRef = this.db.firestore.collection('audit_log').doc();
      const auditData = {
        action: 'approve_player_creation',
        entityType: 'player',
        entityId: playerRef.id,
        pendingId: pendingId,
        adminEmail: adminEmail,
        playerName: playerData.jugador,
        teamName: playerData.equipo,
        timestamp: new Date(),
        details: {
          originalRequest: {
            requestedBy: pendingData.requestedBy,
            requestedAt: pendingData.requestedAt,
          },
        },
      };
      batch.set(auditRef, auditData);

      // Commit transaction
      await batch.commit();
    } catch (error) {
      console.error('Error approving player creation:', error);
      throw new Error(`Error al aprobar la creación del jugador: ${error}`);
    }
  }

  /**
   * Approves a pending player update request
   * Updates player in main collection atomically
   */
  async approvePendingUpdate(
    pendingId: string,
    adminEmail: string
  ): Promise<void> {
    const batch = this.db.firestore.batch();

    try {
      // Get the pending player data
      const pendingRef = this.db.firestore
        .collection(this.collectionName)
        .doc(pendingId);
      const pendingDoc = await pendingRef.get();

      if (!pendingDoc.exists) {
        throw new Error('Solicitud pendiente no encontrada');
      }

      const pendingData = pendingDoc.data() as IPendingPlayer;

      if (pendingData.pendingStatus !== PendingStatus.PENDING_UPDATE) {
        throw new Error(
          'El estado de la solicitud no es válido para actualización'
        );
      }

      if (!pendingData.originalPlayerId) {
        throw new Error('ID del jugador original no encontrado');
      }

      // Update player in main collection
      const playerRef = this.db.firestore
        .collection('Jugadores')
        .doc(pendingData.originalPlayerId);
      const updateData = { ...pendingData };

      // Remove pending-specific fields
      delete (updateData as any).pendingStatus;
      delete (updateData as any).originalPlayerId;
      delete (updateData as any).requestedBy;
      delete (updateData as any).requestedAt;
      delete (updateData as any).reviewedBy;
      delete (updateData as any).reviewedAt;
      delete (updateData as any).rejectedReason;

      // Ensure proper date conversion
      if (updateData.dateBirth) {
        // Handle both JavaScript Date objects and Firestore Timestamps
        let dateValue: Date | null = null;

        if (updateData.dateBirth instanceof Date) {
          dateValue = updateData.dateBirth;
        } else if (
          (updateData.dateBirth as any)?.toDate &&
          typeof (updateData.dateBirth as any).toDate === 'function'
        ) {
          // Firestore Timestamp
          dateValue = (updateData.dateBirth as any).toDate();
        } else if (
          typeof updateData.dateBirth === 'object' &&
          (updateData.dateBirth as any).seconds
        ) {
          // Manual Timestamp object conversion
          dateValue = new Date((updateData.dateBirth as any).seconds * 1000);
        }

        if (dateValue && !isNaN(dateValue.getTime())) {
          updateData.fechaNacimiento =
            this.convertJavascriptDateToExcel(dateValue);
        } else {
          console.warn(
            'Invalid dateBirth value, skipping conversion:',
            updateData.dateBirth
          );
        }
      }

      batch.update(playerRef, updateData);

      // Update badge if it exists
      const badgeQuery = this.db.firestore
        .collection('badges')
        .where('playerId', '==', pendingData.originalPlayerId)
        .limit(1);

      const badgeSnapshot = await badgeQuery.get();
      if (!badgeSnapshot.empty) {
        const badgeDoc = badgeSnapshot.docs[0];
        const badgeRef = this.db.firestore
          .collection('badges')
          .doc(badgeDoc.id);
        const badgeUpdateData = {
          teamName: updateData.equipo,
          playerName: updateData.jugador,
          playerNumber: updateData.numero,
          updatedAt: new Date(),
          updatedBy: adminEmail,
        };
        batch.update(badgeRef, badgeUpdateData);
      }

      // Delete pending record
      batch.delete(pendingRef);

      // Create audit log
      const auditRef = this.db.firestore.collection('audit_log').doc();
      const auditData = {
        action: 'approve_player_update',
        entityType: 'player',
        entityId: pendingData.originalPlayerId,
        pendingId: pendingId,
        adminEmail: adminEmail,
        playerName: updateData.jugador,
        teamName: updateData.equipo,
        timestamp: new Date(),
        details: {
          originalRequest: {
            requestedBy: pendingData.requestedBy,
            requestedAt: pendingData.requestedAt,
          },
        },
      };
      batch.set(auditRef, auditData);

      // Commit transaction
      await batch.commit();
    } catch (error) {
      console.error('Error approving player update:', error);
      throw new Error(
        `Error al aprobar la actualización del jugador: ${error}`
      );
    }
  }

  /**
   * Approves a pending player deletion request
   * Marks player as INACTIVE in main collection atomically
   */
  async approvePendingDeletion(
    pendingId: string,
    adminEmail: string
  ): Promise<void> {
    const batch = this.db.firestore.batch();

    try {
      // Get the pending player data
      const pendingRef = this.db.firestore
        .collection(this.collectionName)
        .doc(pendingId);
      const pendingDoc = await pendingRef.get();

      if (!pendingDoc.exists) {
        throw new Error('Solicitud pendiente no encontrada');
      }

      const pendingData = pendingDoc.data() as IPendingPlayer;

      if (pendingData.pendingStatus !== PendingStatus.PENDING_DELETION) {
        throw new Error(
          'El estado de la solicitud no es válido para eliminación'
        );
      }

      if (!pendingData.originalPlayerId) {
        throw new Error('ID del jugador original no encontrado');
      }

      // Mark player as INACTIVE (logical deletion)
      const playerRef = this.db.firestore
        .collection('Jugadores')
        .doc(pendingData.originalPlayerId);
      batch.update(playerRef, {
        status: 'INACTIVO',
        deletedAt: new Date(),
        deletedBy: adminEmail,
      });

      // Delete badge if it exists
      const badgeQuery = this.db.firestore
        .collection('badges')
        .where('playerId', '==', pendingData.originalPlayerId)
        .limit(1);

      const badgeSnapshot = await badgeQuery.get();
      if (!badgeSnapshot.empty) {
        const badgeDoc = badgeSnapshot.docs[0];
        const badgeRef = this.db.firestore
          .collection('badges')
          .doc(badgeDoc.id);
        batch.delete(badgeRef);
      }

      // Delete pending record
      batch.delete(pendingRef);

      // Create audit log
      const auditRef = this.db.firestore.collection('audit_log').doc();
      const auditData = {
        action: 'approve_player_deletion',
        entityType: 'player',
        entityId: pendingData.originalPlayerId,
        pendingId: pendingId,
        adminEmail: adminEmail,
        playerName: pendingData.jugador,
        teamName: pendingData.equipo,
        timestamp: new Date(),
        details: {
          originalRequest: {
            requestedBy: pendingData.requestedBy,
            requestedAt: pendingData.requestedAt,
          },
        },
      };
      batch.set(auditRef, auditData);

      // Commit transaction
      await batch.commit();
    } catch (error) {
      console.error('Error approving player deletion:', error);
      throw new Error(`Error al aprobar la eliminación del jugador: ${error}`);
    }
  }

  /**
   * Converts JavaScript Date to Excel numeric format for compatibility
   */
  private convertJavascriptDateToExcel(date: Date): number {
    // Excel date serial number calculation
    // Excel epoch is January 1, 1900, but JavaScript is January 1, 1970
    const jsEpoch = new Date('1970-01-01T00:00:00Z');
    const excelEpoch = new Date('1900-01-01T00:00:00Z');
    const daysBetweenEpochs =
      (jsEpoch.getTime() - excelEpoch.getTime()) / (1000 * 60 * 60 * 24);
    const daysFromJsEpoch =
      (date.getTime() - jsEpoch.getTime()) / (1000 * 60 * 60 * 24);

    // Excel has a bug where it considers 1900 a leap year, so we add 1
    return Math.floor(daysBetweenEpochs + daysFromJsEpoch) + 2;
  }
}
