import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOfficesVehiclesComponent } from './manage-offices-vehicles.component';

describe('ManageOfficesVehiclesComponent', () => {
  let component: ManageOfficesVehiclesComponent;
  let fixture: ComponentFixture<ManageOfficesVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageOfficesVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOfficesVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
