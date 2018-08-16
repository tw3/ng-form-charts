import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FormState } from '../../../../shared/enums/form-state.enum';
import { UserReportService } from '../user-report.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  isFormValid: boolean;

  @ViewChild('form') form;

  private formState: FormState;
  private valueChangeSub: Subscription;
  private statusChangeSub: Subscription;

  constructor(private formBuilder: FormBuilder,
              private userReportService: UserReportService) {
  }

  ngOnInit() {
    this.formState = FormState.READY;
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.destroyForm();
  }

  get isReady(): boolean { return this.formState === FormState.READY; }
  get isSaving(): boolean { return this.formState === FormState.SAVING; }
  get isSaved(): boolean { return this.formState === FormState.SAVED; }
  get isError(): boolean { return this.formState === FormState.ERROR; }

  save(): void {
    if (!this.isFormValid) {
      return;
    }

    // get the new user object
    const newUser: User = this.formGroup.value as User;

    // "add" the user
    this.formState = FormState.SAVING;
    this.userReportService.addUser(newUser)
      .subscribe(
        () => { // success
          this.formState = FormState.SAVED;
          this.resetForm();
        },
        (error: Error) => {
          this.formState = FormState.ERROR;
          const errorMessage: string = error.message;
          // this is where you'd show a toastr of the error
          // e.g. this.toastr.toastr.error(errorMessage);
        }
      );
  }

  resetForm(evt: Event = null): void {
    this.form.resetForm();
    // this.formGroup.markAsUntouched();
    this.formGroup.markAsUntouched();
    if (!!evt) {
      evt.preventDefault();
    }
  }

  private buildForm(): void {
    const formBuildConfig: AnyHash = this.getFormBuilderConfig();
    this.formGroup = this.formBuilder.group(formBuildConfig);
    this.valueChangeSub = this.formGroup.valueChanges
      .subscribe(this.onFormGroupValueChanged.bind(this));
    this.statusChangeSub = this.formGroup.statusChanges
      .subscribe(this.onFormGroupStatusChanged.bind(this));
    this.updateIsFormValid();
  }

  private getFormBuilderConfig(): AnyHash {
    // TODO: Verify numbers
    const formBuilderConfig: AnyHash = {
      name: ['a', [Validators.required]],
      friends: ['b', [Validators.required]],
      age: ['1',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.pattern('\^[0-9]+$'),
          Validators.maxLength(3)
        ])
        ],
      weight: ['2',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.pattern('\^[0-9]+$'),
          Validators.maxLength(3),
        ])
      ],
    };
    return formBuilderConfig;
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

}
