import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrisisHelpComponent } from './crisis-help.component';

describe('CrisisHelpComponent', () => {
  let fixture: ComponentFixture<CrisisHelpComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrisisHelpComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CrisisHelpComponent);
    fixture.detectChanges();
  });

  it('shows the warning, the contacts and emits closed on back', () => {
    let closed = 0;
    fixture.componentInstance.closed.subscribe(() => closed++);
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('a[href="tel:112"]')).toBeTruthy();
    (root.querySelector('.btn-back') as HTMLButtonElement).click();
    expect(closed).toBe(1);
  });
});
