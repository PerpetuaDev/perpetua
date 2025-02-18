import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBlockAboutComponent } from './client-block-about.component';

describe('ClientBlockAboutComponent', () => {
  let component: ClientBlockAboutComponent;
  let fixture: ComponentFixture<ClientBlockAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientBlockAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientBlockAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
