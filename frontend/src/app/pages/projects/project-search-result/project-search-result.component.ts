// Libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
// Services
import { ProjectService } from '../../../shared/project.service';
import { IProject } from '../../../../util/interfaces';
import { SearchService } from '../../../shared/search.service';

@Component({
  selector: 'app-project-search-result',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-search-result.component.html',
  styleUrl: './project-search-result.component.scss'
})
export class ProjectSearchResultComponent implements OnInit {
  keyword: string = '';
  allProjectData: IProject[] = [];
  visibleProjects: IProject[] = [];
  loadMoreButtonVisible: boolean = false;
  translate: TranslateService = inject(TranslateService);
  currentLanguage: string = 'en';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private searchService: SearchService,
    private projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Search Result (Projects) - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Browse our projects searched by keywords to learn more about the amazing things we have done at Perpetua.' });

    this.searchService.keyword$.subscribe((keyword) => {
      console.log('Keyword changed:', keyword); // Debugging
      this.keyword = keyword;
      this.filterProjects();
    });

    this.projectService.projects$.subscribe((projects) => {
      console.log('Projects loaded:', projects); // Debugging
      this.allProjectData = projects;
      this.filterProjects();
    });

    this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang;
      this.titleService.setTitle(this.translate.instant('projects.title') + ' - Perpetua');
    });
  }

  filterProjects(): void {
    console.log('Filtering projects with keyword:', this.keyword); // Debugging
    if (this.keyword) {
      this.visibleProjects = this.allProjectData.filter(project =>
        project.project_title.toLowerCase().includes(this.keyword.toLowerCase())
      );
    }
    this.loadMoreButtonVisible = this.visibleProjects.length < this.allProjectData.length;
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  scrollToTop(): void {
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });
  }

  navigateToProject(documentId: string): void {
    this.scrollToTop();
    this.router.navigate(['/projects', documentId]);
  }

  onKeyDown(event: KeyboardEvent, documentId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToProject(documentId);
    }
  }
}
