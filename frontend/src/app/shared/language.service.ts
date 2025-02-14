import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    private currentLanguageSubject = new BehaviorSubject<string>('en');
    currentLanguage$ = this.currentLanguageSubject.asObservable();

    setCurrentLanguage(language: string): void {
        this.currentLanguageSubject.next(language);
    }

    getCurrentLanguage(): string {
        return this.currentLanguageSubject.getValue();
    }
}
