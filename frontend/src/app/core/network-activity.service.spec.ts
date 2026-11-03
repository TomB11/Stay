import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SLOW_REQUEST_DELAY_MS } from './api.constant';
import { NetworkActivityService } from './network-activity.service';

describe('NetworkActivityService', () => {
  let service: NetworkActivityService;
  beforeEach(() => {
    service = TestBed.inject(NetworkActivityService);
  });

  it('flags a slow request only after the delay', fakeAsync(() => {
    service.start();
    tick(SLOW_REQUEST_DELAY_MS - 1);
    expect(service.slow()).toBeFalse();
    tick(1);
    expect(service.slow()).toBeTrue();
    service.finish();
    expect(service.slow()).toBeFalse();
  }));

  it('does not flag requests that finish quickly', fakeAsync(() => {
    service.start();
    tick(100);
    service.finish();
    tick(SLOW_REQUEST_DELAY_MS);
    expect(service.slow()).toBeFalse();
  }));

  it('stays slow until every pending request finishes', fakeAsync(() => {
    service.start();
    service.start();
    tick(SLOW_REQUEST_DELAY_MS);
    service.finish();
    expect(service.slow()).toBeTrue();
    service.finish();
    expect(service.slow()).toBeFalse();
  }));
});
