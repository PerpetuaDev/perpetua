// Libraries
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { IProject } from '../../../../util/interfaces';
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-project-card-plus-info',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-card-plus-info.component.html',
  styleUrl: './project-card-plus-info.component.scss'
})
export class ProjectCardPlusInfoComponent implements OnInit, OnDestroy {
  @Input() visibleProjects: IProject[] = [];
  truncatedText: string = '';
  currentLanguage: string = 'en';

  constructor(private router: Router, private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.visibleProjects.forEach((project: IProject) => {
      if (project.project_description) {
        const words = project.project_description.split(' ');
        const truncatedWords = words.slice(0, 27).join(' ');
        this.truncatedText = truncatedWords; // + ' ...'
      }
    })
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  scrollToTop(): void {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backToTop(): void {
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });
  }

  navigateToProject(documentId: string): void {
    this.backToTop();
    this.router.navigate(['/projects', documentId]);
  }

  handleKeydown(event: KeyboardEvent, documentId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToProject(documentId);
    }
  }
}
