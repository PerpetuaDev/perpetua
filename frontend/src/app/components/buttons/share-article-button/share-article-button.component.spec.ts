import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareArticleButtonComponent } from './share-article-button.component';

describe('ShareArticleButtonComponent', () => {
  let component: ShareArticleButtonComponent;
  let fixture: ComponentFixture<ShareArticleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareArticleButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareArticleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
