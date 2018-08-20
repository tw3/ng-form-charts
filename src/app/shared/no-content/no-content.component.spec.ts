import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NoContentComponent } from './no-content.component';

describe('NoContentComponent', () => {
  let component: NoContentComponent;
  let fixture: ComponentFixture<NoContentComponent>;
  let h1Elem: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoContentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    h1Elem = fixture.debugElement.query(By.css('h1'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have proper h1 text', () => {
    expect(h1Elem.nativeElement.innerText).toContain('404: page missing');
  });
});
