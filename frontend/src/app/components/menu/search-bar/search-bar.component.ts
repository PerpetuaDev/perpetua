// Libraries
import { Component, Input, OnInit, inject, ViewChild, HostListener, ElementRef, Renderer2, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// Services
import { IProject, IArticle } from '../../../../util/interfaces';
import { ProjectService } from '../../../shared/project.service';
import { ArticleService } from '../../../shared/article.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})

export class SearchBarComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() data: 'projects' | 'articles' = 'projects';
  @Output() resultSelected = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef;
  searchControl = new FormControl();
  projects: IProject[] = [];
  allProjectData: IProject[] = [];
  articles: IArticle[] = [];
  allArticleData: IArticle[] = [];
  searchResultAll: string[] = [];
  searchResults: { title: string, path: string, highlightedTitle: SafeHtml }[] = [];
  sanitizer = inject(DomSanitizer);

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private projectService: ProjectService,
    private articleService: ArticleService,
  ) { }

  ngOnInit(): void {
    if (this.data === 'projects') {
      this.projectService.projects$.subscribe((projects: IProject[]) => {
        this.projects = projects;
      }, error => {
        console.error('Error fetching projects from ProjectService:', error);
      });
    } else if (this.data === 'articles') {
      this.articleService.articles$.subscribe((articles: IArticle[]) => {
        this.articles = articles;
      }, error => {
        console.error('Error fetching articles:', error);
      });
    }
  }

  onSearchIconKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onSearchInput();
    }
  }

  onSearchInput(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }

    const keyword = this.searchControl.value?.toLowerCase() || '';

    if (this.searchInput) {
      const border = this.searchInput.nativeElement.nextElementSibling;
      this.renderer.addClass(border, 'visible');
    }

    if (!keyword) {
      this.searchResults = [];
      this.searchResultAll = [];
      return;
    }

    if (this.data === 'projects') {
      this.allProjectData = this.projects
        .filter((project: IProject) => project.project_title.toLowerCase().includes(keyword))
      this.searchResults = this.allProjectData
        .slice(0, 5)
        .map((project: IProject) => ({
          title: project.project_title,
          path: `/projects/${project.documentId}`,
          highlightedTitle: this.getHighlightedText(project.project_title, keyword)
        }));
      this.searchResultAll = this.projects.filter((project: IProject) => project.project_title.toLowerCase().includes(keyword)).map((project: IProject) => (`/projects/${project.documentId}`));
    } else if (this.data === 'articles') {
      this.allArticleData = this.articles
        .filter((article: IArticle) => article.title.toLowerCase().includes(keyword))
      this.searchResults = this.allArticleData
        .slice(0, 5)
        .map((article: IArticle) => ({
          title: article.title,
          path: `/articles/${article.documentId}`,
          highlightedTitle: this.getHighlightedText(article.title, keyword)
        }));
      this.searchResultAll = this.articles.filter((article: IArticle) => article.title.toLowerCase().includes(keyword)).map((article: IArticle) => (`/articles/${article.documentId}`));
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

  onSearchResultClick(): void {
    this.resultSelected.emit();
  }

  onKeyDownSearchResultClick(event: KeyboardEvent): void {
    event.preventDefault();
    this.onSearchResultClick();
  }

  onClickAll(data: any): void {
    this.resultSelected.emit();

    if (data === 'projects') {
      this.projectService.setSearchResults(this.allProjectData);
      this.router.navigate(['/projects/results'], {
        queryParams: { keyword: this.searchControl.value },
      });
    } else if (data === 'articles') {
      this.router.navigate(['/articles/results'], {
        queryParams: { keyword: this.searchControl.value },
      });
    }
  }

  onKeyDown(event: KeyboardEvent, data: any) {
    event.preventDefault();
    this.onClickAll(data);
  }

  getHighlightedText(text: string, keyword: string): SafeHtml {
    if (!keyword) {
      return text;
    }

    const regex = new RegExp(`(${keyword})`, 'gi');
    const newText = text.replace(regex, `<span style="font-weight: 500; color: #ffffff;">$1</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(newText);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;

    if (!targetElement.closest('.search-bar-container')) {
      const border = this.searchInput.nativeElement.nextElementSibling;
      if (border) {
        border.classList.remove('visible');
      }
      this.searchControl.setValue('');
      this.searchResults = [];
      this.searchInput.nativeElement.blur();
    }
  }
}