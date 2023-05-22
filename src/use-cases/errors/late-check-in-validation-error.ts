export class LateCheckInValidationError extends Error {
  constructor() {
    super('Time to validate check-in was exceeded.')
  }
}
