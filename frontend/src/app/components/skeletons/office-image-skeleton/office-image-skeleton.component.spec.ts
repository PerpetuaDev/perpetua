import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeImageSkeletonComponent } from './office-image-skeleton.component';

describe('OfficeImageSkeletonComponent', () => {
  let component: OfficeImageSkeletonComponent;
  let fixture: ComponentFixture<OfficeImageSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficeImageSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeImageSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
