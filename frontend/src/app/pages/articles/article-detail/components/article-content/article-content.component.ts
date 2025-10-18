// Libraries
import { Component, Input, inject, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy, AfterViewInit, ElementRef, HostListener, Renderer2, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { marked } from 'marked';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
// Components
import { ShareArticleButtonComponent } from '../../../../../components/buttons/share-article-button/share-article-button.component';
// Services
import { ArticleService } from '../../../../../shared/article.service';
import { IArticle } from '../../../../../../util/interfaces';
import { TranslationHelper } from '../../../../../shared/translation-helper';

@Component({
  selector: 'app-article-content',
  standalone: true,
  imports: [CommonModule, ShareArticleButtonComponent, TranslateModule, MarkdownModule],
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
  // restOfContent: string = '';
  firstLetter: string = '';
  markdownService = inject(MarkdownService);
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

  private readonly mql = window.matchMedia('(max-width: 768px)');
  private currentMode: 'mobile' | 'desktop' | null = null;

  private scrollHandlerDesktop = () => this.handleParallax();           // existing desktop logic
  private scrollHandlerMobile = () => this.handleParallaxForMobile();

  ngOnInit(): void {
    this.setupParallax();
    this.attachParallaxMode(this.mql.matches ? 'mobile' : 'desktop');
    this.mql.addEventListener?.('change', this.onMediaChange);
    this.mql.addListener?.(this.onMediaChange);
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
    this.detachParallaxListeners();
    this.mql.removeEventListener?.('change', this.onMediaChange);
    this.mql.removeListener?.(this.onMediaChange);
    this.translationHelper.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['article'] && this.article?.content) {
      this.parseContent();
    }
  }

  private onMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
    const isMobile = ('matches' in e) ? e.matches : (e as MediaQueryList).matches;
    this.attachParallaxMode(isMobile ? 'mobile' : 'desktop');
  };

  async parseContent(): Promise<void> {
    if (!this.article?.content) return;

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

        styledContent = styledContent.replace(
          /\*\*(\s*[^*]+?)\*\*/g,
          '<strong>$1</strong>'
        );

        styledContent = styledContent.replace(
          /\~\~(\s*[^*]+?)\~\~/g,
          '<del>$1</del>'
        );

        styledContent = styledContent.replace(
          /\_(\s*[^*]+?)\_/g,
          '<em>$1</em>'
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
        // this.restOfContent = finalContent;
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

  private attachParallaxMode(mode: 'mobile' | 'desktop') {
    if (this.currentMode === mode) return;

    // Remove any previous listeners and reset inline styles
    this.detachParallaxListeners();
    this.resetRelatedStyles();

    if (mode === 'desktop') {
      window.addEventListener('scroll', this.scrollHandlerDesktop, { passive: true });
      // Kick once to place it correctly
      this.handleParallax();
    } else {
      window.addEventListener('scroll', this.scrollHandlerMobile, { passive: true });
      this.handleParallaxForMobile();
    }

    this.currentMode = mode;
  }

  private detachParallaxListeners() {
    window.removeEventListener('scroll', this.scrollHandlerDesktop);
    window.removeEventListener('scroll', this.scrollHandlerMobile);
  }

  private resetRelatedStyles() {
    const related = document.querySelector('.related-articles-container') as HTMLElement | null;
    if (!related) return;
    related.style.position = 'relative';
    related.style.top = 'auto';
    related.style.marginTop = '0';
    related.style.paddingTop = '10px';
    related.style.width = 'auto';
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
      relatedArticlesContainer.style.paddingTop = '10px';
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

  handleParallaxForMobile(): void {
    const contentLeft = document.querySelector('.content-left') as HTMLElement;
    const relatedArticlesContainer = document.querySelector('.related-articles-container') as HTMLElement;
    const contentRight = document.querySelector('.content-right') as HTMLElement;

    if (!contentLeft || !relatedArticlesContainer || !contentRight) return;

    const scrollY = window.scrollY;
    const contentLeftRect = contentLeft.getBoundingClientRect();
    const relatedArticlesRect = relatedArticlesContainer.getBoundingClientRect();

    const stickyOffset = 315; // Scroll position where sticky behavior starts
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
      relatedArticlesContainer.style.paddingTop = '10px';
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