// Libraries
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { TranslationHelper } from '../../shared/translation-helper';

@Component({
  selector: 'app-call-action',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './call-action.component.html',
  styleUrl: './call-action.component.scss'
})
export class CallActionComponent implements OnDestroy {
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }
}
