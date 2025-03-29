
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordLengthRegex = /^.{8,}$/
const passwordLetterRegex = /^(?=.*[a-zA-Z]).*$/
const passwordNumberRegex = /^(?=.*\d).+$/
const passwordSpecialCharacterRegex = /[!@#$%^&*(),.?":{}|<>+-]/
const schoolNameRegex = /^[a-zA-Z0-9\s.,'-]+$/;
const phoneNumberRegex = /^\+?[0-9]{10,15}$/;
const nameRegex = /^[a-zA-Z\s'-]+$/;
const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/?$/;
const alphabetOnlyRegex = /^[a-zA-Z\s]+$/;
const addressRegex = /^[a-zA-Z]+([ -][a-zA-Z]+)*$/
const postalCodeRegex = /^\d{6}$/

export {
    emailRegex,
    passwordLengthRegex,
    passwordLetterRegex,
    passwordNumberRegex,
    passwordSpecialCharacterRegex,
    schoolNameRegex,
    phoneNumberRegex,
    nameRegex,
    urlRegex,
    alphabetOnlyRegex,
    addressRegex,
    postalCodeRegex
}