// Libraries
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
// Components
import { ServiceHeaderSkeletonComponent } from '../../../../components/skeletons/service-header-skeleton/service-header-skeleton.component';
// Services
import { ServiceProcessData } from './service-process-data';
import { StaticImageService } from '../../../../shared/static-image.service';
import { IStaticImage } from '../../../../../util/interfaces';

@Component({
  selector: 'app-service-process',
  standalone: true,
  imports: [CommonModule, ServiceHeaderSkeletonComponent],
  templateUrl: './service-process.component.html',
  styleUrl: './service-process.component.scss'
})
export class ServiceProcessComponent implements OnInit {
  serviceProcessData = [...ServiceProcessData];
  headerImage: string = '';
  isLoading$!: Observable<boolean | null>;

  constructor(private staticImageService: StaticImageService) {
    this.isLoading$ = this.staticImageService.isLoading$;
  }

  ngOnInit(): void {
    this.staticImageService.staticImages$.subscribe((staticImages) => {
      if (staticImages && staticImages.length > 0) {
        staticImages.forEach((image: IStaticImage) => {
          const processIndex = this.getProcessIndexFromLocation(image.image_location);
          if (processIndex !== -1) {
            this.serviceProcessData[processIndex].image = image.image.url;
          }
        });
      }
    });
  }

  private getProcessIndexFromLocation(imageLocation: string): number {
    const mappings: { [key: string]: number } = {
      'service-process-image1': 0,
      'service-process-image2': 1,
      'service-process-image3': 2,
      'service-process-image4': 3,
      'service-process-image5': 4,
    };
    return mappings[imageLocation] ?? -1;
  }
}
