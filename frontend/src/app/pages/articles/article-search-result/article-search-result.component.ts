// Libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
// Components
import { BackToTopButtonComponent } from '../../../components/buttons/back-to-top-button/back-to-top-button.component';
import { CallActionComponent } from '../../../components/call-action/call-action.component';
// Services
import { ArticleService } from '../../../shared/article.service';
import { IArticle } from '../../../../util/interfaces';

@Component({
  selector: 'app-article-search-result',
  standalone: true,
  imports: [CommonModule, TranslateModule, BackToTopButtonComponent, CallActionComponent, RouterLink],
  templateUrl: './article-search-result.component.html',
  styleUrl: './article-search-result.component.scss'
})
export class ArticleSearchResultComponent implements OnInit {
  keyword: string = '';
  allArticleData: any[] = [];
  visibleArticles: IArticle[] = [];
  articlesToLoad: number = 12;
  loadMoreButtonVisible: boolean = false;
  ArticleService: ArticleService = inject(ArticleService);
  translate: TranslateService = inject(TranslateService);
  currentLanguage: string = 'en';

  constructor(private route: ActivatedRoute, private titleService: Title, private metaService: Meta) {
  }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Search Result (Articles) - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Browse our articles searched by keywords to learn more about the amazing things we have done at Perpetua.' });


    this.route.queryParams.subscribe((params) => {
      this.keyword = params['keyword'] || '';

      this.allArticleData = this.ArticleService.getSearchResults();
      console.log("articles: ", this.allArticleData);

      if (!this.allArticleData || this.allArticleData.length === 0) {
        this.ArticleService.articles$.subscribe((articles) => {
          this.allArticleData = articles.filter((article) =>
            article.title.toLowerCase().includes(this.keyword.toLowerCase()),
          );
          this.visibleArticles = this.allArticleData.slice(0, this.articlesToLoad);
          this.loadMoreButtonVisible = this.allArticleData.length > this.articlesToLoad;
        });
      } else {
        this.visibleArticles = this.allArticleData.slice(0, this.articlesToLoad);
        this.loadMoreButtonVisible = this.allArticleData.length > this.articlesToLoad;
      }
    });

    this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang;
      this.titleService.setTitle(this.translate.instant('articles.title') + ' - Perpetua');
    });
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  loadMoreArticles(): void {
    const newProjects = this.allArticleData.slice(this.visibleArticles.length, this.visibleArticles.length + this.articlesToLoad);
    this.visibleArticles = [...this.visibleArticles, ...newProjects];
    this.loadMoreButtonVisible = this.visibleArticles.length < this.allArticleData.length;
  }
}
