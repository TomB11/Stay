import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RELAXATION_GROUP_KEYS } from '../../../now/constants/relaxation.constant';
import { RelaxationGuideComponent } from './relaxation-guide.component';

describe('RelaxationGuideComponent', () => {
  let fixture: ComponentFixture<RelaxationGuideComponent>;
  let component: RelaxationGuideComponent;
  const root = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelaxationGuideComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(RelaxationGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with the first muscle group in the tense phase', () => {
    expect(root().querySelector('.phase.release')).toBeNull();
    expect(root().querySelector('.eyebrow')?.textContent).toContain(
      `1/${RELAXATION_GROUP_KEYS.length}`,
    );
  });

  it('moves through every group and then finishes', () => {
    let finished = false;
    component.finished.subscribe(() => (finished = true));
    for (let i = 0; i < RELAXATION_GROUP_KEYS.length; i++) {
      (root().querySelector('.next') as HTMLButtonElement).click();
      fixture.detectChanges();
    }
    expect(finished).toBeTrue();
  });
});
