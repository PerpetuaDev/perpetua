// Libraries
import { Component, OnDestroy, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
// Components
// import { OfficeData } from './office-data'; // REPLACED: now loaded from Strapi
// Services
import { TranslationHelper } from '../../../../shared/translation-helper';
import { OfficeService } from '../../../../shared/office.service';

const countryKeyMap: { [key: string]: string } = {
  'New Zealand': 'location.nz',
  'Australia': 'location.au',
  'Japan': 'location.jp',
  'Korea': 'location.kr',
};

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit, OnDestroy {
  @ViewChild('menuDropdown', { static: false }) menuDropdown!: ElementRef;
  @ViewChild('menuTrigger', { static: false }) menuTrigger!: ElementRef;

  // offices: any[] = OfficeData; // REPLACED: now loaded from Strapi
  offices: any[] = [];
  selectedOfficeIndex: number = 0;
  isMenuOpen: boolean = false; // Track menu visibility
  currentLanguage: string = 'en';
  private officesSub!: Subscription;

  constructor(
    private translationHelper: TranslationHelper,
    private translate: TranslateService,
    private elementRef: ElementRef,
    private officeService: OfficeService,
  ) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.officesSub = this.officeService.offices$.subscribe(offices => {
      if (offices.length) {
        this.offices = offices.map(o => ({
          country: countryKeyMap[o.country] || o.country,
          phone: o.phone,
          email: o.email,
        }));
        this.translateCountryNames();
      }
    });

    this.translate.onLangChange.subscribe(() => {
      this.translateCountryNames();
    });
    this.translateCountryNames(); // Initial translation setup
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
    this.officesSub?.unsubscribe();
  }

  translateCountryNames(): void {
    this.offices.forEach((office) => {
      office.translatedCountryName = this.translate.instant(office.country);
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onOfficeSelected(index: number): void {
    this.selectedOfficeIndex = index;
    this.closeMenu();
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onCloseOptionKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.closeMenu();
      event.preventDefault();
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (
      this.isMenuOpen &&
      this.menuDropdown &&
      !this.menuDropdown.nativeElement.contains(event.target) &&
      !this.menuTrigger.nativeElement.contains(event.target)
    ) {
      this.closeMenu();
    }
  }
}
