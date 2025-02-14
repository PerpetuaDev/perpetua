import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleAndProjectCardSkeletonComponent } from './article-and-project-card-skeleton.component';

describe('ArticleAndProjectCardSkeletonComponent', () => {
  let component: ArticleAndProjectCardSkeletonComponent;
  let fixture: ComponentFixture<ArticleAndProjectCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleAndProjectCardSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleAndProjectCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
