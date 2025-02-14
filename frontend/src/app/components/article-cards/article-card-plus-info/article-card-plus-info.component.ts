// Libraries
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { IArticle } from '../../../../util/interfaces';
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-article-card-plus-info',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './article-card-plus-info.component.html',
  styleUrl: './article-card-plus-info.component.scss'
})
export class ArticleCardPlusInfoComponent implements OnInit, OnDestroy {
  @Input() visibleArticles: IArticle[] = [];
  truncatedText: string = '';
  currentLanguage: string = 'en';

  constructor(private router: Router, private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.visibleArticles.forEach((article: IArticle) => {
      if (article.content) {
        const words = article.content.split(' ');
        const truncatedWords = words.slice(0, 27).join(' ');
        this.truncatedText = truncatedWords; // + ' ...'
      }
    })
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  backToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
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