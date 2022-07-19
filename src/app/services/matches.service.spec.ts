import { TestBed } from '@angular/core/testing';

import { MetadataService } from './metadata.service';

describe('MatchesService', () => {
  let service: MetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
