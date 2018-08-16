import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBarChartComponent } from './user-bar-chart.component';

describe('UserBarChartComponent', () => {
  let component: UserBarChartComponent;
  let fixture: ComponentFixture<UserBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
