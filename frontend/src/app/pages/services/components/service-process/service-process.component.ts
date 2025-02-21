import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceProcessData } from './service-process-data';
import { StaticImageService } from '../../../../shared/static-image.service';
import { IStaticImage } from '../../../../../util/interfaces';

@Component({
  selector: 'app-service-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-process.component.html',
  styleUrl: './service-process.component.scss'
})
export class ServiceProcessComponent implements OnInit {
  serviceProcessData = [...ServiceProcessData];
  headerImage: string = '';

  constructor(private staticImageService: StaticImageService) { }

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
