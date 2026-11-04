import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let nextTipId = 0;

@Component({
  standalone: true,
  selector: 'app-info-tip',
  templateUrl: './info-tip.component.html',
  styleUrl: './info-tip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoTipComponent {
  /** Already translated tooltip text. */
  readonly text = input.required<string>();
  protected readonly tipId = `info-tip-${nextTipId++}`;
}
