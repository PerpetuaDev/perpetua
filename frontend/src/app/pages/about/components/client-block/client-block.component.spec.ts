import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBlockComponent } from './client-block.component';

describe('ClientBlockComponent', () => {
  let component: ClientBlockComponent;
  let fixture: ComponentFixture<ClientBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
