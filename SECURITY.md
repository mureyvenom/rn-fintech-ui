# Security Policy

## Supported versions

| Version        | Supported           |
| -------------- | ------------------- |
| Latest minor   | ✅                  |
| Previous minor | Security fixes only |
| Older          | ❌                  |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, email **holuwamurewa@gmail.com** with the subject line `[SECURITY] react-native-fintech-kit`.

Include:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix if you have one

You will receive a response within 72 hours. If the issue is confirmed, a fix will be prioritised and a patched version released as soon as possible. You will be credited in the release notes unless you prefer to remain anonymous.

## Scope

This library is a UI component library with no backend, no network requests, and no data persistence. The most likely security-relevant areas are:

- Card number handling in `PaymentCard` and `src/utils/card.ts`
- PIN input handling in `PinPad`
- OTP input handling in `OtpInput`

This library does not store, transmit, or log any sensitive data. All values are passed through props and callbacks — the consuming application is responsible for secure handling of card numbers, PINs, and OTP values.
