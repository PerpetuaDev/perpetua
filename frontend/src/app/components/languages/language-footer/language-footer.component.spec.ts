import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageFooterComponent } from './language-footer.component';

describe('LanguageFooterComponent', () => {
  let component: LanguageFooterComponent;
  let fixture: ComponentFixture<LanguageFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
