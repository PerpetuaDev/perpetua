import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationHelper } from '../../shared/translation-helper';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [FooterComponent, TranslateModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})

export class TermsComponent implements OnInit {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private translationHelper: TranslationHelper
  ) { }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Terms - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Understand the terms and conditions for using Perpetua. Explore detailed guidelines on our services, user responsibilities, and legal agreements.' });

    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }
} 
