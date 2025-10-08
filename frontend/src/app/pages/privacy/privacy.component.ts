import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationHelper } from '../../shared/translation-helper';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})

export class PrivacyComponent implements OnInit {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private translationHelper: TranslationHelper
  ) { }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Privacy - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Learn how Perpetua values and protects your privacy. Discover detailed information about our privacy practices, data handling, and commitment to safeguarding your personal information.' });

    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }
}
