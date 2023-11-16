export const isValidEmail = (email: string) => {
  if (typeof email !== 'string') return false
  if (email.length > 255) return false
  const regex = /^.+@.+$/
  return regex.test(email)
}

export const isValidPassword = (
  password: string
) => {
  if (typeof password !== 'string') return false
  if (password.length > 255) return false
  if (password.length < 8) return false
  return true
}

export function isValidData(
  email: string,
  password: string
) {
  if (!isValidEmail(email)) {
    return {
      valid: false,
      message: 'Invalid email',
    }
  }

  if (!isValidPassword(password)) {
    return {
      valid: false,
      message: 'Invalid password',
    }
  }

  return {
    valid: true,
  }
}
