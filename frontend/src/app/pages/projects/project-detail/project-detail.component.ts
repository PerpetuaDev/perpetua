// Libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
// Components
import { BackToTopButtonComponent } from '../../../components/buttons/back-to-top-button/back-to-top-button.component';
import { ProjectDetailSkeletonComponent } from '../../../components/skeletons/project-detail-skeleton/project-detail-skeleton.component';
import { MoreProjectsComponent } from './components/more-projects/more-projects.component';
import { ProjectContentComponent } from './components/project-content/project-content.component';
// Services
import { StrapiService } from '../../../api/strapi.service';
import { IProject, APIResponseModel, IImage } from '../../../../util/interfaces';
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    ProjectDetailSkeletonComponent,
    BackToTopButtonComponent,
    MoreProjectsComponent,
    ProjectContentComponent,
    TranslateModule,
    RouterLink
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  documentId!: string;
  project?: IProject;
  currentLanguage: string = 'en';
  parsedTestimonial: SafeHtml | undefined;

  constructor(
    private metaService: Meta,
    private titleService: Title,
    private router: Router,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private strapiService: StrapiService,
    private translationHelper: TranslationHelper
  ) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.documentId = id;
        this.loadProjectDetails();
      }
    });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  loadProjectDetails(): void {
    this.strapiService.getProjectById(this.documentId).subscribe((result: APIResponseModel) => {
      if (result && result.data) {
        this.project = result.data;

        let projectImages = Array.isArray(result.data.project_images) ? result.data.project_images : [];

        while (projectImages.length < 6) {
          projectImages.push({
            id: 0,
            documentId: '',
            name: 'default-thumbnail',
            url: "../../../assets/images/img_n.a.png",
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }

        this.project = {
          ...result.data,
          testimonial: result.data.project_client.testimonial,
          thumbnail_image: this.formatImageUrl(result.data.thumbnail_image),
          project_images: projectImages.map((image: IImage) => this.formatImageUrl(image)) // Format each image URL
        };

        if (this.project) {
          const companyName = this.project?.project_client?.company_name || 'Unknown Company';
          this.titleService.setTitle(`${this.project.project_title} (${companyName}) - Perpetua`);
          this.metaService.updateTag({
            name: 'description',
            content: `Learn more about ${this.project.project_title} (${companyName}).`
          });
          this.parseTestimonial(this.project.project_client.testimonial);
        }
      }
    }, (error) => {
      console.error('Error fetching project:', error);
    });
  }

  formatImageUrl(image: IImage | null): IImage {
    if (!image || !image.url) {
      return {
        id: 0,
        documentId: '',
        name: 'default-thumbnail',
        url: "../../../assets/images/img_n.a.png",
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    return {
      ...image,
      url: image.url || "../../../assets/images/img_n.a.png"
    };
  }

  async parseTestimonial(testimonial: any): Promise<void> {
    if (testimonial) {
      try {
        let styledContent = await marked.parse(testimonial);

        const words = styledContent.split(/\s+/);

        for (let i = words.length - 1; i >= 0; i--) {
          if (words[i].includes('</p>')) {
            words[i] = words[i].replace('</p>', '&rdquo;</p>');
            break;
          }
        }

        styledContent = words.join(' ');

        this.parsedTestimonial = this.sanitizer.bypassSecurityTrustHtml(styledContent);
      } catch (error) {
        console.error('Error parsing testimonial:', error);
      }
    }
  }


  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
