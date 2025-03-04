// Libraries
import { Component, Input, inject, OnChanges, SimpleChanges, HostListener, ElementRef, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { marked } from 'marked';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NgZone } from '@angular/core';
// Components
import { ShareArticleButtonComponent } from '../../../../../components/buttons/share-article-button/share-article-button.component';
// Services
import { ArticleService } from '../../../../../shared/article.service';
import { IArticle } from '../../../../../../util/interfaces';
import { TranslationHelper } from '../../../../../shared/translation-helper';

@Component({
  selector: 'app-article-content',
  standalone: true,
  imports: [CommonModule, ShareArticleButtonComponent, TranslateModule],
  templateUrl: './article-content.component.html',
  styleUrl: './article-content.component.scss'
})
export class ArticleContentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() article: IArticle | undefined;
  @Input() currentArticleDocumentId: string | null = null;
  moreArticles$: Observable<IArticle[]>;
  sanitizedContent: SafeHtml | undefined;
  restOfContent: SafeHtml | undefined;
  firstLetter: string = '';
  articleService: ArticleService = inject(ArticleService);
  currentLanguage: string = 'en';

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private translationHelper: TranslationHelper,
    private zone: NgZone
  ) {
    this.moreArticles$ = this.articleService.moreArticles$;
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.onWindowScroll();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    this.translationHelper.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['article'] && this.article?.content) {
      this.parseContent();
    }

    if (changes['currentArticleDocumentId'] && changes['currentArticleDocumentId'].currentValue) {
      this.articleService.selectMoreArticleByDate(changes['currentArticleDocumentId'].currentValue);
    }
  }

  async parseContent(): Promise<void> {
    if (!this.article?.content) {
      return;
    }

    try {
      const parsedContent = await marked.parse(this.article.content);
      const tempElement = document.createElement('div');
      tempElement.innerHTML = parsedContent;

      const textContent = tempElement.textContent || '';
      if (textContent.length > 0) {
        this.firstLetter = textContent.charAt(0).toUpperCase();

        let styledContent = tempElement.innerHTML.replace(
          /<img\s+([^>]*?)>/g,
          '<img style="width: 100%; height: auto; max-width: 100%;" $1>'
        );
        const words = styledContent.split(/\s+/);
        for (let i = words.length - 1; i >= 0; i--) {
          if (words[i].includes('</p>')) {
            words[i] = words[i].replace('</p>', '*</p>');
            break;
          }
        }
        styledContent = words.join(' ');

        const firstTwoWords = words.slice(0, 2).map(word => word.toUpperCase()).join(' ');
        const remainingText = words.slice(2).join(' ');

        styledContent = styledContent.replace(textContent, remainingText);

        const finalContent = `${firstTwoWords} ${remainingText}`.substring(4);

        this.restOfContent = this.sanitizer.bypassSecurityTrustHtml(finalContent);
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error parsing content:', error);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const contentLeftElement = this.elRef.nativeElement.querySelector('.content-left') as HTMLElement;
    const moreArticlesElement = this.elRef.nativeElement.querySelector('.related-articles-container') as HTMLElement;

    if (!contentLeftElement || !moreArticlesElement) {
      console.warn("Elements not found!");
      return;
    }

    const scrollPosition = window.scrollY;
    console.log("🔍 Corrected Scroll position:", scrollPosition);

    const contentLeftRect = contentLeftElement.getBoundingClientRect();
    const moreArticlesRect = moreArticlesElement.getBoundingClientRect();

    console.log("🔍 contentLeftRect:", contentLeftRect);
    console.log("🔍 moreArticlesRect:", moreArticlesRect);

    const maxTranslateY = contentLeftRect.height - moreArticlesRect.height;

    if (scrollPosition > 550) {
      let parallaxValue = (scrollPosition - 550) * 1.0;
      console.log("🔍 Current parallaxValue:", parallaxValue);

      parallaxValue = Math.min(parallaxValue, maxTranslateY);

      moreArticlesElement.style.transform = `translateY(${parallaxValue}px)`;
    } else {
      moreArticlesElement.style.transform = `translateY(0)`;
    }
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
