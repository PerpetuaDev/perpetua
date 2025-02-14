// Libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
// Components
import { ArticleCardPlusInfoComponent } from '../../components/article-cards/article-card-plus-info/article-card-plus-info.component';
import { BackToTopButtonComponent } from '../../components/buttons/back-to-top-button/back-to-top-button.component';
import { ArticleDetailSkeletonComponent } from '../../components/skeletons/article-detail-skeleton/article-detail-skeleton.component';
// Service
import { IArticle } from '../../../util/interfaces';
import { ArticleService } from '../../shared/article.service';
import { TranslationHelper } from '../../shared/translation-helper';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ArticleCardPlusInfoComponent,
    BackToTopButtonComponent,
    ArticleDetailSkeletonComponent
  ],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit, OnDestroy {
  articles$: Observable<IArticle[]>;
  selectedFilter$: Observable<string | null>;
  isLoading$!: Observable<boolean | null>;
  articleService = inject(ArticleService);
  currentLanguage: string = 'en';

  // Lazy loading
  visibleArticles: IArticle[] = [];
  private allArticles: IArticle[] = [];
  articlesToLoad: number = 12;
  loadMoreButtonVisible: boolean = false;

  constructor(private titleService: Title, private metaService: Meta, private translationHelper: TranslationHelper) {
    this.articles$ = this.articleService.filteredArticles$;
    this.selectedFilter$ = this.articleService.selectedFilter$;
    this.isLoading$ = this.articleService.isLoading$;
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Articles - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Browse our news/blogs to read more about the amazing things we have done at Perpetua.' });

    this.selectedFilter$.subscribe((filter) => {
      if (filter) {
        const upperCaseFilter = filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase(); // capitalise only the first letter
        this.titleService.setTitle(`${upperCaseFilter} in Articles - Perpetua`);
        this.metaService.updateTag({ name: 'description', content: `Browse ${filter} articles by Perpetua` });
      } else {
        this.titleService.setTitle('All articles - Perpetua');
        this.metaService.updateTag({ name: 'description', content: 'Browse all articles by Perpetua' });
      }
    });

    this.articles$.subscribe((articles) => {
      this.allArticles = articles;
      this.initializeVisibleArticles();
    });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  initializeVisibleArticles(): void {
    this.visibleArticles = this.allArticles.slice(0, this.articlesToLoad);
    this.loadMoreButtonVisible = this.visibleArticles.length < this.allArticles.length;
  }

  loadMoreArticles(): void {
    const newArticles = this.allArticles.slice(this.visibleArticles.length, this.visibleArticles.length + this.articlesToLoad);
    this.visibleArticles = [...this.visibleArticles, ...newArticles];
    this.loadMoreButtonVisible = this.visibleArticles.length < this.allArticles.length;
  }

  sortProjects(type: string): void {
    this.articleService.sortArticles(type);
  }
}
