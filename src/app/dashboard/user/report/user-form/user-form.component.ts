import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormState } from '../../../../shared/enums/form-state.enum';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {
  @Output() userSaved: EventEmitter<User> = new EventEmitter<User>();

  formGroup: FormGroup;
  isFormValid: boolean;

  friendInputControl: AbstractControl;
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  fruits: string[] = ['Lemon'];
  fruitAutocompleteOptions: Observable<string[]>;

  @ViewChild('formElem') formElem: HTMLFormElement;
  @ViewChild('fruitInput') fruitInput: ElementRef;

  private formState: FormState;
  private valueChangeSub: Subscription;
  private statusChangeSub: Subscription;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService) {
  }

  get isReady(): boolean {
    return this.formState === FormState.READY;
  }

  get isSaving(): boolean {
    return this.formState === FormState.SAVING;
  }

  get isSaved(): boolean {
    return this.formState === FormState.SAVED;
  }

  get isError(): boolean {
    return this.formState === FormState.ERROR;
  }

  get availableFruits(): string[] {
    return this.allFruits
      .filter((fruit: string) => {
        const isNotAlreadyChosen: boolean = !this.fruits.includes(fruit);
        console.log('fruit', fruit, ' isNotAlreadyChosen', isNotAlreadyChosen);
        return isNotAlreadyChosen;
      });
  }


  ngOnInit(): void {
    this.formState = FormState.READY;
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.destroyForm();
  }

  addRandomUserData(): void {
    this.formGroup.patchValue({
      name: this.stringGen(),
      age: this.getRandomInt(1, 100),
      weight: this.getRandomInt(8, 400),
      friendInput: ''
    });
    // TODO: Update this.friends
    // this.save();
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }

    // get the new user object from the form
    const newUser: User = this.formGroup.value as User;

    // emit the new user
    this.userSaved.emit(newUser);
  }

  setFormState(formState: FormState, message?: string): void {
    this.formState = formState;

    // enable/disable form
    if (this.formState === FormState.SAVING) {
      this.formGroup.disable();
      return;
    }
    this.formGroup.enable();

    // show a notification and reset if appropriate
    if (this.formState === FormState.SAVED) {
      this.notificationService.showSuccessToast('User saved');
      this.resetForm();
    } else if (this.formState === FormState.ERROR) {
      if (!message) {
        message = 'Cannot save user';
      }
      this.notificationService.showErrorToast(message);
    }
  }

  resetForm(evt?: Event): void {
    this.formElem.resetForm();
    this.formGroup.markAsUntouched();
    const hasEvent: boolean = !!evt;
    if (hasEvent) {
      evt.preventDefault();
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.friendInputControl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.friendInputControl.setValue(null);
  }

  private buildForm(): void {
    const formBuildConfig: AnyHash = this.getFormBuilderConfig();
    this.formGroup = this.formBuilder.group(formBuildConfig);
    this.friendInputControl = this.formGroup.controls['friendInput'];
    this.fruitAutocompleteOptions = this.friendInputControl.valueChanges.pipe(
      startWith(null),
      map((friendInputText: string | null) => {
        const result = friendInputText ?
          this._filterFruits(friendInputText) :
          this.availableFruits.slice();
        console.log('result', result);
        return result;
      })
    );
    this.valueChangeSub = this.formGroup.valueChanges
      .subscribe(this.onFormGroupValueChanged.bind(this));
    this.statusChangeSub = this.formGroup.statusChanges
      .subscribe(this.onFormGroupStatusChanged.bind(this));
    this.updateIsFormValid();
  }

  private getFormBuilderConfig(): AnyHash {
    const formBuilderConfig: AnyHash = {
      name: ['', [Validators.required]],
      age: ['',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.pattern('\^[0-9]+$'),
          Validators.maxLength(3)
        ])
      ],
      weight: ['',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.pattern('\^[0-9]+$'),
          Validators.maxLength(3)
        ])
      ],
      friendInput: ['']
    };
    return formBuilderConfig;
  }

  private _filterFruits(inputText: string): string[] {
    inputText = inputText.toLowerCase();
    return this.availableFruits
      .filter((fruit: string) => {
        const isOptionMatch: boolean = (fruit.toLowerCase().indexOf(inputText) === 0);
        return isOptionMatch;
      });
  }

  private onFormGroupValueChanged(): void {
  }

  private onFormGroupStatusChanged(status: string): void {
    this.updateIsFormValid();
  }

  private updateIsFormValid(): void {
    this.isFormValid = this.isControlGood(this.formGroup);
  }

  private isControlGood(c: AbstractControl): boolean {
    return !c.invalid && !c.pending;
  }

  private destroyForm(): void {
    if (this.valueChangeSub) {
      this.valueChangeSub.unsubscribe();
    }
    if (this.statusChangeSub) {
      this.statusChangeSub.unsubscribe();
    }
    this.formGroup = null;
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private stringGen(): string {
    const len: number = this.getRandomInt(3, 8);
    let text: string = '';

    const charset: string = 'abcdefghijklmnopqrstuvwxyz';

    for (let i: number = 0; i < len; i++) {
      let randomChar: string = charset.charAt(Math.floor(Math.random() * charset.length));
      if (i === 0) {
        randomChar = randomChar.toUpperCase();
      }
      text += randomChar;
    }

    return text;
  }

}
