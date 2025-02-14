// Libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// Components
import { ProjectCardComponent } from '../../../components/project-card/project-card.component';
import { CallActionComponent } from '../../../components/call-action/call-action.component';
import { BackToTopButtonComponent } from '../../../components/buttons/back-to-top-button/back-to-top-button.component';
import { ArticleAndProjectCardSkeletonComponent } from '../../../components/skeletons/article-and-project-card-skeleton/article-and-project-card-skeleton.component';
// Service
import { ProjectService } from '../../../shared/project.service';
import { IProject } from '../../../../util/interfaces';

@Component({
  selector: 'app-project-industry',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, TranslateModule, CallActionComponent, BackToTopButtonComponent, ArticleAndProjectCardSkeletonComponent],
  templateUrl: './project-industry.component.html',
  styleUrl: './project-industry.component.scss'
})
export class ProjectIndustryComponent implements OnInit {
  selectedIndustry: string | undefined;
  industryProjects$: Observable<IProject[]>;
  filteredProjects$ = new BehaviorSubject<IProject[]>([]);
  selectedFilter$ = new BehaviorSubject<string | null>('all');
  isLoading$!: Observable<boolean | null>;

  // Lazy loading
  visibleProjects: IProject[] = [];
  private allProjects: IProject[] = [];
  projectsToLoad: number = 12;
  loadMoreButtonVisible: boolean = false;

  projectService: ProjectService = inject(ProjectService);
  translate: TranslateService = inject(TranslateService);
  currentLanguage: string = 'en';

  constructor(private titleService: Title, private metaService: Meta, private route: ActivatedRoute) {
    this.isLoading$ = this.projectService.isLoading$;
    this.industryProjects$ = this.projectService.projectsByIndustry$.pipe(
      map((projectsByIndustry) => {
        return this.selectedIndustry ? projectsByIndustry[this.selectedIndustry] || [] : [];
      })
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.selectedIndustry = params.get('industry')!;
      this.titleService.setTitle(`${this.selectedIndustry || 'Projects'} - Perpetua`);
      this.industryProjects$.subscribe((projects) => {
        this.filteredProjects$.next(projects);
      });
    });
  }

  sortProjects(type: string): void {
    this.selectedFilter$.next(type);
    this.industryProjects$.subscribe((projects) => {
      let sortedProjects = [...projects];
      if (type !== 'all') {
        sortedProjects = projects.filter((project) => project.project_type === type);
      }
      this.filteredProjects$.next(sortedProjects);
    });
  }

  loadMoreProjects(): void {
    const newProjects = this.allProjects.slice(this.visibleProjects.length, this.visibleProjects.length + this.projectsToLoad);
    this.visibleProjects = [...this.visibleProjects, ...newProjects];
    this.loadMoreButtonVisible = this.visibleProjects.length < this.allProjects.length;
  }
}
