import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCardPlusInfoComponent } from './project-card-plus-info.component';

describe('ProjectCardPlusInfoComponent', () => {
  let component: ProjectCardPlusInfoComponent;
  let fixture: ComponentFixture<ProjectCardPlusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardPlusInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCardPlusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
