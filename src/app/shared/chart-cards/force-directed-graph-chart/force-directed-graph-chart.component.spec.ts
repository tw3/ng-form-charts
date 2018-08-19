import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceDirectedGraphChartComponent } from './force-directed-graph-chart.component';

describe('ForceDirectedGraphChartComponent', () => {
  let component: ForceDirectedGraphChartComponent;
  let fixture: ComponentFixture<ForceDirectedGraphChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceDirectedGraphChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceDirectedGraphChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
