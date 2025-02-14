// Libraries
import { Component, ElementRef, ViewChild, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Components
import { LanguageFooterComponent } from '../../languages/language-footer/language-footer.component';
// Services
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LanguageFooterComponent],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss'
})

export class MobileMenuComponent implements OnInit {
  isMenuOpen = false;
  selectedMenuItem: string | null = 'home';
  @ViewChild('sideMenuContainer', { static: true }) sideMenuContainer!: ElementRef;
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.selectedMenuItem = 'home';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onMenuHide(menuItem: string, event: Event): void {
    event.stopPropagation();

    if (menuItem === this.selectedMenuItem) {
      return;
    }
    this.selectedMenuItem = menuItem;
    this.closeMenu();
  }

  onKeyDownMenuHide(e: KeyboardEvent, menuItem: string): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.onMenuHide(menuItem, e);
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event): void {
    if (
      this.isMenuOpen &&
      this.sideMenuContainer &&
      !this.sideMenuContainer.nativeElement.contains(event.target)
    ) {
      this.closeMenu();
    }
  }
}
