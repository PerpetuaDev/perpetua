// Libraries
import { Component, Input, inject, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy, AfterViewInit, ElementRef, HostListener, Renderer2, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { marked } from 'marked';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
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
  private contentLeftElement: HTMLElement | null = null;
  private relatedArticlesContainer: HTMLElement | null = null;
  moreArticles$: Observable<IArticle[]>;
  sanitizedContent: SafeHtml | undefined;
  restOfContent: SafeHtml | undefined;
  firstLetter: string = '';
  articleService: ArticleService = inject(ArticleService);
  currentLanguage: string = 'en';

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translationHelper: TranslationHelper,
    private elementRef: ElementRef
  ) {
    this.moreArticles$ = this.articleService.moreArticles$;
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.setupParallax();
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['article'] && this.article?.content) {
      this.parseContent();
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

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.handleParallax();
  }

  setupParallax(): void {
    window.addEventListener('scroll', this.handleParallax.bind(this));
  }

  handleParallax(): void {
    const contentLeft = document.querySelector('.content-left') as HTMLElement;
    const relatedArticlesContainer = document.querySelector('.related-articles-container') as HTMLElement;
    const contentRight = document.querySelector('.content-right') as HTMLElement;

    if (!contentLeft || !relatedArticlesContainer || !contentRight) return;

    const scrollY = window.scrollY;
    const contentLeftRect = contentLeft.getBoundingClientRect();
    const relatedArticlesRect = relatedArticlesContainer.getBoundingClientRect();

    const stickyOffset = 735; // Scroll position where sticky behavior starts
    const contentLeftHeight = contentLeft.offsetHeight; // Total height of .content-left
    const relatedArticlesHeight = relatedArticlesContainer.offsetHeight; // Height of .related-articles-container

    // Extra scrolling required before making the container unsticky
    const extraScrollThreshold = contentLeftHeight - relatedArticlesHeight;

    if (extraScrollThreshold <= 0) return; // Prevents issues if the related articles container is larger than content-left

    const stopStickyScrollY = stickyOffset + extraScrollThreshold;

    // Reset styles when scrolling back to the top
    if (scrollY < stickyOffset) {
      relatedArticlesContainer.style.position = 'relative';
      relatedArticlesContainer.style.top = 'auto';
      relatedArticlesContainer.style.marginTop = '0';
      relatedArticlesContainer.style.width = 'auto';
      return;
    }

    // Keep it sticky until reaching the additional scroll threshold
    if (scrollY >= stickyOffset && scrollY < stopStickyScrollY) {
      relatedArticlesContainer.style.position = 'fixed';
      relatedArticlesContainer.style.top = '0';
      relatedArticlesContainer.style.marginTop = '46px';
      relatedArticlesContainer.style.width = `${contentLeft.offsetWidth}px`;
      return;
    }

    // After exceeding the threshold, return it to normal scrolling behavior
    if (scrollY >= stopStickyScrollY) {
      relatedArticlesContainer.style.position = 'relative';
      relatedArticlesContainer.style.top = 'auto';
      relatedArticlesContainer.style.marginTop = `${extraScrollThreshold}px`;
      relatedArticlesContainer.style.width = 'auto';
    }
  }
}