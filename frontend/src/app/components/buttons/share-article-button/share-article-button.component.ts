// Libraries
import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { environment } from '../../../../environments/environment.development';
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-share-article-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './share-article-button.component.html',
  styleUrl: './share-article-button.component.scss'
})
export class ShareArticleButtonComponent implements OnDestroy {
  @Input() articleDocumentId: string = '';
  @Input() articleTitle: string = '';
  @Input() position?: string = '';
  isModalVisible: boolean = false;
  strapiUrl = environment.strapiUrl;

  get articleUrl(): string {
    return `${this.strapiUrl}/articles/${this.articleDocumentId}`;
  }

  get isFooterPosition(): boolean {
    return this.position === 'footer';
  }

  constructor(private translationHelper: TranslationHelper) { }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  shareArticle() {
    if (navigator.share) {
      navigator.share({
        title: this.articleTitle,
        url: this.articleUrl
      })
        .then(() => console.log('Article shared successfully'))
        .catch((error) => console.log('Error sharing article', error));
    } else {
      this.showModal();
    }
  }

  showModal() {
    this.isModalVisible = !this.isModalVisible;
  }
}