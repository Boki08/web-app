import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOfficesVehiclesComponent } from './admin-offices-vehicles.component';

describe('AdminOfficesVehiclesComponent', () => {
  let component: AdminOfficesVehiclesComponent;
  let fixture: ComponentFixture<AdminOfficesVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOfficesVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOfficesVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
