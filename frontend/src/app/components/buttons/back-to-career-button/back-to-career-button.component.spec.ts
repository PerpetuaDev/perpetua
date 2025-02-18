import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackToCareerButtonComponent } from './back-to-career-button.component';

describe('BackToCareerButtonComponent', () => {
  let component: BackToCareerButtonComponent;
  let fixture: ComponentFixture<BackToCareerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackToCareerButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackToCareerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
