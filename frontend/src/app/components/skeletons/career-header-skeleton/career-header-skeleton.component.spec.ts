import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerHeaderSkeletonComponent } from './career-header-skeleton.component';

describe('CareerHeaderSkeletonComponent', () => {
  let component: CareerHeaderSkeletonComponent;
  let fixture: ComponentFixture<CareerHeaderSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerHeaderSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerHeaderSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
