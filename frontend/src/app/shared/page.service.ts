import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, of } from 'rxjs';
import { StrapiService } from '../api/strapi.service';
import { IPage, ITextBlock, APIResponseModel } from '../../util/interfaces';

@Injectable({
    providedIn: 'root'
})
export class PageService {
    private cache = new Map<string, BehaviorSubject<IPage | null>>();

    constructor(private strapiService: StrapiService) {}

    getPage(slug: string): Observable<IPage | null> {
        if (!this.cache.has(slug)) {
            const subject = new BehaviorSubject<IPage | null>(null);
            this.cache.set(slug, subject);

            this.strapiService.getPageBySlug(slug).pipe(
                map((result: APIResponseModel) => result.data?.[0] ?? null),
                catchError(() => of(null))
            ).subscribe(page => subject.next(page));
        }
        return this.cache.get(slug)!.asObservable();
    }

    getText(page: IPage | null, key: string): string {
        return page?.text_blocks?.find((b: ITextBlock) => b.key === key)?.value ?? '';
    }

    getTextParts(page: IPage | null, key: string): string[] {
        return this.getText(page, key).split('[LineSplit]');
    }
}
