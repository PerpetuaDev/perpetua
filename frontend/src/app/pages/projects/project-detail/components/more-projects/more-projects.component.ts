// Libraries
import { Component, inject, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
// Components
import { ProjectCardComponent } from '../../../../../components/project-card/project-card.component';
// Services
import { ProjectService } from '../../../../../shared/project.service';
import { IProject } from '../../../../../../util/interfaces';
import { TranslationHelper } from '../../../../../shared/translation-helper';

@Component({
  selector: 'app-more-projects',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, TranslateModule],
  templateUrl: './more-projects.component.html',
  styleUrl: './more-projects.component.scss'
})
export class MoreProjectsComponent implements OnChanges, OnDestroy {
  @Input() currentProjectDocumentId: string | null = null;
  moreProjects$: Observable<IProject[]>;
  projectService: ProjectService = inject(ProjectService);
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper) {
    this.moreProjects$ = this.projectService.moreProjects$;
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentProjectDocumentId'] && changes['currentProjectDocumentId'].currentValue) {
      this.projectService.selectMoreProjectByDate(changes['currentProjectDocumentId'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }
}
