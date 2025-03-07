// Libraries
import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
// Components
import { LocationCardComponent } from '../about/components/location-card/location-card.component';
import { ContactData } from './contact-data';
// Services
import { StrapiService } from '../../api/strapi.service';
import { IOffice, APIResponseModel, IFlag } from '../../../util/interfaces';
import { LanguageService } from '../../shared/language.service';
import { environment } from '../../../environments/environment.development';
import { OfficeService } from '../../shared/office.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    LocationCardComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})

export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('messageTextarea') messageTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('countryDropdown') countryDropdown!: ElementRef;
  @ViewChild('routeDropdown') routeDropdown!: ElementRef;
  offices$: Observable<IOffice[]>;
  officeImage: string | null = '../../../assets/images/img_n.a.png';
  contactData = ContactData;
  selectedLocation: string | null = 'christchurch';
  selectedContactInfo: any = null;
  flags: IFlag[] = [];
  selectedFlagUrl: string | null = '';
  selectedCountryName: string = 'New Zealand';
  selectedOption: string | null = null;
  contactForm: FormGroup;
  formSubmitted: boolean = false;
  private intervalId: any;
  private timeoutId: any;
  currentLanguage: string = 'en';
  menuOpen: boolean = false;
  selectedCountryCode: string = '+64';
  private langChangeSubscription!: Subscription;

  countryCodes = [
    { code: '+64', country: 'New Zealand' },
    { code: '+61', country: 'Australia' },
    { code: '+81', country: 'Japan' }
  ]

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private route: ActivatedRoute,
    private strapiService: StrapiService,
    // private translationHelper: TranslationHelper,
    private languageService: LanguageService,
    private officeService: OfficeService,
    private fb: FormBuilder,
  ) {
    // this.currentLanguage = this.translationHelper.getCurrentLanguage();
    this.offices$ = this.officeService.offices$;
    this.contactForm = this.fb.group({
      full_name: ['', Validators.required],
      company: [''],
      email: ['', [Validators.required, Validators.email]],
      country_code: ['+64'],
      phone: [''],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Contact - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Browse Contact to get in touch with us at Perpetua.' });

    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });

    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.langChangeSubscription = this.languageService.currentLanguage$.subscribe(
      (lang) => {
        this.currentLanguage = lang;
      }
    );

    this.selectedLocation = 'Christchurch';
    this.selectedContactInfo = this.contactData.find(data => data.location === 'Christchurch');
    this.offices$.subscribe((offices: IOffice[]) => {
      const matchingOffice = offices.find(office => office.office_location === this.selectedLocation);
      if (matchingOffice) {
        this.officeImage = matchingOffice.office_image.url;
      } else {
        this.officeImage = '../../../assets/images/img_n.a.png';
      }
    });


    this.strapiService.getAllFlags().subscribe((response: APIResponseModel) => {
      this.flags = response.data.map((flag: IFlag) => ({
        ...flag,
        flag_image: {
          ...flag.flag_image,
          url: flag.flag_image && flag.flag_image.url
            ? flag.flag_image.url
            : "../../../assets/images/no-flag.png"
        }
      }));
      this.setDefaultFlag('+64');
    });

    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.scrollToSection(fragment);
      }
    });

    setTimeout(() => {
      if (this.messageTextarea) {
        this.autoResize(this.messageTextarea.nativeElement);
      }
    });
  }

  ngAfterViewInit(): void {
    // Ensure @ViewChild references are available after the view is initialized
    if (this.countryDropdown && this.routeDropdown) {
      document.addEventListener('click', this.handleClickOutside.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  setDefaultFlag(defaultCode: string): void {
    const matchingFlag = this.flags.find(flag => flag.country_code === defaultCode);
    if (matchingFlag) {
      this.selectedFlagUrl = matchingFlag.flag_image.url;
      this.selectedCountryName = matchingFlag.country;
    } else {
      this.selectedFlagUrl = '../../../assets/images/no-flag.png';
      this.selectedCountryName = 'New Zealand';
    }
  }

  // onCountryCodeInput(event: Event): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   let inputCode = inputElement.value.trim();

  //   if (!inputCode.startsWith('+')) {
  //     inputCode = '+' + inputCode;
  //     inputElement.value = inputCode;
  //   }

  //   const matchingFlag = this.flags.find(flag => flag.country_code === inputCode);

  //   if (matchingFlag) {
  //     this.selectedFlagUrl = matchingFlag.flag_image.url;
  //     this.selectedCountryName = matchingFlag.country;
  //   } else {
  //     this.selectedFlagUrl = '../../../assets/images/no-flag.png';
  //     this.selectedCountryName = 'New Zealand';
  //   }
  // }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const targetElement = event.target as Node;

    if (this.menuOpen && this.countryDropdown && !this.countryDropdown.nativeElement.contains(event.target as Node)) {
      this.menuOpen = false;
    }
  }

  onPhoneInputFocus(): void {
    this.menuOpen = false;
  }

  toggleCountryDropdown(): void {
    this.menuOpen = !this.menuOpen;
  }

  handleCountryDropdownKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleCountryDropdown();
    }
  }

  onToggleOptionKeyDown(option: any, event: KeyboardEvent) {
    event.preventDefault();
    this.selectOption(option);
  }

  handleCountryDropdownOptionKeyDown(event: KeyboardEvent, country: any): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onSelectCode(country);
    }
  }

  onSelectCode(selectedCountry: any): void {
    this.selectedCountryCode = selectedCountry.code;
    this.selectedFlagUrl = this.getFlagUrl(selectedCountry.code);
    this.selectedCountryName = selectedCountry.country;
    this.contactForm.patchValue({ country_code: selectedCountry.code });
    this.menuOpen = false;
  }

  getFlagUrl(countryCode: string): string {
    const matchingFlag = this.flags.find(flag => flag.country_code === countryCode);
    return matchingFlag ? matchingFlag.flag_image.url : '../../../assets/images/no-flag.png';
  }

  selectOption(option: any) {
    this.selectedOption = option.label;
    this.contactForm.patchValue({ route: option.value });
  }


  onLocationClick(location: string): void {
    this.selectedLocation = location;
    this.selectedContactInfo = this.contactData.find(data => data.location.toLowerCase() === location.toLowerCase()) || null;
    this.offices$.subscribe((offices: IOffice[]) => {
      const matchingOffice = offices.find(office => office.office_location === this.selectedLocation);
      if (matchingOffice) {
        this.officeImage = matchingOffice.office_image.url;
      } else {
        this.officeImage = '../../../assets/images/img_n.a.png';
      }
    });
  }

  onLocationKeydown(event: KeyboardEvent, location: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onLocationClick(location);
    }
  }

  autoResize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    if (textarea.value.trim() === '') {
      textarea.style.height = '38px';
      textarea.classList.remove('first-line');
    } else {
      textarea.style.height = '38px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  sendEmail(email: string): void {
    if (email) {
      const mailtoLink = `mailto:${email}`;
      window.location.href = mailtoLink;
    }
  }

  sendEmailKeyDown(event: KeyboardEvent, email: string): void {
    if ((event.key === 'Enter' || event.key === ' ') && email) {
      event.preventDefault();
      this.sendEmail(email);
    }
  }

  public sendMessage() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.formSubmitted = true;

    emailjs.send(
      environment.emailjsServiceId,
      environment.emailjsTemplateId,
      this.contactForm.value,
      { publicKey: environment.emailjsPublicKey }
    )
      .then(
        () => {
          this.showMessage(true);
          this.contactForm.reset({
            country_code: '+64'
          });
          this.formSubmitted = false;
          setTimeout(() => {
            if (this.messageTextarea) {
              this.autoResize(this.messageTextarea.nativeElement);
            }
          }, 0);
        },
        (error) => {
          console.error('FAILED...', (error as EmailJSResponseStatus).text);
          this.showMessage(false);
          this.formSubmitted = false;
        }
      );
  }

  showMessage(success: boolean): void {
    const successMessage = document.querySelector('.success-msg') as HTMLElement;
    const errorMessage = document.querySelector('.error-msg') as HTMLElement;

    if (success) {
      successMessage.classList.add('visible');
    } else {
      errorMessage.classList.add('visible');
    }

    setTimeout(() => {
      if (success) {
        successMessage.classList.remove('visible');
      } else {
        errorMessage.classList.remove('visible');
      }
    }, 5000);
  }

  scrollToSection(sectionId: string): void {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // element.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }
}