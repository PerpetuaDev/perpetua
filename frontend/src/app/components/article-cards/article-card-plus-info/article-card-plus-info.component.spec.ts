import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCardPlusInfoComponent } from './article-card-plus-info.component';

describe('ArticleCardPlusInfoComponent', () => {
  let component: ArticleCardPlusInfoComponent;
  let fixture: ComponentFixture<ArticleCardPlusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCardPlusInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleCardPlusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
