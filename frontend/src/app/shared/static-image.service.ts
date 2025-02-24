// Libraries
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// Services
import { APIResponseModel, IStaticImage } from '../../util/interfaces';
import { StrapiService } from '../api/strapi.service';

@Injectable({
    providedIn: 'root'
})

export class StaticImageService {
    private staticImagesSubject = new BehaviorSubject<IStaticImage[]>([]);
    staticImages$ = this.staticImagesSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(true);
    isLoading$ = this.loadingSubject.asObservable();

    constructor(private strapiService: StrapiService) {
        this.fetchStaticImages();
    }

    fetchStaticImages(): void {
        this.loadingSubject.next(true);
        this.strapiService.getAllStaticImages().subscribe((result: APIResponseModel) => {
            const staticImages = result.data.map((staticImage: IStaticImage) => {
                return {
                    ...staticImage,
                    image: staticImage.image
                        ? {
                            ...staticImage.image,
                            url: staticImage.image?.url
                        }
                        : { url: "../../../../../assets/images/img_n.a.png" }
                };
            });
            this.staticImagesSubject.next(staticImages);
            this.loadingSubject.next(false);
        }, error => {
            console.error('Error fetching members:', error);
            this.loadingSubject.next(false);
        });

    }

    getStaticImages(): IStaticImage[] {
        return this.staticImagesSubject.getValue();
    }

    getImageByTitle(title: string) {
        const staticImages = this.staticImagesSubject.getValue();
        return staticImages.find(staticImage => staticImage.image_location === title)?.image;
    }
}