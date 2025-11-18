import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError, Observable } from 'rxjs';
import { captainGuard } from './captain.guard';
import { PlayerService } from '@app-core/services/player.service';
import { AccountService } from '@app-core/services/account.service';
import { RouteService } from '@app-core/services/route.service';
import { IPlayer } from '@app-core/models/player';

describe('captainGuard', () => {
  let mockPlayerService: jasmine.SpyObj<PlayerService>;
  let mockAccountService: jasmine.SpyObj<AccountService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRouteService: jasmine.SpyObj<RouteService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => captainGuard(...guardParameters));

  beforeEach(() => {
    const playerServiceSpy = jasmine.createSpyObj('PlayerService', [
      'getPlayerByEmail',
    ]);
    const accountServiceSpy = jasmine.createSpyObj('AccountService', [], {
      currentUser$: of(null),
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const routeServiceSpy = jasmine.createSpyObj('RouteService', [
      'findZoneRouteParam',
    ]);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        { provide: PlayerService, useValue: playerServiceSpy },
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: RouteService, useValue: routeServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    mockPlayerService = TestBed.inject(
      PlayerService
    ) as jasmine.SpyObj<PlayerService>;
    mockAccountService = TestBed.inject(
      AccountService
    ) as jasmine.SpyObj<AccountService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockRouteService = TestBed.inject(
      RouteService
    ) as jasmine.SpyObj<RouteService>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    mockRoute = new ActivatedRouteSnapshot();
    mockState = { url: '/test-url' } as RouterStateSnapshot;
    mockRouteService.findZoneRouteParam.and.returnValue('test-zone');
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to login when user is not authenticated', (done) => {
    // Arrange
    Object.defineProperty(mockAccountService, 'currentUser$', {
      value: of(null),
    });

    // Act
    const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

    // Assert
    result.subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-zone/login'], {
        queryParams: { redirectTo: '/test-url' },
      });
      done();
    });
  });

  it('should deny access when user has no email', (done) => {
    // Arrange
    Object.defineProperty(mockAccountService, 'currentUser$', {
      value: of({ email: null }),
    });

    // Act
    const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

    // Assert
    result.subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-zone/login'], {
        queryParams: { redirectTo: '/test-url' },
      });
      done();
    });
  });

  it('should deny access when no player is associated with user email', (done) => {
    // Arrange
    Object.defineProperty(mockAccountService, 'currentUser$', {
      value: of({ email: 'test@example.com' }),
    });
    mockPlayerService.getPlayerByEmail.and.returnValue(Promise.resolve(null));

    // Act
    const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

    // Assert
    result.subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'No tienes un jugador asociado. Contacta al administrador.',
        'Cerrar',
        { duration: 5000 }
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-zone']);
      done();
    });
  });

  it('should deny access when player is not a captain', (done) => {
    // Arrange
    const mockPlayer: IPlayer = {
      jugador: 'Test Player',
      equipo: 'Test Team',
      name: 'Test Player',
      numero: '10',
      capitan: false, // Not a captain
      dateBirth: null,
      noAlinea: false,
      correo: 'test@example.com',
    };

    Object.defineProperty(mockAccountService, 'currentUser$', {
      value: of({ email: 'test@example.com' }),
    });
    mockPlayerService.getPlayerByEmail.and.returnValue(
      Promise.resolve(mockPlayer)
    );

    // Act
    const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

    // Assert
    result.subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'No tienes permisos de capitán para gestionar el equipo.',
        'Cerrar',
        { duration: 5000 }
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-zone']);
      done();
    });
  });

  it('should allow access when player is a captain (boolean true)', (done) => {
    // Arrange
    const mockPlayer: IPlayer = {
      jugador: 'Test Captain',
      equipo: 'Test Team',
      name: 'Test Captain',
      numero: '10',
      capitan: true, // Is a captain (boolean)
      dateBirth: null,
      noAlinea: false,
      correo: 'captain@example.com',
    };

    Object.defineProperty(mockAccountService, 'currentUser$', {
      value: of({ email: 'captain@example.com' }),
    });
    mockPlayerService.getPlayerByEmail.and.returnValue(
      Promise.resolve(mockPlayer)
    );

    // Act
    const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

    // Assert
    result.subscribe((canActivate) => {
      expect(canActivate).toBe(true);
      expect(mockSnackBar.open).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should allow access when player is a captain (number 1)', (done) => {
    // Arrange
    const mockPlayer: IPlayer = {
      jugador: 'Test Captain',
      equipo: 'Test Team',
      name: 'Test Captain',
      numero: '10',
      capitan: 1, // Is a captain (number)
      dateBirth: null,
      noAlinea: false,
      correo: 'captain@example.com',
    };

    Object.defineProperty(mockAccountService, 'currentUser$', {
      value: of({ email: 'captain@example.com' }),
    });
    mockPlayerService.getPlayerByEmail.and.returnValue(
      Promise.resolve(mockPlayer)
    );

    // Act
    const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

    // Assert
    result.subscribe((canActivate) => {
      expect(canActivate).toBe(true);
      expect(mockSnackBar.open).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should handle errors gracefully', (done) => {
    // Arrange
    Object.defineProperty(mockAccountService, 'currentUser$', {
      value: of({ email: 'test@example.com' }),
    });
    mockPlayerService.getPlayerByEmail.and.returnValue(
      Promise.reject(new Error('Database error'))
    );

    // Act
    const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

    // Assert
    result.subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Error al validar permisos. Intenta nuevamente.',
        'Cerrar',
        { duration: 5000 }
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-zone']);
      done();
    });
  });
});
