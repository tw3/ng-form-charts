import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  class MockMatSnackBar {
    open(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
      return undefined;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        {
          provide: MatSnackBar,
          useClass: MockMatSnackBar
        }
      ]
    });
  });

  it('should be created', inject([NotificationService], (service: NotificationService) => {
    expect(service).toBeTruthy();
  }));
});
