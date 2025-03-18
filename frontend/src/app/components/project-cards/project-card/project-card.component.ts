// Libraries
import { Component, Input, OnInit, ElementRef, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// Services
import { IProject } from '../../../../util/interfaces';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})

export class ProjectCardComponent implements OnInit {
  @Input() projects: IProject[] = [];
  @Input() showTitleAsIndustry: boolean = false;
  @Input() isLoading: boolean = false;
  @Output() industrySelected = new EventEmitter<string>();
  @ViewChildren('titleWrapper') titleWrappers!: QueryList<ElementRef>;
  currentIndustry: string = '';
  truncatedText: string = '';
  hoveredProjectId: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.projects.length > 0) {
      this.isLoading = false;
    }

    this.projects.forEach((project: IProject) => {
      if (project.project_description) {
        const words = project.project_description.split(' ');
        const truncatedWords = words.slice(0, 27).join(' ');
        this.truncatedText = truncatedWords; // + ' ...'
      }
    })

    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });
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

  onImageLoad(): void {
    this.isLoading = false;
  }

  private isTextOverflowing(element: HTMLElement): boolean {
    return element.scrollHeight > element.clientHeight;
  }

  onMouseEnterTitle(documentId: string): void {
    this.hoveredProjectId = documentId;
  }

  onMouseLeaveTitle(): void {
    this.hoveredProjectId = null;
  }

  isHovered(documentId: string): boolean {
    return this.hoveredProjectId === documentId;
  }

  onIndustryCardClick(industry: string): void {
    this.industrySelected.emit(industry);
  }
}