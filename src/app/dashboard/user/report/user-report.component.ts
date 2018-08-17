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
  results: ChartDataPoint[];

  constructor(private userReportService: UserReportService) {
  }

  ngOnInit() {
  }

  get hasResults(): boolean {
    return !!this.results;
  }

  onUserSaved(newUser: User) {
    // let the form know we are saving
    this.userForm.setFormState(FormState.SAVING);

    // add the user
    this.userReportService.addUser(newUser)
      .subscribe(
        this.handleAddUserSuccess.bind(this),
        this.handleAddUserError.bind(this)
      );
  }

  private handleAddUserSuccess(): void {
    // let the form know the user is saved
    this.userForm.setFormState(FormState.SAVED);

    // get all of the users
    this.userReportService.getUsers()
      .subscribe(
        this.handleGetUsersSuccess.bind(this),
        this.handleGetUsersError.bind(this)
      );

    // this.results = dummyResults;
  }

  private handleAddUserError(error: Error): void {
    // let the form of the error
    const errorMessage: string = error.message;
    this.userForm.setFormState(FormState.ERROR, errorMessage);
  }

  private handleGetUsersSuccess(users: User[]): void {
    // convert users into results
    this.results = users.map((user: User) => {
      const newResult: ChartDataPoint = {
        name: user.name,
        value: user.age
      };
      return newResult;
    });
  }

  private handleGetUsersError(error: Error): void {
    // let the form of the error
    const errorMessage: string = error.message;
    this.userForm.setFormState(FormState.ERROR, errorMessage);
  }

}
