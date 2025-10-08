import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, SecurityContext } from "@angular/core";
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule, TranslateLoader, provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideMarkdown, MARKED_OPTIONS } from 'ngx-markdown';

const firebaseConfig = {
  apiKey: "AIzaSyC8HUUtDyoqvp4aLix_4lrDe3eyVrKBvl8",
  authDomain: "perpetua-test.firebaseapp.com",
  projectId: "perpetua-test",
  storageBucket: "perpetua-test.firebasestorage.app",
  messagingSenderId: "340039899364",
  appId: "1:340039899364:web:f22bf87e49a5193c29b4f1",
  measurementId: "G-MQVR5MSX2D"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    importProvidersFrom([TranslateModule.forRoot({
      loader: provideTranslateHttpLoader({ prefix: "./assets/i18n/", suffix: ".json" }),
    })]),
    provideTranslateService({
      defaultLanguage: 'en'
    }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideMarkdown({
      loader: HttpClient,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          gfm: true,
          breaks: true,
          pedantic: false,
        },
      },
    }),
  ]
};
