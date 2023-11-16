export async function sendPasswordResetLink(
  token
) {
  const url = `http://localhost:4321/auth/password-reset/${token}`
  console.log(`Your password reset link: ${url}`)
}
