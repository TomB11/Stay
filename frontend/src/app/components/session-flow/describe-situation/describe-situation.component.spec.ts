import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescribeSituationComponent } from './describe-situation.component';

describe('DescribeSituationComponent', () => {
  let fixture: ComponentFixture<DescribeSituationComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescribeSituationComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DescribeSituationComponent);
  });
  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the crisis alert only when the text contains a crisis signal', () => {
    const setSituation = (text: string) => {
      fixture.componentRef.setInput('situation', text);
      fixture.detectChanges();
    };
    setSituation('I am nervous about tomorrow');
    expect(fixture.nativeElement.querySelector('app-crisis-alert')).toBeNull();

    setSituation('Chcem sa zabiť');
    expect(fixture.nativeElement.querySelector('app-crisis-alert')).toBeTruthy();
  });
});
