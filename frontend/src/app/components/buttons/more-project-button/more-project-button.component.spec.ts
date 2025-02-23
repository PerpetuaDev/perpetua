import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreProjectButtonComponent } from './more-project-button.component';

describe('MoreProjectButtonComponent', () => {
  let component: MoreProjectButtonComponent;
  let fixture: ComponentFixture<MoreProjectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreProjectButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreProjectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
