// Libraries
import { Component, ElementRef, ViewChild, inject, Renderer2, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from 'rxjs';
// Services
import { LanguageService } from '../../../shared/language.service';

@Component({
  selector: 'app-language-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-footer.component.html',
  styleUrls: ['./language-footer.component.scss']
})
export class LanguageFooterComponent implements OnInit, OnDestroy {
  allLanguages: { key: string, label: string, code: string }[] = [
    { key: 'korean', label: '한국어', code: 'ko' },
    { key: 'japanese', label: '日本語', code: 'ja' },
    { key: 'english', label: 'English', code: 'en' }
  ];
  isOpen: boolean = false;
  selectedLanguage: string = 'English';
  private languageSubscription!: Subscription;

  @ViewChild('languageForm', { static: false }) formElement!: ElementRef<HTMLFormElement>;
  @ViewChild('currentLangWrapper', { static: false }) currentLangWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('chevronIcon', { static: false }) chevronIcon!: ElementRef<HTMLElement>;

  get filteredLanguages() {
    return this.allLanguages.filter(lang => lang.label !== this.selectedLanguage);
  }

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.selectedLanguage = this.languageService.getCurrentLanguage();
    this.languageSubscription = this.languageService.currentLanguage$.subscribe((language) => {
      this.selectedLanguage = this.getLanguageLabel(language);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  toggleOption() {
    this.isOpen = !this.isOpen;
    this.cdr.detectChanges();
    if (this.isOpen) {
      this.onOpenOption();
    } else {
      this.onCloseOption();
    }
  }

  getLanguageLabel(code: string): string {
    const lang = this.allLanguages.find((lang) => lang.code === code);
    return lang ? lang.label : 'English';
  }

  onToggleOptionKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleOption();
    }
  }

  langOption(language: string, code: string) {
    this.isOpen = false;
    this.languageService.setCurrentLanguage(language);
    this.translate.use(code.trim()).subscribe(() => {
      this.onCloseOption();
      this.cdr.detectChanges();
    });
  }

  onLangOptionKeyDown(event: KeyboardEvent, lang: string, code: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.langOption(lang, code);
    }
  }

  onOpenOption() {
    if (this.formElement) {
      this.renderer.addClass(this.formElement.nativeElement, 'visible');
    }
    if (this.currentLangWrapper) {
      this.renderer.addClass(this.currentLangWrapper.nativeElement, 'visible');
    }
    if (this.chevronIcon) {
      this.renderer.addClass(this.chevronIcon.nativeElement, 'visible');
    }
  }

  onCloseOption() {
    if (this.formElement) {
      this.renderer.removeClass(this.formElement.nativeElement, 'visible');
    }
    if (this.currentLangWrapper) {
      this.renderer.removeClass(this.currentLangWrapper.nativeElement, 'visible');
    }
    if (this.chevronIcon) {
      this.renderer.removeClass(this.chevronIcon.nativeElement, 'visible');
    }
    this.isOpen = false;
  }
}