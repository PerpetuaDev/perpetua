import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesSkeletonComponent } from './slides-skeleton.component';

describe('SlidesSkeletonComponent', () => {
  let component: SlidesSkeletonComponent;
  let fixture: ComponentFixture<SlidesSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidesSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidesSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
