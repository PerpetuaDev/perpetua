// Libraries
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Components
import { StaffCardComponent } from '../../../../components/staff-card/staff-card.component';
// Services
import { IMember, APIResponseModel, IImage } from '../../../../../util/interfaces';
import { StrapiService } from '../../../../api/strapi.service';
import { TranslationHelper } from '../../../../shared/translation-helper';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RouterLink, StaffCardComponent, TranslateModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy {
  members: IMember[] = [];
  strapiService = inject(StrapiService);
  strapiUrl = environment.strapiMediaUrl;
  intervalId: any;
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.strapiService.getAllMembers().subscribe((result: APIResponseModel) => {
      this.members = result.data;

      // Handle missing or null portrait_image
      this.members = this.members.map(member => ({
        ...member,
        portrait_image: this.formatPortraitImage(member.portrait_image),
      }))
        .sort((a, b) => a.last_name.localeCompare(b.last_name));
    }, error => {
      console.error('Error fetching members:', error);
    });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  formatPortraitImage(portrait: IImage | null): IImage {
    if (!portrait || !portrait.url) {
      return {
        id: 0,
        documentId: '',
        name: 'default-portrait',
        url: "../../../assets/images/img_n.a.png",
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    return {
      ...portrait,
      url: this.strapiUrl + (portrait.url || "../../../assets/images/img_n.a.png")
    };
  }
}