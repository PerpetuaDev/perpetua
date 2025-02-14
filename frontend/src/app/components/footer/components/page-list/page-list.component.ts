// Libraries
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Services
import { ProjectService } from '../../../../shared/project.service';
import { ArticleService } from '../../../../shared/article.service';
import { TranslationHelper } from '../../../../shared/translation-helper';
import { IProject } from '../../../../../util/interfaces';

@Component({
  selector: 'app-page-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.scss'
})

export class PageListComponent implements OnInit, OnDestroy {
  projects$: Observable<IProject[]>;
  projectTitles: string[] = [
    'MyOCP App',
    'Duncan Taylor Builders Website',
    'Perpetua Website',
    'OCP Group Website',
  ];
  filteredProjects$: Observable<IProject[]>;
  currentLanguage: string = 'en';
  projectService: ProjectService = inject(ProjectService);
  articleService: ArticleService = inject(ArticleService);

  constructor(private translationHelper: TranslationHelper, private translate: TranslateService) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
    this.projects$ = this.projectService.projects$;
    this.filteredProjects$ = this.projects$.pipe(
      map((projects) =>
        this.projectTitles
          .map((title) => projects.find((project) => project.project_title === title))
          .filter((project) => !!project) as IProject[]
      )
    );

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  handleClick(sortType: string, menuItem: string, event: Event): void {
    event.stopPropagation();

    if (sortType === 'article' || sortType === 'news' || sortType === 'allArticle') {
      if (sortType === 'allArticle') {
        sortType = 'all';
      }
      console.log(sortType)
      this.sortArticles(sortType);
    } else {
      this.sortProjects(sortType);
    }
  }

  handleKeydown(event: KeyboardEvent, sortType: string, menuItem: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sortProjects(sortType);
    }
  }

  sortArticles(type: string): void {
    this.articleService.sortArticles(type);
  }

  sortProjects(type: string): void {
    this.projectService.filterProjects(type);
  }
}

