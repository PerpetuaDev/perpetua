// Libraries
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
// Components
// Services
import { StrapiService } from '../../../../api/strapi.service';
import { APIResponseModel, IFlag } from '../../../../../util/interfaces';
import { LanguageService } from '../../../../shared/language.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-apply-job-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './apply-job-form.component.html',
  styleUrl: './apply-job-form.component.scss'
})
export class ApplyJobFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('file') fileUploadInput!: ElementRef;
  @ViewChild('dropdownButton') dropdownButton!: ElementRef;
  @ViewChild('dropdownList') dropdownList!: ElementRef;
  @ViewChild('countryDropdown') countryDropdown!: ElementRef;
  @ViewChild('routeDropdown') routeDropdown!: ElementRef;
  officeImage: string | null = '../../../assets/images/img_n.a.png';
  selectedLocation: string | null = 'christchurch';
  selectedContactInfo: any = null;
  flags: IFlag[] = [];
  selectedFlagUrl: string | null = '';
  selectedCountryName: string = 'New Zealand';
  contactForm: FormGroup;
  formSubmitted: boolean = false;
  private intervalId: any;
  private timeoutId: any;
  currentLanguage: string = 'en';
  private langChangeSubscription!: Subscription;
  selectedOption: string | null = null;
  dropdownOpen: boolean = false;
  menuOpen: boolean = false;
  fileInput!: HTMLInputElement;
  fileName: any = '';
  selectedCountryCode: string = '+64';

  routeOptions = [
    { label: 'Website', value: 'website' },
    { label: 'Social Media', value: 'social-media' },
    { label: 'Referral', value: 'referral' },
    { label: 'Job Board (Seek, J-Sen, etc.)', value: 'job-board' },
    { label: 'Other', value: 'other' }
  ];

  countryCodes = [
    { code: '+64', country: 'New Zealand' },
    { code: '+61', country: 'Australia' },
    { code: '+81', country: 'Japan' }
  ]

  constructor(
    private route: ActivatedRoute,
    private strapiService: StrapiService,
    private languageService: LanguageService,
    private fb: FormBuilder,
  ) {
    this.contactForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      route: ['', Validators.required],
      country_code: ['+64'],
      phone: [''],
      portfolio: ['', Validators.required],
      file: ['']
    });
  }

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.langChangeSubscription = this.languageService.currentLanguage$.subscribe(
      (lang) => {
        this.currentLanguage = lang;
      }
    );

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
  }

  ngAfterViewInit(): void {
    // Ensure @ViewChild references are available after the view is initialized
    if (this.fileUploadInput && this.countryDropdown && this.dropdownList && this.routeDropdown) {
      this.fileInput = this.fileUploadInput.nativeElement;
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
    document.removeEventListener('click', this.handleClickOutside.bind(this));
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

  // @HostListener('document:click', ['$event'])
  // handleClickOutside(event: MouseEvent) {
  //   if (
  //     this.dropdownButton &&
  //     !this.dropdownButton.nativeElement.contains(event.target) &&
  //     this.dropdownList &&
  //     !this.dropdownList.nativeElement.contains(event.target)
  //   ) {
  //     this.dropdownOpen = false;
  //   }
  // }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const targetElement = event.target as Node;

    // Close the route dropdown if clicking outside
    if (
      this.dropdownOpen &&
      this.routeDropdown &&
      !this.routeDropdown.nativeElement.contains(targetElement)
    ) {
      this.dropdownOpen = false;
    }

    if (this.menuOpen && this.countryDropdown && !this.countryDropdown.nativeElement.contains(event.target as Node)) {
      this.menuOpen = false;
    }
  }

  onPhoneInputFocus(): void {
    this.menuOpen = false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
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
    this.dropdownOpen = false;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
      this.contactForm.patchValue({
        file: file
      });
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

    const fileInput = this.contactForm.get('file')?.value;
    if (fileInput) {
      const reader = new FileReader();
      reader.readAsDataURL(fileInput);

      reader.onload = () => {
        const fileBase64 = reader.result as string;

        const attachments = [
          {
            content: fileBase64.split(',')[1], // Extract the base64 part (without the "data:..." prefix)
            filename: fileInput.name,
            type: fileInput.type,
            disposition: 'attachment',
          }
        ];

        emailjs.send(
          environment.applyJobEmailjsServiceId,
          environment.applyJobEmailTemplateId,
          {
            ...this.contactForm.value,
            attachments: attachments,
          },
          { publicKey: environment.emailjsPublicKey }
        )
          .then(
            () => {
              this.showMessage(true);
              this.contactForm.reset({
                country_code: '+64',
              });
              this.formSubmitted = false;
              this.selectedOption = null;
              this.fileName = '';
            },
            (error) => {
              console.error('FAILED...', error);
              this.showMessage(false);
              this.formSubmitted = false;
            }
          );
      };

      reader.onerror = (error) => {
        console.error('Error reading file: ', error);
        this.formSubmitted = false;
      };
    }
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
}
