/** Returns true if `birthDate` (ISO `YYYY-MM-DD`) resolves to an age >= `minAge`. */
export function isAtLeastAge(birthDate: string, minAge: number): boolean {
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return false
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--
  return age >= minAge
}
