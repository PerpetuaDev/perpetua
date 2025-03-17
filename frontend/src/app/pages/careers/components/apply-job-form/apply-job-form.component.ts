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
  selectedFiles: File[] = [];
  fileNames: string[] = [];
  selectedCountryCode: string = '+64';
  countryCodes: { code: string; country: string }[] = [];

  routeOptions = [
    { label: 'Website', value: 'website' },
    { label: 'Social Media', value: 'social-media' },
    { label: 'Referral', value: 'referral' },
    { label: 'Job Board (Seek, J-Sen, etc.)', value: 'job-board' },
    { label: 'Other', value: 'other' }
  ];

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

  onCountryCodeInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let inputCode = inputElement.value.trim();

    if (!inputCode.startsWith('+')) {
      inputCode = '+' + inputCode;
      inputElement.value = inputCode;
    }

    const numericPart = inputCode.slice(1);

    if (numericPart.length === 0) {
      this.menuOpen = false;
      this.countryCodes = [];
      this.selectedFlagUrl = '../../../assets/images/no-flag.png';
      this.selectedCountryName = 'New Zealand';
      return;
    }

    // Filter country codes including input number anywhere
    this.countryCodes = this.flags
      .filter(flag => flag.country_code.slice(1).includes(numericPart))
      .map(flag => ({
        code: flag.country_code,
        country: flag.country
      }));

    this.menuOpen = this.countryCodes.length > 0;

    const exactMatch = this.countryCodes.find(country => country.code === inputCode);
    if (exactMatch) {
      this.selectedCountryCode = exactMatch.code;
      this.selectedFlagUrl = this.getFlagUrl(exactMatch.code);
      this.selectedCountryName = exactMatch.country;
    } else {
      this.selectedFlagUrl = '../../../assets/images/no-flag.png';
      this.selectedCountryName = 'New Zealand';
    }
  }

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
    this.countryCodes = [];
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

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newFiles: FileList | null = inputElement.files;

    if (newFiles && newFiles.length > 0) {
      const totalFiles = this.selectedFiles.length + newFiles.length;

      // Limit to maximum 4 files
      if (totalFiles > 4) {
        alert('You can upload a maximum of 4 files.');
        return;
      }

      Array.from(newFiles).forEach(file => {
        this.selectedFiles.push(file);
        this.fileNames.push(file.name);
      });

      this.contactForm.patchValue({
        file: this.selectedFiles
      });

      inputElement.value = '';
    }
  }


  deleteUploadedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.fileNames.splice(index, 1);
    this.contactForm.patchValue({
      file: this.selectedFiles
    });
  }

  handleDeleteFileOnKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.deleteUploadedFile(index);
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

    if (this.selectedFiles && this.selectedFiles.length > 0) {
      const attachments: any[] = [];

      const fileReadPromises = this.selectedFiles.map((file) => {
        return new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const fileBase64 = reader.result as string;
            attachments.push({
              content: fileBase64.split(',')[1], // Remove data prefix
              filename: file.name,
              type: file.type,
              disposition: 'attachment',
            });
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReadPromises).then(() => {
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
              this.selectedFiles = [];
              this.fileNames = [];
            },
            (error) => {
              console.error('FAILED...', error);
              this.showMessage(false);
              this.formSubmitted = false;
            }
          );
      })
        .catch((error) => {
          console.error('Error reading files: ', error);
          this.formSubmitted = false;
        });
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
