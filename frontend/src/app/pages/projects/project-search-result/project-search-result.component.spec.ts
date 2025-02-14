import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSearchResultComponent } from './project-search-result.component';

describe('ProjectSearchResultComponent', () => {
  let component: ProjectSearchResultComponent;
  let fixture: ComponentFixture<ProjectSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSearchResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
