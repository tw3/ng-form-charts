import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalBarChartCardComponent } from './horizontal-bar-chart-card.component';

describe('HorizontalBarChartCardComponent', () => {
  let component: HorizontalBarChartCardComponent;
  let fixture: ComponentFixture<HorizontalBarChartCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalBarChartCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalBarChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
