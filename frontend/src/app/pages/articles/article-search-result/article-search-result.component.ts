// Libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
// Services
import { ArticleService } from '../../../shared/article.service';
import { IArticle } from '../../../../util/interfaces';
import { SearchService } from '../../../shared/search.service';

@Component({
  selector: 'app-article-search-result',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './article-search-result.component.html',
  styleUrl: './article-search-result.component.scss'
})
export class ArticleSearchResultComponent implements OnInit {
  searchControl = new FormControl('');
  keyword: string = '';
  allArticleData: any[] = [];
  visibleArticles: IArticle[] = [];
  articlesToLoad: number = 12;
  loadMoreButtonVisible: boolean = false;
  translate: TranslateService = inject(TranslateService);
  currentLanguage: string = 'en';

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private searchService: SearchService,
    private ArticleService: ArticleService,

  ) { }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Search Result (Articles) - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Browse our articles searched by keywords to learn more about the amazing things we have done at Perpetua.' });

    this.searchService.keyword$.subscribe((keyword) => {
      this.keyword = keyword;  // Update the local keyword whenever the global keyword changes
      this.filterArticles();   // Call method to filter articles
    });

    // Fetch all article data initially
    this.ArticleService.articles$.subscribe((articles) => {
      this.allArticleData = articles;
      this.filterArticles();
    });
  }

  filterArticles(): void {
    if (this.keyword) {
      this.visibleArticles = this.allArticleData.filter(article =>
        article.title.toLowerCase().includes(this.keyword.toLowerCase())
      );
    } else {
      this.visibleArticles = this.allArticleData.slice(0, this.articlesToLoad);
    }
    this.loadMoreButtonVisible = this.visibleArticles.length < this.allArticleData.length;
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
