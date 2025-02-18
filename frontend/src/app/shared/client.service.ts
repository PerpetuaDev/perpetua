// Libraries
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// Services
import { StrapiService } from '../api/strapi.service';
import { IClient, APIResponseModel } from '../../util/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private clientsSubject = new BehaviorSubject<IClient[]>([]);
    clients$ = this.clientsSubject.asObservable();

    constructor(private strapiService: StrapiService) {
        this.fetchClients();
    }

    private fetchClients(): void {
        this.strapiService.getAllClients().pipe(
            map((result: APIResponseModel) => result.data.map((client: IClient) => {
                return {
                    ...client,
                    company_logo: client.company_logo
                        ? {
                            ...client.company_logo,
                            url: client.company_logo.url
                        }
                        : { url: "../../../assets/images/img_n.a.png" } // Default image if no logo
                };
            }).sort((a: any, b: any) => a.company_name.localeCompare(b.company_name))),
            catchError(error => {
                console.error('Error fetching clients:', error);
                return [];
            })
        ).subscribe(clients => {
            this.clientsSubject.next(clients);
        });
    }

    getClients(): Observable<IClient[]> {
        return this.clients$;
    }
}