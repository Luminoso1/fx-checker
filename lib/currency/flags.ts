const SPECIAL_CURRENCY_FLAGS: Record<string, string> = {
  EUR: 'eu',
  USD: 'us',
  GBP: 'gb',
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  JPY: 'jp',
  ZAR: 'za',
  ANG: 'an',
  XOF: 'sn',
  XAF: 'cm',
  XPF: 'pf',
  XCD: 'lc',
  XCG: 'cw',
  XDR: 'un',
  XEU: 'eu',
  XAG: 'un',
  XAU: 'un',
}

const generateFlag = (code: string) => {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

export const getFlagByISOCode = (isoCode: string) => {
  let code = SPECIAL_CURRENCY_FLAGS[isoCode]
  if (code) {
    return generateFlag(code)
  }

  code = isoCode.slice(0, 2)
  return generateFlag(code)
}
