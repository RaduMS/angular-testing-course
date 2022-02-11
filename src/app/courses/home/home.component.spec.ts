import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';
import {CoursesCardListComponent} from '../courses-card-list/courses-card-list.component';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let courseService: any;

  const beginnerCourses = setupCourses().filter(course => course.category == 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category == 'ADVANCED');

  // beforeEach( async (() => {
  beforeEach( waitForAsync (() => {

    const courseServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [{provide: CoursesService, useValue: courseServiceSpy}]
    })
      .compileComponents()
      .then(() => {

        fixture = TestBed.createComponent(HomeComponent);

        component = fixture.componentInstance;

        el = fixture.debugElement;

        courseService = TestBed.get(CoursesService);

      });
  }));

  it('should create the component', () => {

    expect(component).toBeTruthy();

  });


  it('should display only beginner courses', () => {

    courseService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs');



  });


  it('should display only advanced courses', () => {

    courseService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs');

  });


  it('should display both tabs', () => {

    courseService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Unexpected number of tabs');

  });


  it('should display advanced courses when tab clicked', (done: DoneFn) => {

    courseService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Errors tabs length is not 2');

    click(tabs[1]);

    fixture.detectChanges();

    setTimeout(() => {

      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      console.log(cardTitles.map(el => el.nativeElement.textContent));

      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');

      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

      done();

    }, 1000);

  });

  it('should display advanced courses when tab clicked - fakeAsync', fakeAsync(() => {

    courseService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Errors tabs length is not 2');

    click(tabs[1]);

    fixture.detectChanges();

    flush();

    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    console.log(cardTitles.map(el => el.nativeElement.textContent));

    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');

    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

  }));

  it('should display advanced courses when tab clicked - waitForAsync', waitForAsync(() => {

    courseService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Errors tabs length is not 2');

    click(tabs[1]);

    fixture.detectChanges();

    fixture.whenStable().then(() => {

      console.log('Called whenStable()');

      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      console.log(cardTitles.map(el => el.nativeElement.textContent));

      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');

      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

    });

  }));

});


