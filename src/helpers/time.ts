export const getLocalizedDateShort = (
  time: Date | string | number,
  locale = 'it-IT',
  options?: Intl.DateTimeFormatOptions,
) => {
  const date = new Date(time)
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    ...(options || {}),
  })

  return formatter.format(date)
}
