import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartProjectButtonComponent } from './start-project-button.component';

describe('StartProjectButtonComponent', () => {
  let component: StartProjectButtonComponent;
  let fixture: ComponentFixture<StartProjectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartProjectButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartProjectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
