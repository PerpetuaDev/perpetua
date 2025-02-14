// Libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// Components
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { CallActionComponent } from '../../components/call-action/call-action.component';
import { BackToTopButtonComponent } from '../../components/buttons/back-to-top-button/back-to-top-button.component';
import { ArticleAndProjectCardSkeletonComponent } from '../../components/skeletons/article-and-project-card-skeleton/article-and-project-card-skeleton.component';
// Service
import { ProjectService } from '../../shared/project.service';
import { IProject } from '../../../util/interfaces';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, TranslateModule, CallActionComponent, BackToTopButtonComponent, ArticleAndProjectCardSkeletonComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})

export class ProjectsComponent implements OnInit {
  filteredProjects$: Observable<IProject[]>;
  selectedFilter$!: Observable<string | null>;
  industries$!: Observable<{ [industry: string]: IProject[] }>;
  isLoading$!: Observable<boolean | null>;
  private projectsSubject = new BehaviorSubject<IProject[]>([]);
  projects$ = this.projectsSubject.asObservable();

  // Lazy loading
  visibleProjects: IProject[] = [];
  private allProjects: IProject[] = [];
  projectsToLoad: number = 12;
  loadMoreButtonVisible: boolean = false;

  projectService: ProjectService = inject(ProjectService);
  translate: TranslateService = inject(TranslateService);
  currentLanguage: string = 'en';

  constructor(private titleService: Title, private metaService: Meta) {
    this.filteredProjects$ = this.projectService.filteredProjects$;
    this.selectedFilter$ = this.projectService.selectedFilter$;
    this.industries$ = this.projectService.projectsByIndustry$;
    this.isLoading$ = this.projectService.isLoading$;
  }

  get projectsByIndustry$(): Observable<{ [industry: string]: IProject[] }> {
    return this.projects$.pipe(
      map((projects) =>
        projects.reduce((acc, project) => {
          const industry = project.industry || 'Uncategorized';
          if (!acc[industry]) {
            acc[industry] = [];
          }
          acc[industry].push(project);
          return acc;
        }, {} as { [industry: string]: IProject[] })
      )
    );
  }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Projects - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Browse our projects to learn more about the amazing things we have done at Perpetua.' });

    this.selectedFilter$.subscribe((filter) => {
      if (filter) {
        const upperCaseFilter = filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase(); // capitalise only the first letter
        this.titleService.setTitle(`${upperCaseFilter} Projects - Perpetua`);
        this.metaService.updateTag({ name: 'description', content: `Browse ${filter} projects by Perpetua` });
      } else {
        this.titleService.setTitle('All Projects - Perpetua');
        this.metaService.updateTag({ name: 'description', content: 'Browse all projects by Perpetua' });
      }
    });

    this.translate.onLangChange.subscribe(event => {
      this.currentLanguage = event.lang;
      this.titleService.setTitle(this.translate.instant('projects.title') + ' - Perpetua');
    });

    this.filteredProjects$
      .pipe(
        filter(projects => projects.length > 0)
      )
      .subscribe((projects) => {
        this.allProjects = projects;
        this.initializeVisibleProjects();
      });
  }

  setProjects(projects: IProject[]): void {
    this.projectsSubject.next(projects);
  }

  initializeVisibleProjects(): void {
    this.visibleProjects = this.allProjects.slice(0, this.projectsToLoad);
    this.loadMoreButtonVisible = this.visibleProjects.length < this.allProjects.length;
  }

  loadMoreProjects(): void {
    const newProjects = this.allProjects.slice(this.visibleProjects.length, this.visibleProjects.length + this.projectsToLoad);
    this.visibleProjects = [...this.visibleProjects, ...newProjects];
    this.loadMoreButtonVisible = this.visibleProjects.length < this.allProjects.length;
  }

  sortProjects(type: string): void {
    this.projectService.filterProjects(type);
  }

  getIndustryKeys(projectsByIndustry: { [industry: string]: IProject[] }): string[] {
    return Object.keys(projectsByIndustry);
  }
}
