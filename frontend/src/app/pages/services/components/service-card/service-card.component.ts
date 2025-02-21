// Libraries
import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// Services
import { ServiceData } from '../../../home/components/services/service-data';
import { IService } from '../../../../../util/interfaces';
import { TranslationHelper } from '../../../../shared/translation-helper';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent implements OnDestroy {
  @Input() isServiceDetail: boolean = false;
  services: IService[] = ServiceData;
  currentLanguage: string = 'en';

  constructor(
    private translationHelper: TranslationHelper,
    private translate: TranslateService
  ) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  getTitle(service: any): string {
    return this.translate.instant(service.title);
  }

  getDescription(service: IService): string {
    return this.translate.instant(service.description);
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
