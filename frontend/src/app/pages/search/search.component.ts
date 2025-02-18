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
import { SearchBarComponent } from '../../components/menu/search-bar/search-bar.component';
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
  imports: [CommonModule, ReactiveFormsModule, SearchBarComponent, ProjectSearchResultComponent, ArticleSearchResultComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() data: 'projects' | 'articles' = 'projects';
  @Output() resultSelected = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef;
  selectedFilter: string = 'all';
  keyword: string = '';
  isBorderVisible: boolean = false;
  allArticleData: any[] = [];
  visibleArticles: IArticle[] = [];
  articlesToLoad: number = 12;
  loadMoreButtonVisible: boolean = false;
  ArticleService: ArticleService = inject(ArticleService);
  translate: TranslateService = inject(TranslateService);
  currentLanguage: string = 'en';
  searchControl = new FormControl();
  projects: IProject[] = [];
  allProjectData: IProject[] = [];
  articles: IArticle[] = [];
  searchResultAll: string[] = [];
  searchResults: { title: string, path: string, thumbnail_image: { url: string } }[] = [];
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
      this.searchControl.setValue(this.keyword);  // Sync the keyword from the query params
      const source = params['source'];
      if (source === 'projects') {
        this.selectedFilter = 'project';
      } else if (source === 'articles') {
        this.selectedFilter = 'blog';
      } else {
        this.selectedFilter = 'all';
      }
      this.onSearchInput();  // Call the search input function after initialization
    });

    this.searchControl.valueChanges.subscribe((value) => {
      this.searchService.updateKeyword(value);  // Update the keyword in the shared service
    });

    // Listen to changes in searchControl and update the search results
    this.searchControl.valueChanges.subscribe(() => {
      this.keyword = this.searchControl.value || '';
      this.onSearchInput();  // Reapply the search logic on every change
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

  sortResults(sort: string) {
    if (this.selectedFilter === sort) {
      this.selectedFilter = 'all';
    } else {
      this.selectedFilter = sort;
    }
    this.onSearchInput(); // Trigger search when filter changes
  }

  onSearchIconKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onSearchInput();
    }
  }

  onSearchInput(isFocused: boolean = false): void {
    const keyword = this.searchControl.value?.toLowerCase() || '';

    if (!keyword) {
      this.searchResults = [];  // Reset results if no keyword
      return;
    }

    // Reset results arrays
    this.searchResults = [];

    // Filter based on selected filter
    if (this.selectedFilter === 'project') {
      this.allProjectData = this.projects.filter((project) =>
        project.project_title.toLowerCase().includes(keyword)
      );
      this.searchResults = this.allProjectData.map((project) => ({
        title: project.project_title,
        path: `/projects/${project.documentId}`,
        thumbnail_image: { url: project.thumbnail_image.url },
      }));
    } else if (this.selectedFilter === 'blog') {
      this.allArticleData = this.articles.filter((article) =>
        article.title.toLowerCase().includes(keyword)
      );
      this.searchResults = this.allArticleData.map((article) => ({
        title: article.title,
        path: `/articles/${article.documentId}`,
        thumbnail_image: { url: article.thumbnail_image.url },
      }));
    } else {
      // If no filter is selected (showing both projects and articles)
      this.allProjectData = this.projects.filter((project) =>
        project.project_title.toLowerCase().includes(keyword)
      );
      this.allArticleData = this.articles.filter((article) =>
        article.title.toLowerCase().includes(keyword)
      );
      this.searchResults = [
        ...this.allProjectData.map((project) => ({
          title: project.project_title,
          path: `/projects/${project.documentId}`,
          thumbnail_image: { url: project.thumbnail_image.url },
        })),
        ...this.allArticleData.map((article) => ({
          title: article.title,
          path: `/articles/${article.documentId}`,
          thumbnail_image: { url: article.thumbnail_image.url },
        }))
      ];
    }
  }

  removeBottomBorder(): void {
    if (this.searchInput) {
      const border = this.searchInput.nativeElement.nextElementSibling;
      if (border) {
        this.renderer.removeClass(border, 'visible');
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;

    if (!targetElement.closest('.search-bar-wrapper')) {
      this.isBorderVisible = false;
      this.searchResults = [];
      this.searchInput.nativeElement.blur();
    }
  }
}
