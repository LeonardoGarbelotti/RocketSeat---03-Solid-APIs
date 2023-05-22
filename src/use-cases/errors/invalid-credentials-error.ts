export class InvalidCredentialsErrors extends Error {
  constructor() {
    super('Invalid credentials. Check your e-mail or password.')
  }
}
