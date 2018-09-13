import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToasterServiceComponent } from './toaster-service.component';

describe('ToasterServiceComponent', () => {
  let component: ToasterServiceComponent;
  let fixture: ComponentFixture<ToasterServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToasterServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToasterServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
