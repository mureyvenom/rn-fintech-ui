# Contributing to react-native-fintech-kit

First off — thank you for taking the time to contribute. This library exists to make fintech UI development easier for React Native engineers, and every contribution moves that goal forward.

This document covers everything you need to know to go from zero to a merged pull request.

---

## Table of contents

- [Code of conduct](#code-of-conduct)
- [Ways to contribute](#ways-to-contribute)
- [Before you start](#before-you-start)
- [Development setup](#development-setup)
- [Project structure](#project-structure)
- [Development workflow](#development-workflow)
- [Adding a new component](#adding-a-new-component)
- [Commit conventions](#commit-conventions)
- [Pull request process](#pull-request-process)
- [Code standards](#code-standards)
- [Testing](#testing)
- [Design principles](#design-principles)
- [Reporting bugs](#reporting-bugs)
- [Requesting features](#requesting-features)
- [Getting help](#getting-help)

---

## Code of conduct

This project follows a simple rule: be kind. Constructive criticism of code is always welcome. Personal attacks, dismissive language, and gatekeeping are not. Contributors who cannot maintain a respectful tone will be removed from the project.

---

## Ways to contribute

You do not need to write code to contribute meaningfully.

**Without writing code:**

- Report a bug with a clear reproduction case
- Request a feature with a real use case explanation
- Improve documentation or fix typos in the README
- Add a currency to the `CURRENCY_DECIMAL_MAP` utility
- Add a card BIN range to the `detectCardScheme` utility
- Share the library with other React Native engineers

**With code:**

- Fix an open bug
- Add tests for existing components
- Improve TypeScript types
- Build a new component from the roadmap
- Improve dark mode support for an existing component
- Add accessibility improvements

---

## Before you start

### Check existing issues and PRs

Before opening an issue or starting work on a feature, search [existing issues](https://github.com/mureyvenom/rn-fintech-ui/issues) and [open pull requests](https://github.com/mureyvenom/rn-fintech-ui/pulls). Someone may already be working on what you have in mind.

### For significant changes — open an issue first

If you want to add a new component, change the public API, or make an architectural change, **open an issue before writing code**. This saves everyone time — we can discuss the approach before you invest hours in an implementation that may need to go in a different direction.

For small fixes (typos, obvious bugs, adding currencies/card schemes), go ahead and open a PR directly.

---

## Development setup

### Prerequisites

- Node.js >= 22.11.0
- Yarn 4.x (`corepack enable` then `corepack prepare yarn@4.11.0 --activate`)
- For iOS: Xcode 15+, CocoaPods
- For Android: Android Studio, JDK 17+

### Fork and clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/rn-fintech-ui.git
cd rn-fintech-ui

# Add upstream remote
git remote add upstream https://github.com/mureyvenom/rn-fintech-ui.git
```

### Install dependencies

```bash
yarn install
```

This installs dependencies for both the library root and the example app workspace.

### Build the library

```bash
yarn prepare
```

This compiles `src/` into `lib/` using `react-native-builder-bob`. The example app imports from `lib/`, so you need to run this (or keep it running in watch mode) to see your changes reflected.

For active development, rebuild on every change:

```bash
yarn bob build --watch
```

### Run the example app

```bash
# iOS
cd example/ios && pod install && cd ..
yarn example ios

# Android
yarn example android
```

The example app is a component gallery showing every component in multiple states. When you add a component, add it to the gallery.

---

## Project structure

```
react-native-fintech-kit/
├── src/
│   ├── components/
│   │   ├── Inputs/
│   │   │   ├── OtpInput/
│   │   │   │   ├── OtpInput.tsx        # component
│   │   │   │   ├── OtpInput.types.ts   # prop types
│   │   │   │   └── index.ts            # re-export
│   │   │   ├── AmountInput/
│   │   │   └── PinPad/
│   │   ├── Display/
│   │   │   ├── BalanceDisplay/
│   │   │   ├── TransactionCard/
│   │   │   ├── PaymentCard/
│   │   │   └── CurrencySelector/
│   │   ├── Feedback/
│   │   │   └── SkeletonLoader/
│   │   ├── Box.tsx                     # Restyle Box
│   │   ├── Text.tsx                    # Restyle Text
│   │   └── index.tsx                   # barrel export
│   ├── theme/
│   │   ├── tokens/
│   │   │   ├── colors.ts               # light + dark color tokens
│   │   │   ├── spacing.ts
│   │   │   └── typography.ts
│   │   ├── config/
│   │   │   └── index.ts                # createTheme config
│   │   ├── provider/
│   │   │   ├── FintechKitProvider.tsx  # combined provider + config context
│   │   │   └── ThemeModeContext.tsx    # light/dark mode state
│   │   └── index.ts
│   ├── utils/
│   │   ├── currency.ts                 # formatting, parsing, validation
│   │   ├── date.ts                     # relative date formatting
│   │   └── card.ts                     # scheme detection, masking
│   ├── hooks/
│   │   └── useHaptics.ts
│   ├── types/
│   │   └── global.ts
│   └── index.ts                        # public API — only export from here
├── example/
│   ├── src/
│   │   ├── screens/                    # one screen per component
│   │   ├── navigators/
│   │   └── App.tsx
│   ├── babel.config.js
│   └── package.json
├── src/__tests__/                      # unit tests
└── package.json
```

### The public API rule

**Only export from `src/index.ts`.** If a type, utility, or component is not exported from `src/index.ts`, it is considered internal and may change without notice. When you add something that consumers should be able to use, add it to `src/index.ts`.

---

## Development workflow

### 1. Create a branch

```bash
# Sync with upstream first
git fetch upstream
git checkout main
git merge upstream/main

# Create your branch
git checkout -b feat/payment-card
# or
git checkout -b fix/otp-input-paste-android
# or
git checkout -b docs/improve-readme
```

Branch naming:

- `feat/` — new component or feature
- `fix/` — bug fix
- `docs/` — documentation only
- `refactor/` — code change with no behaviour change
- `test/` — adding or improving tests
- `chore/` — dependency updates, config changes

### 2. Make your changes

Keep changes focused. A PR that fixes a bug and also refactors unrelated code is harder to review and slower to merge. Two focused PRs are better than one large one.

### 3. Test your changes

```bash
# Type check
yarn typecheck

# Lint
yarn lint

# Run tests
yarn test

# Run the example app and verify visually
yarn example ios
```

### 4. Commit using conventional commits

See [Commit conventions](#commit-conventions) below.

### 5. Push and open a PR

```bash
git push origin feat/payment-card
```

Then open a pull request against `main` on the upstream repo.

---

## Adding a new component

New components must follow the established patterns. Here is the exact checklist:

### File structure

Create a folder under the appropriate category:

```
src/components/Inputs/YourComponent/
├── YourComponent.tsx
├── YourComponent.types.ts
└── index.ts
```

Use `Display/` for components that show data (cards, displays, lists).
Use `Inputs/` for components that accept user input.
Use `Feedback/` for loading states, status indicators, and animations.

### Required pieces

**1. Types file** — define your prop types and config type:

```ts
// YourComponent.types.ts
export type YourComponentConfig = {
  // style overrides the consumer can set globally
};

export type YourComponentProps = {
  // all props, every one documented with a JSDoc comment
  testID?: string; // always include testID
};
```

**2. DEFAULTS object** — every component has one at the top of the file:

```ts
const DEFAULTS: Required<YourComponentConfig> = {
  // sensible defaults for everything
};
```

**3. Config consumption** — every component reads from the provider:

```ts
const { yourComponent: overrides = {} } = useComponentConfig();
const config = { ...DEFAULTS, ...overrides };
```

**4. Use config values** — never hardcode dimensions, colors, or font sizes in JSX. Use `config.x` throughout.

**5. Dark mode** — get colors from `useTheme<Theme>()`, never hardcode hex values in JSX.

**6. Accessibility** — every interactive element needs:

- `accessibilityLabel`
- `accessibilityRole`
- `accessibilityState` where relevant (disabled, selected, checked)
- `testID` passed through from props

**7. Register in `FintechKitConfig`:**

```ts
// src/theme/provider/FintechKitProvider.tsx
export type FintechKitConfig = {
  // ... existing
  yourComponent?: YourComponentConfig;
};
```

**8. Export from barrel files:**

```ts
// src/components/index.tsx
export { default as YourComponent } from './Category/YourComponent';
export type { YourComponentProps } from './Category/YourComponent/YourComponent.types';
```

**9. Add to the example app** — create a screen in `example/src/screens/YourComponentScreen.tsx` showing the component in at minimum these states: default, with all optional props, disabled, error/loading. Register it in the component registry.

**10. Write tests** — at minimum, test that it renders without throwing and that callbacks fire correctly.

### What makes a good component

- **Simple case is simple, complex case is possible.** `<OtpInput value={v} onChange={o} />` should work with no other props.
- **No hardcoded values in JSX.** Everything goes through the config system.
- **No navigation dependencies.** Components fire callbacks. The consumer handles navigation.
- **No layout opinions.** Components should not impose their own margin or padding on the outside. That is the consumer's job.
- **Offline-first.** Components should not make network calls.

---

## Commit conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/). The format is:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

| Type       | When to use                                      |
| ---------- | ------------------------------------------------ |
| `feat`     | New component, new prop, new utility function    |
| `fix`      | Bug fix                                          |
| `docs`     | README, CONTRIBUTING, JSDoc comments             |
| `style`    | Formatting, missing semicolons — no logic change |
| `refactor` | Code change with no behaviour change             |
| `test`     | Adding or fixing tests                           |
| `chore`    | Dependency updates, build config, CI changes     |
| `perf`     | Performance improvement                          |

**Scopes** — use the component or area name:

```
feat(otp-input): add secureTextEntry prop
fix(amount-input): preserve cursor position on Android paste
docs(readme): add CurrencySelector usage example
test(currency): add formatAmount edge case tests
chore(deps): update react-native-reanimated to 4.4.0
```

**Rules:**

- Use the imperative mood: "add prop" not "added prop" or "adds prop"
- Keep the description under 72 characters
- Do not end the description with a period
- Reference issues in the footer: `Closes #42`

`lefthook` will validate your commit message automatically. If it fails, check the format above.

---

## Pull request process

### Before opening a PR

- [ ] `yarn typecheck` passes with no errors
- [ ] `yarn lint` passes with no warnings
- [ ] `yarn test` passes
- [ ] The example app runs and shows your changes
- [ ] New component has a screen in the example app
- [ ] New public exports are added to `src/index.ts`
- [ ] If you changed a prop API, update the README prop table

### PR title

Use the same conventional commit format as your commits:

```
feat(payment-card): add PaymentCard component with auto scheme detection
fix(otp-input): fix paste handling when focused on non-zero index
```

### PR description

Use this template:

```md
## What this PR does

<!-- One paragraph summary -->

## Why

<!-- The problem being solved or the improvement being made -->

## How to test

<!-- Steps to verify the change in the example app -->

## Screenshots / GIFs

<!-- For visual changes — before and after if applicable -->

## Checklist

- [ ] typecheck passes
- [ ] lint passes
- [ ] tests pass
- [ ] example app updated
- [ ] README updated (if public API changed)
```

### Review process

- PRs are reviewed within a few days
- At least one approval is required before merging
- Reviewers may request changes — this is normal and not a rejection
- Once approved, the maintainer will squash and merge

### What gets rejected

- PRs without tests for new components
- PRs that change the public API without updating the README
- PRs that add dependencies without justification
- PRs that introduce hardcoded hex values or font sizes in components
- PRs that bypass the config system

---

## Code standards

### TypeScript

- Strict mode is enabled. No `any` types.
- Use `type` over `interface` for prop definitions.
- Export prop types alongside components — consumers need them.
- Use `const` assertions (`as const`) on static maps.

```ts
// ✅
export type OtpInputProps = {
  length?: number;
};

// ❌
export interface OtpInputProps {
  length?: number;
}
```

### React Native

- No hardcoded hex values in component JSX — always `theme.colors.tokenName`
- No hardcoded dimensions — always `config.propName`
- No inline styles for static values — use `StyleSheet.create`
- `StyleSheet.create` for static styles, inline only for dynamic values
- Always handle `Platform.select` for shadow styles
- Always include `includeFontPadding: false` on Android text inputs

### Imports

Order imports as: React → React Native → third-party → internal (absolute) → internal (relative)

```ts
import React, { useState, useCallback } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';

import Box from '../../Box';
import type { Theme } from '../../../theme';
import type { OtpInputProps } from './OtpInput.types';
```

---

## Testing

### What to test

**Always test:**

- Utility functions (pure functions are easy and high value)
- That components render without throwing
- That callbacks fire with the correct arguments
- Validation logic

**Test when practical:**

- State transitions (fill OTP → onComplete fires)
- Error states (error prop → correct styling class)
- Accessibility labels

**Do not test:**

- Exact pixel values or styles
- Animation timing
- Internal implementation details

### Writing tests

Tests live in `src/__tests__/`. Mirror the source structure:

```
src/__tests__/
├── utils/
│   ├── currency.test.ts
│   ├── date.test.ts
│   └── card.test.ts
└── components/
    ├── OtpInput.test.tsx
    └── AmountInput.test.tsx
```

Example:

```ts
// src/__tests__/utils/card.test.ts
import { detectCardScheme, maskCardNumber } from '../../utils/card';

describe('detectCardScheme', () => {
  it('detects Visa from prefix 4', () => {
    expect(detectCardScheme('4111111111111111')).toBe('visa');
  });
  it('detects Mastercard from prefix 5', () => {
    expect(detectCardScheme('5399123456789010')).toBe('mastercard');
  });
  it('detects Verve before Visa for Verve BINs', () => {
    expect(detectCardScheme('5061234567890123')).toBe('verve');
  });
  it('returns unknown for unrecognised prefix', () => {
    expect(detectCardScheme('9999999999999999')).toBe('unknown');
  });
  it('handles empty string', () => {
    expect(detectCardScheme('')).toBe('unknown');
  });
});
```

Run tests:

```bash
yarn test                    # run once
yarn test:watch              # watch mode
yarn test:coverage           # with coverage report
```

Coverage thresholds are enforced — the CI will fail if coverage drops below 70% branches / 80% functions and lines.

---

## Design principles

These are the decisions behind how the library is built. Understanding them will help you contribute in the right direction.

**1. The simple case must be simple**

A new user should be able to drop in `<OtpInput value={v} onChange={o} />` and get a working, good-looking component with no other configuration. Every prop beyond the minimum should have a sensible default.

**2. The config system is the customization layer**

Global style overrides go through `FintechKitProvider config={}`. Instance-level overrides go through props. Direct style injection (`style={}` on every prop) should be avoided — it bypasses the theme system and breaks dark mode.

**3. Components fire callbacks. Apps handle navigation**

No component in this library should import from `@react-navigation` or make assumptions about the consumer's routing setup. `onPress`, `onSelect`, `onComplete` — that is as far as the library goes.

**4. No network calls**

Components accept data as props. They do not fetch, cache, or mutate data. That is the consumer's responsibility.

**5. Accessibility is not optional**

Every interactive element must be accessible to screen readers. This is not a nice-to-have. `accessibilityLabel`, `accessibilityRole`, and `accessibilityState` are required on every touchable element.

**6. Dark mode is automatic**

If a new component uses hardcoded hex values, it will look wrong in dark mode. Every color must come from `useTheme<Theme>()`. If a required color token does not exist, add it to both `lightColors` and `darkColors` in `src/theme/tokens/colors.ts`.

---

## Reporting bugs

Open an issue using the bug report template. A good bug report includes:

- **React Native version** and **platform** (iOS/Android, simulator/device)
- **Library version** (`npm list react-native-fintech-kit`)
- **Minimal reproduction** — the smallest possible code that demonstrates the bug
- **Expected behaviour** — what you expected to happen
- **Actual behaviour** — what actually happened
- **Error message and stack trace** if applicable

Issues without a reproduction case may be closed. If you cannot provide a reproduction, describe the steps to reproduce in enough detail that someone else can.

---

## Requesting features

Open an issue using the feature request template. A good feature request includes:

- **The problem you're trying to solve** — not the solution, the problem
- **The fintech use case** — where in a real app would this be used
- **What you've tried** — current workarounds, if any
- **Rough API sketch** — what the props might look like

Features that are too opinionated, too app-specific, or that would require breaking changes to existing APIs are unlikely to be accepted in their proposed form, but the discussion is always valuable.

---

## Getting help

- **GitHub Discussions** — for questions about usage, architecture decisions, and general discussion
- **GitHub Issues** — for confirmed bugs and feature requests only
- **Reactiflux Discord** — `#react-native` channel for community help

When asking for help, include your React Native version, the library version, and the relevant code. Questions like "it doesn't work" without context cannot be answered.

---

## Maintainer notes

### Releasing a new version

Releases are handled by `release-it`. The maintainer runs:

```bash
yarn release
```

This bumps the version based on conventional commits since the last tag, updates `CHANGELOG.md`, creates a GitHub release, and publishes to npm. Contributors do not need to worry about this step.

### Changelog

`CHANGELOG.md` is generated automatically from commit messages. This is why conventional commits matter — your commit message becomes the changelog entry that consumers read.

---

Thank you for contributing. Every issue filed, every PR opened, and every bug reported makes this library more useful for the React Native fintech community.
