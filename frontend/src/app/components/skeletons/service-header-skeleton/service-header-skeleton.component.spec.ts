import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceHeaderSkeletonComponent } from './service-header-skeleton.component';

describe('ServiceHeaderSkeletonComponent', () => {
  let component: ServiceHeaderSkeletonComponent;
  let fixture: ComponentFixture<ServiceHeaderSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceHeaderSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceHeaderSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
