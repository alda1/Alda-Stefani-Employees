import { TestBed } from '@angular/core/testing';

import { CsvProcesserService } from './csv-processer.service';

describe('CsvParserService', () => {
  let service: CsvProcesserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvProcesserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
