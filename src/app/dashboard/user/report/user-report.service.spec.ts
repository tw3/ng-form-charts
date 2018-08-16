import { TestBed, inject } from '@angular/core/testing';

import { UserReportService } from './user-report.service';

describe('UserReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserReportService]
    });
  });

  it('should be created', inject([UserReportService], (service: UserReportService) => {
    expect(service).toBeTruthy();
  }));
});
