// Libraries
import { Component, OnDestroy, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// Components
import { OfficeData } from './office-data';
// Services
import { TranslationHelper } from '../../../../shared/translation-helper';

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

  offices: any[] = OfficeData;
  selectedOfficeIndex: number = 0;
  isMenuOpen: boolean = false; // Track menu visibility
  currentLanguage: string = 'en';

  constructor(
    private translationHelper: TranslationHelper,
    private translate: TranslateService,
    private elementRef: ElementRef
  ) {
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
