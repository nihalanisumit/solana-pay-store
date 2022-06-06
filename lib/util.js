export function shortenAddress({ address, prefixChars = 2, suffixChars = 3, delimiter = '...' }) {
  return address ? `${address.slice(0, prefixChars)}${delimiter}${address.slice(-suffixChars)}` : ''
}

export const rem = (px, base = 16) => `${px / base}rem`
