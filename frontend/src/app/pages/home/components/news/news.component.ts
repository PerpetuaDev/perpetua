// Libraries
import { Component, OnDestroy, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
// Components
import { ArticleCardComponent } from '../../../../components/article-cards/article-card/article-card.component';
import { ArticleAndProjectCardSkeletonComponent } from '../../../../components/skeletons/article-and-project-card-skeleton/article-and-project-card-skeleton.component';
// Services
import { IArticle } from '../../../../../util/interfaces';
import { ArticleService } from '../../../../shared/article.service';
import { TranslationHelper } from '../../../../shared/translation-helper';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink, ArticleCardComponent, TranslateModule, ArticleAndProjectCardSkeletonComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})

export class NewsComponent implements OnDestroy {
  articles$: Observable<IArticle[]>;
  selectedFilter$: Observable<string | null>;
  articleService = inject(ArticleService);
  isLoading$!: Observable<boolean | null>;
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper) {
    this.articles$ = this.articleService.filteredArticles$;
    this.selectedFilter$ = this.articleService.selectedFilter$;
    this.isLoading$ = this.articleService.isLoading$;
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  sortArticles(type: string): void {
    this.articleService.sortArticles(type);
  }
}
