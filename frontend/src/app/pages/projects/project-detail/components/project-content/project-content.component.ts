// Libraries
import { Component, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
// Components
import { IProject } from '../../../../../../util/interfaces'

@Component({
  selector: 'app-project-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-content.component.html',
  styleUrl: './project-content.component.scss'
})

export class ProjectContentComponent implements OnChanges {
  @Input() project: IProject | undefined;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project']) {
      this.cdr.detectChanges();
    }
  }
}
