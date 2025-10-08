// Libraries
import { Component, inject, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
// Components
// Services
import { ArticleService } from '../../../../../shared/article.service';
import { IArticle } from '../../../../../../util/interfaces';
import { TranslationHelper } from '../../../../../shared/translation-helper';

@Component({
  selector: 'app-more-articles',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './more-articles.component.html',
  styleUrl: './more-articles.component.scss'
})
export class MoreArticlesComponent implements OnChanges, OnDestroy {
  @Input() currentArticleDocumentId: string | null = null;
  moreArticles$: Observable<IArticle[]>;
  articleService: ArticleService = inject(ArticleService);
  currentLanguage: string = 'en';
  visibleArticles: IArticle[] = [];
  truncatedText: string = '';

  constructor(
    private router: Router,
    private translationHelper: TranslationHelper
  ) {
    this.moreArticles$ = this.articleService.moreArticles$.pipe(
      map(articles => articles.slice(0, 6))
    );

    this.moreArticles$.subscribe((articles: IArticle[]) => {
      this.visibleArticles = articles;
      this.truncateText();
    });

    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentArticleDocumentId'] && changes['currentArticleDocumentId'].currentValue) {
      this.articleService.selectMoreArticleByDate(changes['currentArticleDocumentId'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  truncateText(): void {
    this.visibleArticles.forEach((article: IArticle) => {
      if (article.content) {
        const words = article.content.split(' ');
        const truncatedWords = words.slice(0, 27).join(' ');
        this.truncatedText = truncatedWords; // + ' ...'
      }
    })
  }

  scrollToTop(): void {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backToTop(): void {
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });
  }

  navigateToArticle(documentId: string): void {
    this.backToTop();
    this.router.navigate(['/articles', documentId]);
  }

  handleKeydown(event: KeyboardEvent, documentId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToArticle(documentId);
    }
  }
}
