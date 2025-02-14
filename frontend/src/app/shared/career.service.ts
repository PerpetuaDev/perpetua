import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICareer } from '../../util/interfaces';
import { StrapiService } from '../api/strapi.service';

@Injectable({
    providedIn: 'root',
})
export class CareerService {
    private careersSubject = new BehaviorSubject<ICareer[]>([]);
    careers$ = this.careersSubject.asObservable();

    private selectedCareerSubject = new BehaviorSubject<ICareer | null>(null);

    constructor(private strapiService: StrapiService) {
        this.fetchCareers();
    }

    private fetchCareers(): void {
        this.strapiService.getAllCareers().subscribe(
            (response) => {
                const careers = response.data;
                this.careersSubject.next(careers);
            },
            (error) => {
                console.error('Error fetching careers:', error);
            }
        );
    }

    getAllCareers(): ICareer[] {
        return this.careersSubject.value;
    }

    getCareerData(): ICareer | null {
        return this.selectedCareerSubject.value;
    }

    setCareerData(career: ICareer): void {
        this.selectedCareerSubject.next(career);
    }
}