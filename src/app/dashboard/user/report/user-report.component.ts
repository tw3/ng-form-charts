import { Component, OnInit, ViewChild } from '@angular/core';

import { FormState } from '../../../shared/enums/form-state.enum';
import { NotificationService } from '../../../shared/notification.service';

import { dummyResults } from './dummy-data';
import { UserFormComponent } from './user-form/user-form.component';
import { UserReportService } from './user-report.service';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {
  @ViewChild('userForm') userForm: UserFormComponent;
  results: ChartDataPointModel[];

  constructor(private userReportService: UserReportService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  get hasResults(): boolean {
    return !!this.results;
  }

  onUserSaved(newUser: User) {
    this.userForm.setFormState(FormState.SAVING);
    this.userReportService.addUser(newUser)
      .subscribe(
        this.handleAddUserSuccess.bind(this),
        this.handleAddUserError.bind(this)
      );
  }

  private handleAddUserSuccess(): void {
    // let the form know we are done
    this.userForm.setFormState(FormState.SAVED);

    // fetch the new results
    this.results = dummyResults;
  }

  private handleAddUserError(error: Error): void {
    // let the form of the error
    const errorMessage: string = error.message;
    this.userForm.setFormState(FormState.ERROR, errorMessage);
  }

}
