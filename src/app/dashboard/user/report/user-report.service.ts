import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { ForceDirectedGraph } from '../../../shared/chart-cards/force-directed-graph-chart/force-directed-graph.model';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserReportService {
  private readonly users: User[];
  private readonly friendsGraph: ForceDirectedGraph;

  constructor() {
    this.users = [];
    this.friendsGraph = {
      links: [],
      nodes: []
    };
    // this.friendsGraph = {
    //   links: [
    //     {
    //       source: {
    //         name: 'abc'
    //       },
    //       target: 'def'
    //     }
    //   ],
    //   nodes: [
    //     {
    //       value: 'abc'
    //     },
    //     {
    //       value: 'def'
    //     }
    //   ]
    // };
  }

  addUser(newUser: User): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      // This is where you'd normally have an httpClient.get() call, this timeout simulates it
      window.setTimeout(() => {
        const isDuplicate: boolean = this.isDuplicateUser(newUser);
        if (isDuplicate) {
          const message: string = `There is already a user with the name of '${newUser.name}'`;
          const error: Error = new Error(message);
          observer.error(error);
          return;
        }

        // Add new user to list of users
        this.users.push(newUser);

        // Add new user's name to the friendNames for his friends
        // This of course assumes that friendships are always bi-directional
        // which is not always the case in reality haha
        newUser.friendNames.forEach((friendName: string) => {
          const friendUser: User = this.getUserByName(friendName);
          friendUser.friendNames.push(newUser.name);
        });

        // Update friendsGraph
        newUser.friendNames.forEach((friendName: string) => {
          const newGraphLink: any = {
            source: {
              name: newUser.name
            },
            target: friendName
          };
          this.friendsGraph.links.push(newGraphLink);
        });
        this.friendsGraph.nodes.push({
          value: newUser.name
        });

        // Trigger next() and complete()
        observer.next(undefined);
        observer.complete();
      }, 1000);
    });
  }

  // If this was a real app you'd have the other CRUD operations here
  // i.e. deleteUser(id), editUser(id), etc

  getUsers(): Observable<User[]> {
    return new Observable<User[]>((observer: Observer<User[]>) => {
      // This is where you'd normally have an httpClient.get() call, this timeout simulates it
      window.setTimeout(() => {
        observer.next(this.users);
        observer.complete();
      }, 1000);
    });
  }

  getFriendsGraph(): Observable<ForceDirectedGraph> {
    return new Observable<ForceDirectedGraph>((observer: Observer<ForceDirectedGraph>) => {
      // This is where you'd normally have an httpClient.get() call, this timeout simulates it
      window.setTimeout(() => {
        observer.next(this.friendsGraph);
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

  private getUserByName(name: string): User {
    const matchingUser: User = this.users.find((user: User): boolean => user.name === name);
    return matchingUser;
  }
}
