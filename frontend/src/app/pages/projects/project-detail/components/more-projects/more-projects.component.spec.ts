import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreProjectsComponent } from './more-projects.component';

describe('MoreProjectsComponent', () => {
  let component: MoreProjectsComponent;
  let fixture: ComponentFixture<MoreProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
