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
      // This is where you'd normally have an httpClient.get() call, this timeout simulates it
      window.setTimeout(() => {
        const isDuplicate: boolean = this.isDuplicateUser(newUser);
        if (isDuplicate) {
          const message: string = `There is already a user with the name of '${newUser.name}'`;
          const error: Error = new Error(message);
          observer.error(error);
          return;
        }
        this.users.push(newUser);
        observer.next();
        observer.complete();
      }, 1000);
    });
  }

  // If this was a real app you'd have the other CRUD operations here
  // i.e. deleteUser(id), editUser(id), etc

  getUsers(): Observable<User[]> {
    return new Observable<User[]>((observer) => {
      // This is where you'd normally have an httpClient.get() call, this timeout simulates it
      window.setTimeout(() => {
        observer.next(this.users);
        observer.complete();
      }, 1000);
    });
  }

  private isDuplicateUser(newUser: User): boolean {
    const isDuplicate: boolean = this.users.some((savedUser: User) => {
      return (savedUser.name === newUser.name);
    });
    return isDuplicate;
  }
}
