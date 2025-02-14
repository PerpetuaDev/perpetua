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
  projectService: ProjectService = inject(ProjectService);
  translate: TranslateService = inject(TranslateService);
  currentLanguage: string = 'en';

  constructor(private route: ActivatedRoute, private titleService: Title, private metaService: Meta) {
  }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Search Result (Projects) - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Browse our projects searched by keywords to learn more about the amazing things we have done at Perpetua.' });


    this.route.queryParams.subscribe((params) => {
      this.keyword = params['keyword'] || '';

      this.allProjectData = this.projectService.getSearchResults();

      if (!this.allProjectData || this.allProjectData.length === 0) {
        this.projectService.projects$.subscribe((projects) => {
          this.allProjectData = projects.filter((project) =>
            project.project_title.toLowerCase().includes(this.keyword.toLowerCase()),
          );
          this.visibleProjects = this.allProjectData.slice(0, this.projectsToLoad);
          this.loadMoreButtonVisible = this.allProjectData.length > this.projectsToLoad;
        });
      } else {
        this.visibleProjects = this.allProjectData.slice(0, this.projectsToLoad);
        this.loadMoreButtonVisible = this.allProjectData.length > this.projectsToLoad;
      }
    });

    this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang;
      this.titleService.setTitle(this.translate.instant('projects.title') + ' - Perpetua');
    });
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
