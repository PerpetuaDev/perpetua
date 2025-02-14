// Libraries
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// Components
import { OfficeData } from './office-data';
// Services
import { TranslationHelper } from '../../../../shared/translation-helper';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule, CdkMenu, CdkMenuItem, CdkMenuTrigger, TranslateModule],
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit, OnDestroy {
  @ViewChild(CdkMenuTrigger) trigger!: CdkMenuTrigger; // Reference to the CdkMenuTrigger
  offices: any[] = OfficeData;
  selectedOfficeIndex: number = 0;
  isMenuOpen: boolean = false; // Track menu visibility
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper, private translate: TranslateService) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.translateCountryNames();
    });
    this.translateCountryNames(); // Initial translation setup
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  translateCountryNames(): void {
    this.offices.forEach((office) => {
      office.translatedCountryName = this.translate.instant(office.country);
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.trigger.open();
    } else {
      this.trigger.close();
    }
  }

  onOfficeSelected(index: number): void {
    this.selectedOfficeIndex = index;
    this.closeMenu();
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.trigger.close();
  }

  onCloseOptionKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.closeMenu();
      event.preventDefault();
    }
  }
}
