import { Component, ViewChild } from '@angular/core';

import { FormState } from '../../../shared/enums/form-state.enum';

import { UserFormComponent } from './user-form/user-form.component';
import { UserReportService } from './user-report.service';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent {
  @ViewChild('userForm') userForm: UserFormComponent;
  userAgeResults: HorizontalBarChartDataPoint[];
  userWeightResults: HorizontalBarChartDataPoint[];
  ageWeightResults: BubbleChartDataPoint[];

  constructor(private userReportService: UserReportService) {
  }

  get hasUserAgeResults(): boolean {
    return !!this.userAgeResults && this.userAgeResults.length > 0;
  }

  get hasUserWeightResults(): boolean {
    return !!this.userWeightResults && this.userWeightResults.length > 0;
  }

  get hasAgeWeightResults(): boolean {
    return !!this.ageWeightResults && this.ageWeightResults.length > 0;
}

  onUserSaved(newUser: User): void {
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
  }

  private handleAddUserError(error: Error): void {
    // let the form of the error
    const errorMessage: string = error.message;
    this.userForm.setFormState(FormState.ERROR, errorMessage);
  }

  private handleGetUsersSuccess(users: User[]): void {
    // convert users into results
    this.userAgeResults = [];
    this.userWeightResults = [];
    this.ageWeightResults = [];
    users.forEach((user: User) => {
      this.userAgeResults.push({
        name: user.name,
        value: user.age
      });
      this.userWeightResults.push({
        name: user.name,
        value: user.weight
      });
      // TODO: Set the radius as the number of friends
      this.ageWeightResults.push({
        name: user.name,
        series: [
          {
            name: '',
            x: user.age,
            y: user.weight
          }
        ]
      });

    });
  }

  private handleGetUsersError(error: Error): void {
    // let the form of the error
    const errorMessage: string = error.message;
    this.userForm.setFormState(FormState.ERROR, errorMessage);
  }

}
