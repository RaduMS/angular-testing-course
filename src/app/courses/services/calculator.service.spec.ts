import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';
import {TestBed} from '@angular/core/testing';

describe('CalculatorService', () => {

  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    console.log('Calling before each');
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: loggerSpy}
      ]
    });

    // calculator = new CalculatorService(loggerSpy);
    calculator = TestBed.get(CalculatorService);
  });

  it('Should add two numbers!', () => {

    console.log('Add test');

    // const logger = jasmine.createSpyObj('LoggerService', ['log']);
    //
    // logger.log.and.returnValue();
    //
    // spyOn(logger, 'log');

    /*const calculator = new CalculatorService(logger);*/

    const result = calculator.add(2, 2);

    expect(result).toBe(4);

    expect(loggerSpy.log).toHaveBeenCalledTimes(1);

  });

  it('Should subtract two numbers!', () => {

    console.log('Subtract test');

    // const calculator = new CalculatorService(new LoggerService());

    const result = calculator.subtract(2, 2);

    expect(result).toBe(0);

  });

});

// ping 192.168.5.1
