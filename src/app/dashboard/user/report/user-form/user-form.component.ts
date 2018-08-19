import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { FormState } from '../../../../shared/enums/form-state.enum';
import { NotificationService } from '../../../../shared/notification.service';
import { getRandomArraySubset, getRandomInt, stringGen } from '../../../../shared/util/random_util_functions';

interface FormUser {
  name: string;
  age: number;
  weight: number;
  friendNameInput: string;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() allFriendNames: string[];
  @Output() userSaved: EventEmitter<User> = new EventEmitter<User>();

  formGroup: FormGroup;
  isFormValid: boolean;

  userFriendNames: string[] = [];
  friendNameInputControl: AbstractControl;
  friendNameAutocompleteOptions: string[];

  @ViewChild('formElem') formElem: HTMLFormElement;
  @ViewChild('friendNameInput') friendNameInputElem: ElementRef;

  private formState: FormState;
  private friendNameInputControlValueChangeSub: Subscription;
  private formGroupValueChangeSub: Subscription;
  private formGroupStatusChangeSub: Subscription;

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

  get friendsExist(): boolean {
    return (this.allFriendNames != null) && this.allFriendNames.length > 0;
  }

  get availableFriendNames(): string[] {
    if (this.allFriendNames == null) {
      return [];
    }
    return this.allFriendNames
      .filter((friendName: string) => {
        const isUserFriend: boolean = this.userFriendNames.includes(friendName);
        return !isUserFriend;
      });
  }

  ngOnInit(): void {
    this.formState = FormState.READY;
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.formGroup || !changes.hasOwnProperty('allFriendNames')) {
      return;
    }
    if (this.friendsExist) {
      this.formGroup.controls['friendNameInput'].enable();
    } else {
      this.formGroup.controls['friendNameInput'].disable();
    }
  }

  ngOnDestroy(): void {
    this.destroyForm();
  }

  addRandomUserData(): void {
    this.formGroup.patchValue({
      name: stringGen(),
      age: getRandomInt(1, 100),
      weight: getRandomInt(8, 400),
      friendNameInput: ''
    });
    this.userFriendNames = getRandomArraySubset(this.allFriendNames);
    this.save();
  }

  removeUserFriend(userFriendName: string): void {
    const idx: number = this.userFriendNames.indexOf(userFriendName);
    if (idx >= 0) {
      this.userFriendNames.splice(idx, 1);
    }
    this.onFriendNameValueChanged();
    this.friendNameInputElem.nativeElement.focus();
  }

  onAvailableFriendSelected(event: MatAutocompleteSelectedEvent): void {
    // Add friendName to userFriendNames
    const friendName: string = event.option.viewValue;
    this.userFriendNames.push(friendName);
    // Reset state
    this.friendNameInputElem.nativeElement.value = '';
    this.friendNameInputControl.setValue(null);
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }

    // Get the new user object from the form
    const formUser: FormUser = this.formGroup.value as FormUser;
    const newUser: User = {
      name: formUser.name,
      age: formUser.age,
      weight: formUser.weight,
      friendNames: this.userFriendNames
    };

    // Emit the new user
    this.userSaved.emit(newUser);
  }

  setFormState(formState: FormState, message?: string): void {
    this.formState = formState;

    // Enable/disable form
    if (this.formGroup) {
      if (this.formState === FormState.SAVING) {
        this.formGroup.disable();
        return;
      }
      this.formGroup.enable();
    }

    // Show a notification and reset the form if appropriate
    if (this.formState === FormState.SAVED) {
      if (!message) {
        message = 'User saved';
      }
      this.notificationService.showSuccessToast(message);
      this.resetForm();
    } else if (this.formState === FormState.ERROR) {
      if (!message) {
        message = 'Cannot save user';
      }
      this.notificationService.showErrorToast(message);
    }
  }

  resetForm(evt?: Event): void {
    this.userFriendNames = [];
    this.formElem.resetForm();
    this.formGroup.markAsUntouched();
    const hasEvent: boolean = !!evt;
    if (hasEvent) {
      evt.preventDefault();
    }
  }

  private buildForm(): void {
    // Get the config use it to build the form
    const formBuildConfig: AnyHash = this.getFormBuilderConfig();
    this.formGroup = this.formBuilder.group(formBuildConfig);

    // Save the friendNameInputControl and handle its value changes
    this.friendNameInputControl = this.formGroup.controls['friendNameInput'];
    this.friendNameInputControlValueChangeSub = this.friendNameInputControl.valueChanges
      .subscribe(this.onFriendNameValueChanged.bind(this));
    this.onFriendNameValueChanged();

    // Handle value and status changes for the form
    this.formGroupValueChangeSub = this.formGroup.valueChanges
      .subscribe(this.onFormGroupValueChanged.bind(this));
    this.formGroupStatusChangeSub = this.formGroup.statusChanges
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
      friendNameInput: [{ value: '', 'disabled': !this.friendsExist }]
    };
    return formBuilderConfig;
  }

  private onFriendNameValueChanged(friendNameInputText?: string): void {
    if (friendNameInputText === undefined) {
      friendNameInputText = this.friendNameInputElem.nativeElement.value;
    }
    this.friendNameAutocompleteOptions = friendNameInputText ?
      this.getMatchingAvailableFriendNames(friendNameInputText) :
      this.availableFriendNames.slice();
  }

  private getMatchingAvailableFriendNames(inputText: string): string[] {
    inputText = inputText.toLowerCase();
    return this.availableFriendNames
      .filter((availableFriendName: string) => {
        availableFriendName = availableFriendName.toLowerCase();
        const isOptionMatch: boolean = availableFriendName.startsWith(inputText);
        return isOptionMatch;
      });
  }

  private onFormGroupValueChanged(): void {
  }

  private onFormGroupStatusChanged(status: string): void {
    this.updateIsFormValid();
  }

  private updateIsFormValid(): void {
    this.isFormValid = this.isControlValid(this.formGroup);
  }

  private isControlValid(c: AbstractControl): boolean {
    return !c.invalid && !c.pending;
  }

  private destroyForm(): void {
    if (this.friendNameInputControlValueChangeSub) {
      this.friendNameInputControlValueChangeSub.unsubscribe();
    }
    if (this.formGroupValueChangeSub) {
      this.formGroupValueChangeSub.unsubscribe();
    }
    if (this.formGroupStatusChangeSub) {
      this.formGroupStatusChangeSub.unsubscribe();
    }
    this.formGroup = null;
  }

}
