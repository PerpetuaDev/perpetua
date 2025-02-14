// Libraries
import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { IClient } from '../../../../../util/interfaces';
import { TranslationHelper } from '../../../../shared/translation-helper';

@Component({
  selector: 'app-client-block',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './client-block.component.html',
  styleUrl: './client-block.component.scss'
})
export class ClientBlockComponent implements OnDestroy {
  @Input() clients: IClient[] = [];
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  emptySpaces() {
    return new Array(9 - this.clients.length).fill(null);
  }
}
