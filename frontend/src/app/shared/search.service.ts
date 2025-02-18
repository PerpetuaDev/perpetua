import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private keywordSubject = new BehaviorSubject<string>('');
    keyword$ = this.keywordSubject.asObservable();

    // Method to update the keyword
    updateKeyword(keyword: string): void {
        this.keywordSubject.next(keyword);
    }
}