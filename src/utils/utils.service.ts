const LETTERS_AND_NUMBERS = 'abcdefghijklmnopqrstuvwxyz0123456789'
const CODE_LENGTH = 6

export const generateCode = () => {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code +=
      LETTERS_AND_NUMBERS[
        Math.floor(Math.random() * LETTERS_AND_NUMBERS.length)
      ]
  }

  return code
}

export const subtractSeconds = (date: Date, seconds: number) => {
  return new Date(date.getTime() - seconds * 1000)
}
