
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordLengthRegex = /^.{8,}$/
const passwordLetterRegex = /^(?=.*[a-zA-Z]).*$/
const passwordNumberRegex = /^(?=.*\d).+$/
const passwordSpecialCharacterRegex = /[!@#$%^&*(),.?":{}|<>+-]/

export {
    emailRegex,
    passwordLengthRegex,
    passwordLetterRegex,
    passwordNumberRegex,
    passwordSpecialCharacterRegex
}