import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES, findLessonsForCourse} from '../../../../server/db-data';
import {Course} from '../model/course';
import {HttpErrorResponse} from '@angular/common/http';

describe('CoursesService', () => {

  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    console.log('beforeEach for CoursesService');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('Should retrive all courses', () => {

    console.log('test findAllCourses method');

    coursesService.findAllCourses().subscribe((courses) => {

      expect(courses).toBeTruthy('No courses returned');

      expect(courses.length).toBe(12, 'Incorrect number of courses');

      const course = courses.find(curse => curse.id == 12);

      expect(course.titles.description).toBe('Angular Testing Course');

    });

    const request = httpTestingController.expectOne('/api/courses');

    expect(request.request.method).toBe('GET');

    request.flush({payload: Object.values(COURSES)});

    // httpTestingController.verify();
  });

  it('Should find course by id', () => {

    console.log('test findCourseById method');

    coursesService.findCourseById(12).subscribe((course) => {

      expect(course).toBeTruthy('No course returned');

      expect(course.id).toBe(12, 'Incorrect number of courses');

    });

    const request = httpTestingController.expectOne('/api/courses/12');

    expect(request.request.method).toBe('GET');

    request.flush(COURSES[12]);

    // httpTestingController.verify();
  });

  it('Should save the course data', () => {

    console.log('test saveCourse method');

    const changes: Partial<Course> = {
      titles: {
        description: 'Test course'
      }
    };

    coursesService.saveCourse(12, changes).subscribe((course) => {

      expect(course.id).toBe(12, 'Incorrect number of courses');

    });

    const request = httpTestingController.expectOne('/api/courses/12');

    expect(request.request.method).toBe('PUT');

    expect(request.request.body.titles.description).toBe(changes.titles.description);

    request.flush({
      ...COURSES[12],
      ...changes
    });

    // httpTestingController.verify();
  });

  it('Should give an error if save course have faild', () => {

    console.log('test saveCourse method');

    const changes: Partial<Course> = {
      titles: {
        description: 'Test course'
      }
    };

    coursesService.saveCourse(12, changes).subscribe(() => fail('The course save operation should have failed'),
      (error: HttpErrorResponse) => {

        expect(error.status).toBe(500);

      });

    const request = httpTestingController.expectOne('/api/courses/12');

    expect(request.request.method).toBe('PUT');

    request.flush('Save course faild', {
      status: 500,
      statusText: 'Internal server error'
    });

    // httpTestingController.verify();
  });

  it('It should find a list of lessons', () => {

    console.log('test findLessons method');

    coursesService.findLessons(12).subscribe((lessons) => {

      expect(lessons).toBeTruthy();

      expect(lessons.length).toBe(3, 'Incorrect number of lessons');

    });

    const request = httpTestingController.expectOne(req => req.url == '/api/lessons');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('courseId')).toBe('12');
    expect(request.request.params.get('filter')).toBe('');
    expect(request.request.params.get('sortOrder')).toBe('asc');
    expect(request.request.params.get('pageNumber')).toBe('0');
    expect(request.request.params.get('pageSize')).toBe('3');

    request.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });

    // httpTestingController.verify();
  });

  afterEach(() => {

    console.log('afterEach for CoursesService');

    httpTestingController.verify();

  });

});
