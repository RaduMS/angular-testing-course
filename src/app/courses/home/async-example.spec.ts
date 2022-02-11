import {fakeAsync, flush, flushMicrotasks, tick} from '@angular/core/testing';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

describe('Asynchronous test examples', () => {

  it('Asynchronous test example with Jasmine done()', (done: DoneFn) => {

    let test = false;

    setTimeout(() => {

      console.log('running assertions');

      test = true;

      expect(test).toBeTruthy('test variable si false');

      done();

    }, 1000);

  });

  it('Asynchronous test example - setTimeout() ', fakeAsync(() => {

    let test = false;

    setTimeout(() => {}, 2000);
    setTimeout(() => {

      console.log('running assertions');

      test = true;

      // expect(test).toBeTruthy('test variable si false');

    }, 1000);

    // tick(1000);

    flush(); // se executa toate timeout-urile

    expect(test).toBeTruthy('test variable si false');

  }));

  xit('Asynchronous text example - plain Promise', () => {

    let test = false;

    console.log('Create promise');

    // setTimeout e un Task
    setTimeout(() => {

      console.log('First setTimeout');

    });

    setTimeout(() => {

      console.log('Second setTimeout');

    });

    // Promise e un microTask
    Promise.resolve().then(() => {

      console.log('First Promise is resolved');

      return Promise.resolve();

    }).then(() => {

      console.log('Second Promise is resolved');

      test = true;

    });

    console.log('Running test assertion');

    expect(test).toBeTruthy('test variable si false');

  });

  it('Asynchronous text example - plain Promise - fakeAsync', fakeAsync(() => {

    let test = false;

    console.log('Create promise');

    // Promise e un microTask
    Promise.resolve().then(() => {

      console.log('First Promise is resolved');

      test = true;

      return Promise.resolve();

    }).then(() => {

      console.log('Second Promise is resolved');

      // test = true;

    });

    flushMicrotasks();

    console.log('Running test assertion');

    expect(test).toBeTruthy('test variable si false');

  }));

  it('Asynchronous test example - Promise - setTimeout', fakeAsync(() => {

    let counter = 0;

    Promise.resolve().then(() => {

      counter += 10;

      setTimeout(() => {

        counter += 1;

      }, 1000);

    });

    expect(counter).toBe(0);

    flushMicrotasks();

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(11);

  }));

  it('Asynchronous test example - Observable', fakeAsync(() => {

    let test = false;

    const test$ = of(test).pipe(delay(1000));

    console.log('Creating Observable');

    test$.subscribe(() => {

      test = true;

    });

    tick(1000);

    console.log('Running test assertion');

    expect(test).toBe(true);

  }));

});
