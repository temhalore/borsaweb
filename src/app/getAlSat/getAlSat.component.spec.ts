/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GetAlSatComponent } from './getAlSat.component';

describe('GetAlSatComponent', () => {
  let component: GetAlSatComponent;
  let fixture: ComponentFixture<GetAlSatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetAlSatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAlSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
