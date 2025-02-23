// Libraries
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
// Services
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-more-project-button',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './more-project-button.component.html',
  styleUrl: './more-project-button.component.scss'
})
export class MoreProjectButtonComponent implements OnDestroy {
  constructor(private translationHelper: TranslationHelper) { }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }
}
