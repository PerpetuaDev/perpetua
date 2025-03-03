// Libraries
import { Component, Input, OnInit, inject, ViewChild, HostListener, ElementRef, Renderer2, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// Components
import { ProjectSearchResultComponent } from '../projects/project-search-result/project-search-result.component';
import { ArticleSearchResultComponent } from '../articles/article-search-result/article-search-result.component';
// Services
import { IProject, IArticle } from '../../../util/interfaces';
import { ProjectService } from '../../shared/project.service';
import { ArticleService } from '../../shared/article.service';
import { SearchService } from '../../shared/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProjectSearchResultComponent, ArticleSearchResultComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() data: 'projects' | 'articles' = 'projects';
  @Output() resultSelected = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef;
  selectedFilter: 'all' | 'project' | 'blog' = 'all';
  keyword: string = '';
  isBorderVisible: boolean = false;
  ArticleService: ArticleService = inject(ArticleService);
  searchControl = new FormControl();
  projects: IProject[] = [];
  articles: IArticle[] = [];
  searchResultAll: string[] = [];
  translate: TranslateService = inject(TranslateService);
  currentLanguage: string = 'en';

  searchResults: {
    documentId: string,
    title: string,
    path: string,
    thumbnail_image: {
      url: string
    },
    type: string,
    createdAt: string
  }[] = [];
  sanitizer = inject(DomSanitizer);

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    private router: Router,
    private projectService: ProjectService,
    private articleService: ArticleService,
    private searchService: SearchService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle(`Search Result ${this.selectedFilter} - Perpetua`);
    this.metaService.updateTag({ name: 'description', content: 'Browse our articles searched by keywords to learn more about the amazing things we have done at Perpetua.' });

    this.route.queryParams.subscribe((params) => {
      this.keyword = params['keyword'] || '';
      this.searchControl.setValue(this.keyword);
      const source = params['source'];
      if (source === 'projects') {
        this.selectedFilter = 'project';
      } else if (source === 'articles') {
        this.selectedFilter = 'blog';
      } else {
        this.selectedFilter = 'all';
      }
      this.onSearchInput();
    });

    this.searchControl.valueChanges.subscribe((value) => {
      this.keyword = value;
      this.searchService.updateKeyword(value);
      this.onSearchInput();
    });

    this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang;
      this.titleService.setTitle(this.translate.instant('articles.title') + ' - Perpetua');
    });

    if (this.keyword.length >= 0 && this.searchInput) {
      const border = this.searchInput.nativeElement.nextElementSibling;
      if (border) {
        this.renderer.addClass(border, 'visible');
      }
    }
  }

  sortResults(sort: string): void {
    if (this.selectedFilter === sort) {
      this.selectedFilter = 'all';
    } else {
      this.selectedFilter = sort as 'all' | 'project' | 'blog';
    }
    this.onSearchInput();
  }

  onSearchIconKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onSearchInput();
    }
  }

  onSearchIconClick(): void {
    const keyword = this.searchControl.value;
    if (keyword || keyword.length >= 0) {
      this.isBorderVisible = true;
    }
  }

  onSearchInput(isFocused: boolean = false): void {
    const keyword = this.searchControl.value?.toLowerCase() || '';

    this.searchService.updateKeyword(keyword);

    if (isFocused || keyword.length >= 0) {
      this.isBorderVisible = true;
    } else {
      this.isBorderVisible = false;
    }

    if (!keyword) {
      this.searchResults = [];
      return;
    }

    this.searchResults = [];

    this.projectService.projects$.subscribe((projects) => {
      this.projects = projects;

      this.articleService.articles$.subscribe((articles) => {
        this.articles = articles;

        // Combining both articles and projects based on the search keyword
        this.searchResults = [
          ...this.projects.filter(project => project.project_title.toLowerCase().includes(keyword)).map(project => ({
            documentId: project.documentId,
            title: project.project_title,
            path: "/projects",
            thumbnail_image: { url: project.thumbnail_image.url },
            type: this.capitalizeFirstLetter(project.project_type),
            createdAt: project.createdAt instanceof Date ? project.createdAt.toISOString() : project.createdAt
          })),
          ...this.articles.filter(article => article.title.toLowerCase().includes(keyword)).map(article => ({
            documentId: article.documentId,
            title: article.title,
            path: "/articles",
            thumbnail_image: { url: article.thumbnail_image.url },
            type: this.capitalizeFirstLetter(article.type),
            createdAt: article.createdAt
          }))
        ];

        this.searchResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
    });
  }

  removeBottomBorder(): void {
    if (this.searchInput) {
      const border = this.searchInput.nativeElement.nextElementSibling;
      if (border) {
        this.renderer.removeClass(border, 'visible');
      }
    }
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;

    if (!targetElement.closest('.search-bar-wrapper')) {
      this.isBorderVisible = false;

      this.searchInput.nativeElement.blur();
    }
  }

  scrollToTop(): void {
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });
  }

  navigateToDetail(path: string, documentId: string): void {
    this.scrollToTop();
    this.router.navigate([path, documentId]);
  }

  onKeyDown(event: KeyboardEvent, path: string, documentId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToDetail(path, documentId);
    }
  }
}
