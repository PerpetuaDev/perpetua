import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsTestimonialComponent } from './clients-testimonial.component';

describe('ClientsTestimonialComponent', () => {
  let component: ClientsTestimonialComponent;
  let fixture: ComponentFixture<ClientsTestimonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsTestimonialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsTestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
