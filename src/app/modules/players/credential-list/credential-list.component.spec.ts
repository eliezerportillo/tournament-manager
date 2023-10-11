import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialListComponent } from './credential-list.component';

describe('CredentialListComponent', () => {
  let component: CredentialListComponent;
  let fixture: ComponentFixture<CredentialListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CredentialListComponent]
    });
    fixture = TestBed.createComponent(CredentialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
