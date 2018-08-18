import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormState } from '../../../../shared/enums/form-state.enum';
import { NotificationService } from '../../../../shared/notification.service';
import { getRandomInt, stringGen } from '../../../../shared/util/util_functions';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {
  allFriends: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  @Output() userSaved: EventEmitter<User> = new EventEmitter<User>();

  formGroup: FormGroup;
  isFormValid: boolean;

  userFriends: string[] = [];
  friendInputControl: AbstractControl;
  friendAutocompleteOptions: Observable<string[]>;

  @ViewChild('formElem') formElem: HTMLFormElement;
  @ViewChild('friendInput') friendInputElem: ElementRef;

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

  get availableFriends(): string[] {
    return this.allFriends
      .filter((friend: string) => {
        const isUserFriend: boolean = this.userFriends.includes(friend);
        return !isUserFriend;
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
      name: stringGen(),
      age: getRandomInt(1, 100),
      weight: getRandomInt(8, 400),
      friendInput: ''
    });
    // TODO: Update this.friends
    // this.save();
  }

  removeUserFriend(userFriend: string): void {
    const userFriendIndex: number = this.userFriends.indexOf(userFriend);
    if (userFriendIndex >= 0) {
      this.userFriends.splice(userFriendIndex, 1);
    }
  }

  onAvailableFriendSelected(event: MatAutocompleteSelectedEvent): void {
    // Add friend to userFriends
    const friend: string = event.option.viewValue;
    this.userFriends.push(friend);
    // Reset state
    this.friendInputElem.nativeElement.value = '';
    this.friendInputControl.setValue(null);
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }

    // Get the new user object from the form
    const newUser: User = this.formGroup.value as User;

    // Emit the new user
    this.userSaved.emit(newUser);
  }

  setFormState(formState: FormState, message?: string): void {
    this.formState = formState;

    // Enable/disable form
    if (this.formState === FormState.SAVING) {
      this.formGroup.disable();
      return;
    }
    this.formGroup.enable();

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

    // Save the friendInput control and handle its value changes
    this.friendInputControl = this.formGroup.controls['friendInput'];

    this.friendAutocompleteOptions = this.friendInputControl.valueChanges.pipe(
      startWith(null),
      map((friendInputText: string | null) => {
        const autocompleteOptions: string[] = friendInputText ?
          this.getMatchingAvailableFriends(friendInputText) :
          this.availableFriends.slice();
        return autocompleteOptions;
      })
    );

    // Handle value and status changes for the form
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

  private getMatchingAvailableFriends(inputText: string): string[] {
    inputText = inputText.toLowerCase();
    return this.availableFriends
      .filter((availableFriend: string) => {
        availableFriend = availableFriend.toLowerCase();
        const isOptionMatch: boolean = availableFriend.startsWith(inputText);
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
    if (this.valueChangeSub) {
      this.valueChangeSub.unsubscribe();
    }
    if (this.statusChangeSub) {
      this.statusChangeSub.unsubscribe();
    }
    this.formGroup = null;
  }

}
