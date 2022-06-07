export async function delay(cb: Function, delay: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(cb())
    }, delay)
  })
}
