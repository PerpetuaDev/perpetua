// Libraries
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
// Services
import { StrapiService } from '../api/strapi.service';
import { IOffice, APIResponseModel } from '../../util/interfaces';

@Injectable({
    providedIn: 'root'
})

export class OfficeService {
    private intervalId: any;
    private timeoutId: any;

    private officesSubject = new BehaviorSubject<IOffice[]>([]);
    offices$ = this.officesSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(true);
    isLoading$ = this.loadingSubject.asObservable();

    constructor(private strapiService: StrapiService) {
        this.getAllOffices().subscribe(offices => {
            this.officesSubject.next(offices);
            this.alignToNextMinute();
        });
    }

    getAllOffices(): Observable<IOffice[]> {
        this.loadingSubject.next(true);
        return this.strapiService.getAllOffices().pipe(
            map((response: APIResponseModel) => {
                const offices = response.data.map((office: IOffice) => {
                    const officeImage = office.office_image
                        ? { url: office.office_image.url }
                        : { url: "../../../assets/images/img_n.a.png" };

                    return {
                        ...office,
                        office_image: officeImage,
                        currentTime: this.getCurrentTime(office.office_location)
                    };
                }).sort((a: IOffice, b: IOffice) => a.office_location.localeCompare(b.office_location));

                this.loadingSubject.next(false);
                return offices;
            })
        );
    }


    alignToNextMinute(): void {
        const now = new Date();
        const millisecondsUntilNextMinute = (60 - now.getSeconds()) * 1000;

        this.timeoutId = setTimeout(() => {
            this.updateCurrentTimes();
            this.intervalId = setInterval(() => {
                this.updateCurrentTimes();
            }, 60000);
        }, millisecondsUntilNextMinute);
    }

    updateCurrentTimes(): void {
        const updatedOffices = this.officesSubject.getValue().map(office => ({
            ...office,
            currentTime: this.getCurrentTime(office.office_location)
        }));
        this.officesSubject.next(updatedOffices);
    }

    getCurrentTime(location: string): string {
        if (location === 'Christchurch') location = 'Pacific/Auckland';
        if (location === 'Sydney') location = 'Australia/Sydney';
        if (location === 'Yokohama') location = 'Asia/Tokyo';

        try {
            const date = new Date().toLocaleString("en-US", {
                timeZone: location,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            return date;
        } catch (error) {
            console.error(`Error fetching time for location ${location}:`, error);
            return "00:00 AM";
        }
    }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
}