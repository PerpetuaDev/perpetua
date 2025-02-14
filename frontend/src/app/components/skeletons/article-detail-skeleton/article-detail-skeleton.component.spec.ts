import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailSkeletonComponent } from './article-detail-skeleton.component';

describe('ArticleDetailSkeletonComponent', () => {
  let component: ArticleDetailSkeletonComponent;
  let fixture: ComponentFixture<ArticleDetailSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetailSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleDetailSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
