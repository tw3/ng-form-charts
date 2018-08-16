import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserReportService {
  private readonly users: User[];

  constructor() {
    this.users = [];
  }

  addUser(newUser: User): Observable<void> {
    return new Observable<void>((observer) => {
      this.users.push(newUser);
      observer.next();
      observer.complete();
    });
  }

  // is this is a real app you'd have the other CRUD operations here
  // i.e. deleteUser(id), editUser(id), etc

  getUsers(): Observable<User[]> {
    return new Observable<User[]>((observer) => {
      observer.next(this.users);
      observer.complete();
    });
  }
}
