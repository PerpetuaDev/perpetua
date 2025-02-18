// Libraries
import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { IClient } from '../../../../util/interfaces';
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-client-block-about',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './client-block-about.component.html',
  styleUrl: './client-block-about.component.scss'
})
export class ClientBlockAboutComponent implements OnDestroy {
  @Input() clients: IClient[] = [];
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  emptySpaces() {
    return new Array(14 - this.clients.length).fill(null);
  }
}
