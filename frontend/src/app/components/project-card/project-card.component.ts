// Libraries
import { Component, Input, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// Services
import { IProject } from '../../../util/interfaces';

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
  @ViewChildren('titleWrapper') titleWrappers!: QueryList<ElementRef>;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.projects.length > 0) {
      this.isLoading = false;
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
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

  onMouseEnterTitle(event: MouseEvent): void {
    const targetElement = (event.currentTarget as HTMLElement).querySelector('.title-wrapper') as HTMLElement;

    if (targetElement && this.isTextOverflowing(targetElement)) {
      targetElement.classList.add('expanded');
    }
  }

  onMouseLeaveTitle(event: MouseEvent): void {
    const targetElement = (event.currentTarget as HTMLElement).querySelector('.title-wrapper') as HTMLElement;

    if (targetElement) {
      targetElement.classList.remove('expanded');
    }
  }

  private isTextOverflowing(element: HTMLElement): boolean {
    return element.scrollHeight > element.clientHeight;
  }
}