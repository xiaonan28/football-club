import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Head2headComponent } from './head2head.component';

describe('Head2headComponent', () => {
  let component: Head2headComponent;
  let fixture: ComponentFixture<Head2headComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Head2headComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Head2headComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
