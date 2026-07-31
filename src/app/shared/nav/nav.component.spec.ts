import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app-core/services/account.service';
import { RouteService } from '@app-core/services/route.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import firebase from 'firebase/compat/app';

import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let currentUserSubject: BehaviorSubject<firebase.User | null>;
  let authMock: jasmine.SpyObj<AngularFireAuth>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeServiceMock: jasmine.SpyObj<RouteService>;

  const accountServiceMock = {
    companyName: 'AFC',
    get currentUser$() {
      return currentUserSubject.asObservable();
    },
  };

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject<firebase.User | null>(null);
    authMock = jasmine.createSpyObj<AngularFireAuth>('AngularFireAuth', [
      'signOut',
    ]);
    authMock.signOut.and.returnValue(Promise.resolve());

    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);
    routerMock.navigate.and.returnValue(Promise.resolve(true));

    routeServiceMock = jasmine.createSpyObj<RouteService>('RouteService', [
      'findZoneRouteParam',
    ]);
    routeServiceMock.findZoneRouteParam.and.returnValue('zona-norte');

    TestBed.configureTestingModule({
      declarations: [NavComponent],
      providers: [
        { provide: AccountService, useValue: accountServiceMock },
        { provide: AngularFireAuth, useValue: authMock },
        { provide: Router, useValue: routerMock },
        { provide: RouteService, useValue: routeServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use user displayName as menu label when authenticated', async () => {
    currentUserSubject.next({ displayName: 'Carlos Perez' } as firebase.User);

    const label = await firstValueFrom(component.menuLabel$);

    expect(label).toBe('Carlos Perez');
  });

  it('should keep "Menú" as menu label when there is no session', async () => {
    currentUserSubject.next(null);

    const label = await firstValueFrom(component.menuLabel$);

    expect(label).toBe('Menú');
  });

  it('should keep "Menú" as menu label when displayName is empty', async () => {
    currentUserSubject.next({ displayName: '   ' } as firebase.User);

    const label = await firstValueFrom(component.menuLabel$);

    expect(label).toBe('Menú');
  });

  it('should logout and navigate to zone root when zone exists', async () => {
    await component.logout();

    expect(authMock.signOut).toHaveBeenCalled();
    expect(routeServiceMock.findZoneRouteParam).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/zona-norte']);
  });

  it('should logout and navigate to / when zone is missing', async () => {
    routeServiceMock.findZoneRouteParam.and.returnValue('');

    await component.logout();

    expect(authMock.signOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
