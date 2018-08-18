import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleChartCardComponent } from './bubble-chart-card.component';

describe('BubbleChartCardComponent', () => {
  let component: BubbleChartCardComponent;
  let fixture: ComponentFixture<BubbleChartCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleChartCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
