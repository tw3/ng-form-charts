import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';

import { BubbleChartDataPoint } from '../../../shared/chart-cards/bubble-chart/bubble-chart-data-point.model';
import { HorizontalBarChartDataPoint } from '../../../shared/chart-cards/horizontal-bar-chart/horizontal-bar-chart-data-point.model';
import { FormState } from '../../../shared/enums/form-state.enum';
import { User } from '../shared/models/user.model';

import { UserFormComponent } from './user-form/user-form.component';
import { UserReportService } from './user-report.service';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {
  @ViewChild('userForm') userForm: UserFormComponent;
  userAgeResults: HorizontalBarChartDataPoint[];
  userWeightResults: HorizontalBarChartDataPoint[];
  ageWeightResults: BubbleChartDataPoint[];

  allFriendNames: string[];

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

  ngOnInit(): void {
    // Let the form know we are loading
    this.userForm.setFormState(FormState.LOADING);
    this.userReportService.getUsers()
      .pipe(
        map((users: User[]) => users.map((user: User) => user.name))
      )
      .subscribe((names: string[]) => {
        this.allFriendNames = names;
        this.userForm.setFormState(FormState.READY);
      });
  }

  // get allFriendNames(): Observable<User[]> {
  //   return this.userReportService.getUsers();
  // }

  onUserSaved(newUser: User): void {
    // Let the form know we are saving
    this.userForm.setFormState(FormState.SAVING);

    // Add the user
    this.userReportService.addUser(newUser)
      .subscribe(
        this.handleAddUserSuccess.bind(this),
        this.handleAddUserError.bind(this)
      );
  }

  private handleAddUserSuccess(): void {
    // Let the form know the user is saved
    this.userForm.setFormState(FormState.SAVED);

    // Get all of the users
    this.userReportService.getUsers()
      .subscribe(
        this.handleGetUsersSuccess.bind(this),
        this.handleGetUsersError.bind(this)
      );
  }

  private handleAddUserError(error: Error): void {
    // Let the form of the error
    const errorMessage: string = error.message;
    this.userForm.setFormState(FormState.ERROR, errorMessage);
  }

  private handleGetUsersSuccess(users: User[]): void {
    // Update allFriendNames
    this.allFriendNames = users.map((user: User) => user.name);
    // Convert users into results
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
      this.ageWeightResults.push({
        name: user.name,
        series: [
          {
            name: '',
            x: user.age,
            y: user.weight,
            r: user.friendNames.length
          }
        ]
      });

    });
  }

  private handleGetUsersError(error: Error): void {
    // Let the form of the error
    const errorMessage: string = error.message;
    this.userForm.setFormState(FormState.ERROR, errorMessage);
  }

}
