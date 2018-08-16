import { Component, OnInit, ViewChild } from '@angular/core';

import { UserFormComponent } from './user-form/user-form.component';
import { UserReportService } from './user-report.service';
import { FormState } from '../../../shared/enums/form-state.enum';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {
  @ViewChild('userForm') userForm: UserFormComponent;

  constructor(private userReportService: UserReportService) {
  }

  ngOnInit() {
  }

  onUserSaved(newUser: User) {
    console.log(newUser);
    this.userForm.setFormState(FormState.SAVING);
    this.userReportService.addUser(newUser)
      .subscribe(
        () => { // success
          // let the form know we are done
          this.userForm.setFormState(FormState.SAVED);
        },
        (error: Error) => {
          this.userForm.setFormState(FormState.ERROR);
          const errorMessage: string = error.message;
          // TODO: show the error message with a toastr message
          // e.g. this.toastr.toastr.error(errorMessage);
        }
      );
  }

}
