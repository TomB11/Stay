import { TestBed } from '@angular/core/testing';
import { InfoTipComponent } from './info-tip.component';

describe('InfoTipComponent', () => {
  it('renders the tooltip text linked to the trigger', () => {
    TestBed.configureTestingModule({ imports: [InfoTipComponent] });
    const fixture = TestBed.createComponent(InfoTipComponent);
    fixture.componentRef.setInput('text', 'Hello');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const bubble = el.querySelector('[role="tooltip"]') as HTMLElement;
    expect(bubble.textContent).toContain('Hello');
    expect(el.querySelector('button')?.getAttribute('aria-describedby')).toBe(bubble.id);
  });
});
