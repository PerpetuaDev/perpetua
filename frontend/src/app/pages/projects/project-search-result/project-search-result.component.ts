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
import { ProjectService } from '../../../shared/project.service';
import { IProject } from '../../../../util/interfaces';
import { SearchService } from '../../../shared/search.service';

@Component({
  selector: 'app-project-search-result',
  standalone: true,
  imports: [CommonModule, TranslateModule, BackToTopButtonComponent, CallActionComponent, RouterLink],
  templateUrl: './project-search-result.component.html',
  styleUrl: './project-search-result.component.scss'
})
export class ProjectSearchResultComponent implements OnInit {
  keyword: string = '';
  allProjectData: any[] = [];
  visibleProjects: IProject[] = [];
  projectsToLoad: number = 12;
  loadMoreButtonVisible: boolean = false;
  translate: TranslateService = inject(TranslateService);
  currentLanguage: string = 'en';

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private searchService: SearchService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Search Result (Projects) - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Browse our projects searched by keywords to learn more about the amazing things we have done at Perpetua.' });

    this.searchService.keyword$.subscribe((keyword) => {
      this.keyword = keyword;  // Update the local keyword whenever the global keyword changes
      this.filterProjects();   // Call method to filter projects
    });

    // Fetch all project data initially
    this.projectService.projects$.subscribe((projects) => {
      this.allProjectData = projects;
      this.filterProjects();
    });

    this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang;
      this.titleService.setTitle(this.translate.instant('projects.title') + ' - Perpetua');
    });
  }

  filterProjects(): void {
    if (this.keyword) {
      this.visibleProjects = this.allProjectData.filter(project =>
        project.project_title.toLowerCase().includes(this.keyword.toLowerCase())
      );
    } else {
      this.visibleProjects = this.allProjectData.slice(0, this.projectsToLoad);
    }
    this.loadMoreButtonVisible = this.visibleProjects.length < this.allProjectData.length;
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  loadMoreProjects(): void {
    const newProjects = this.allProjectData.slice(this.visibleProjects.length, this.visibleProjects.length + this.projectsToLoad);
    this.visibleProjects = [...this.visibleProjects, ...newProjects];
    this.loadMoreButtonVisible = this.visibleProjects.length < this.allProjectData.length;
  }
}
