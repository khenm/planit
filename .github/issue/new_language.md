---
name: New Language / Translation
about: Help translate PlanIt into a new language
title: "[i18n] Add <Language> Support"
labels: ["enhancement", "good first issue", "i18n"]
assignees: ''

---

### Language Details
- **Language**: (e.g., French)
- **Code**: (e.g., fr)

### Step-by-Step Guide

1.  **Duplicate the English Locale**:
    Copy the folder `src/locales/en` and rename it to your language code.
    ```bash
    cp -r src/locales/en src/locales/<your-code>
    ```

2.  **Translate Values**:
    Open `src/locales/<your-code>/translation.json` and translate the values.

3.  **Register the Language**:
    Open `src/i18n.ts` and import your new translation file:
    ```typescript
    import <lang>Translation from './locales/<code >/translation.json';
    // ...
    resources: {
      //...
      <code>: { translation: <lang>Translation },
    }
    ```

4.  **Add to Settings**:
    Open `src/components/Settings.tsx` and add your language option to the dropdown.

### Checklist
- [ ] Created locale folder
- [ ] Translated `translation.json`
- [ ] Updated `i18n.ts`
- [ ] Updated `Settings.tsx`
- [ ] Tested locally
