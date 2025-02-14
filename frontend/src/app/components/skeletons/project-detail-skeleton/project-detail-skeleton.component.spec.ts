import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailSkeletonComponent } from './project-detail-skeleton.component';

describe('ProjectDetailSkeletonComponent', () => {
  let component: ProjectDetailSkeletonComponent;
  let fixture: ComponentFixture<ProjectDetailSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
