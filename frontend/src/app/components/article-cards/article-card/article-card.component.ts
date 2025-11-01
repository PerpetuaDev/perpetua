// Libraries
import { Component, Input, ElementRef, ViewChildren, QueryList, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { IArticle } from '../../../../util/interfaces';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss'
})
export class ArticleCardComponent implements OnInit {
  @Input() articles: IArticle[] = [];
  @Input() isLoading: boolean = false;
  @ViewChildren('titleWrapper') titleWrappers!: QueryList<ElementRef>;
  truncatedText: string = '';
  truncatedTexts: { [key: string]: string } = {};
  currentLanguage: string = 'en';
  hoveredArticleId: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.articles.length > 0) {
      this.isLoading = false;
    }

    this.articles.forEach((article: IArticle) => {
      if (article.sub_heading) {
        const words = article.sub_heading.split(' ');
        const truncatedWords = words.slice(0, 20).join(' ');
        this.truncatedText = truncatedWords; // + ' ...'
        this.truncatedTexts[article.documentId] = this.truncatedText;
      }
    })
  }

  scrollToTop(): void {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToArticle(documentId: string): void {
    this.scrollToTop();
    this.router.navigate(['/articles', documentId]);
  }

  onKeyDown(event: KeyboardEvent, documentId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToArticle(documentId);
    }
  }

  onImageLoad(): void {
    this.isLoading = false;
  }

  onMouseEnterTitle(documentId: string): void {
    this.hoveredArticleId = documentId;
  }

  onMouseLeaveTitle(): void {
    this.hoveredArticleId = null;
  }

  isHovered(documentId: string): boolean {
    return this.hoveredArticleId === documentId;
  }
}
