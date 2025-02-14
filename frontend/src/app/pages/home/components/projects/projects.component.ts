// Libraries
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
// Components
import { ProjectCardComponent } from '../../../../components/project-card/project-card.component';
import { ArticleAndProjectCardSkeletonComponent } from '../../../../components/skeletons/article-and-project-card-skeleton/article-and-project-card-skeleton.component';
// Services
import { ProjectService } from '../../../../shared/project.service';
import { LanguageService } from '../../../../shared/language.service';
import { IProject } from '../../../../../util/interfaces';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, RouterLink, TranslateModule, ArticleAndProjectCardSkeletonComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects$: Observable<IProject[]>;
  filteredProjects$: Observable<IProject[]>;
  selectedFilter$!: Observable<string | null>;
  isLoading$!: Observable<boolean | null>;
  currentLanguage: string = 'en';
  private langChangeSubscription!: Subscription;

  projectService: ProjectService = inject(ProjectService);

  constructor(
    private languageService: LanguageService
  ) {
    this.projects$ = this.projectService.projects$;
    this.filteredProjects$ = this.projectService.filteredProjects$;
    this.selectedFilter$ = this.projectService.selectedFilter$;
    this.isLoading$ = this.projectService.isLoading$;
  }

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();

    this.langChangeSubscription = this.languageService.currentLanguage$.subscribe(
      (lang) => {
        this.currentLanguage = lang;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  sortProjects(type: string): void {
    this.projectService.filterProjects(type);
  }
}
