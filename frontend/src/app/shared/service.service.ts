// Libraries
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// Services
import { StrapiService } from '../api/strapi.service';
import { IService, APIResponseModel } from '../../util/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    private servicesSubject = new BehaviorSubject<IService[]>([]);
    services$ = this.servicesSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(true);
    isLoading$ = this.loadingSubject.asObservable();

    constructor(private strapiService: StrapiService) {
        this.fetchServices();
    }

    private fetchServices(): void {
        this.strapiService.getAllServices().pipe(
            map((result: APIResponseModel) =>
                result.data.map((service: IService) => ({
                    ...service,
                    card_icon: service.card_icon
                        ? { ...service.card_icon }
                        : { url: '../../../assets/images/img_n.a.png' }
                }))
            ),
            catchError(error => {
                console.error('Error fetching services:', error);
                this.loadingSubject.next(false);
                return [];
            })
        ).subscribe(services => {
            this.servicesSubject.next(services);
            this.loadingSubject.next(false);
        });
    }
}
