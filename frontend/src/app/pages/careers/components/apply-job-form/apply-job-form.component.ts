// Libraries
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
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
export class ApplyJobFormComponent implements OnInit, OnDestroy {
  @ViewChild('file') fileUploadInput!: ElementRef;
  @ViewChild('dropdownButton') dropdownButton!: ElementRef;
  @ViewChild('dropdownList') dropdownList!: ElementRef;

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
  fileInput!: HTMLInputElement;
  fileName: string = '';

  routeOptions = [
    { label: 'Website', value: 'website' },
    { label: 'Social Media', value: 'social-media' },
    { label: 'Referral', value: 'referral' },
    { label: 'Job Board', value: 'job-board' },
    { label: 'Other', value: 'other' }
  ];

  constructor(
    private route: ActivatedRoute,
    private strapiService: StrapiService,
    // private translationHelper: TranslationHelper,
    private languageService: LanguageService,
    private fb: FormBuilder,
  ) {
    // this.currentLanguage = this.translationHelper.getCurrentLanguage();
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

    this.fileInput = this.fileUploadInput.nativeElement;
    document.addEventListener('click', this.handleClickOutside.bind(this));
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

  onCountryCodeInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let inputCode = inputElement.value.trim();

    if (!inputCode.startsWith('+')) {
      inputCode = '+' + inputCode;
      inputElement.value = inputCode;
    }

    const matchingFlag = this.flags.find(flag => flag.country_code === inputCode);

    if (matchingFlag) {
      this.selectedFlagUrl = matchingFlag.flag_image.url;
      this.selectedCountryName = matchingFlag.country;
    } else {
      this.selectedFlagUrl = '../../../assets/images/no-flag.png';
      this.selectedCountryName = 'New Zealand';
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (
      this.dropdownButton &&
      !this.dropdownButton.nativeElement.contains(event.target) &&
      this.dropdownList &&
      !this.dropdownList.nativeElement.contains(event.target)
    ) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onToggleOptionKeyDown(option: any, event: KeyboardEvent) {
    event.preventDefault();
    this.selectOption(option);
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
}
