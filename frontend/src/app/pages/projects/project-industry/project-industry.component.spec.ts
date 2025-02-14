import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIndustryComponent } from './project-industry.component';

describe('ProjectIndustryComponent', () => {
  let component: ProjectIndustryComponent;
  let fixture: ComponentFixture<ProjectIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectIndustryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
