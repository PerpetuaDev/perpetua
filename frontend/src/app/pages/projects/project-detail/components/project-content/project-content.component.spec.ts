import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContentComponent } from './project-content.component';

describe('ProjectContentComponent', () => {
  let component: ProjectContentComponent;
  let fixture: ComponentFixture<ProjectContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
