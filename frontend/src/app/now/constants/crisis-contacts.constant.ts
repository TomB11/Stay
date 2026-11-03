import { Language } from '../../core/i18n/language.enum';
import { CrisisContact } from '../models/crisis-contact.interface';

// Numbers must be re-verified with the operators before each release.
export const CRISIS_CONTACTS: Record<Language, readonly CrisisContact[]> = {
  [Language.Slovak]: [
    { labelKey: 'contactEmergency', number: '112' },
    { labelKey: 'contactCrisisLine', number: '0800800566' },
  ],
  [Language.Czech]: [
    { labelKey: 'contactEmergency', number: '112' },
    { labelKey: 'contactCrisisLine', number: '116123' },
  ],
  [Language.English]: [{ labelKey: 'contactEmergency', number: '112' }],
};
