import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TranslationHelper {
    currentLanguage: string = 'en';
    private subscription: Subscription;

    constructor(private translate: TranslateService) {
        this.currentLanguage = this.translate.currentLang || this.translate.getDefaultLang();
        this.subscription = this.translate.onLangChange.subscribe(event => {
            this.currentLanguage = event.lang;
        });
    }

    getCurrentLanguage(): string {
        return this.currentLanguage;
    }

    // Avoid memory leaks when the component using this helper is destroyed.
    unsubscribe(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
