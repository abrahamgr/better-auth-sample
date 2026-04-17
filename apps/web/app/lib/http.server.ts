export function mergeHeaders(...headerSets: Array<Headers | undefined>) {
  const responseHeaders = new Headers()

  for (const headerSet of headerSets) {
    if (!headerSet) {
      continue
    }

    if (typeof headerSet.getSetCookie === 'function') {
      for (const cookie of headerSet.getSetCookie()) {
        responseHeaders.append('set-cookie', cookie)
      }
    }

    for (const [key, value] of headerSet.entries()) {
      if (key.toLowerCase() === 'set-cookie') {
        continue
      }

      responseHeaders.append(key, value)
    }
  }

  return responseHeaders
}
