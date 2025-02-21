// Libraries
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// Services
import { TranslationHelper } from '../../../../../../shared/translation-helper';
import { IService } from '../../../../../../../util/interfaces';
import { ServiceData } from '../../service-data';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})

export class ServiceCardComponent implements OnDestroy {
  services: IService[] = ServiceData;
  isVisible: boolean[] = new Array(this.services.length).fill(false);
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper, private translate: TranslateService) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  getTitle(service: IService): string {
    return this.translate.instant(service.title);
  }

  getDescription(service: IService): string {
    return this.translate.instant(service.description);
  }

  showDescription(index: number): void {
    this.isVisible[index] = !this.isVisible[index];
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.showDescription(index);
    }
  }

  getPath(service: any): string {
    const titleMap: any = {
      1: 'custom-software',
      2: 'websites&cms',
      3: 'native&web-apps',
      4: 'artificial-intelligence',
      5: 'hosting&cloud-services',
      6: 'data&analytics',
    };

    return titleMap[service.id] || 'no-title';
  }
}