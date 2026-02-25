export const parseTTL = (ttl: string | undefined): number => {
  if (!ttl) {
    throw new Error('Невалидный формат TTL')
  }

  const match = ttl.match(/^(\d+)([smhd])$/)
  if (!match) {
    throw new Error('Невалидный формат TTL')
  }

  const value = parseInt(match[1], 10)
  const unit = match[2]

  switch (unit) {
    case 's':
      return value
    case 'm':
      return value * 60
    case 'h':
      return value * 60 * 60
    case 'd':
      return value * 24 * 60 * 60
    default:
      throw new Error('Неизвестная единица измерения TTL')
  }
}
