import { z } from "zod";
import { schoolNameRegex, 
    emailRegex, 
    phoneNumberRegex, 
    nameRegex, 
    urlRegex, 
    alphabetOnlyRegex,
    addressRegex,
    postalCodeRegex 
} from "./Regex";

// User validation schema

export const schoolInfoValidationSchema = z.object({
  schoolName: z
    .string()
    .min(1, { message: "School's name is required" })
    .regex(schoolNameRegex, { message: "Enter a valid name" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(emailRegex, { message: "Enter a valid email address" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(phoneNumberRegex, { message: "Enter a valid email phone number" }),
  regNumber: z.string().min(1, { message: "Registration number is required" }),
  yearEstablished: z.coerce
    .number({ invalid_type_error: "Enter a valid year" })
    .min(1900, { message: "Enter a valid year" })
    .max(2099, { message: "Enter a valid year" }),
  principalName: z
    .string()
    .min(1, { message: "Principal's name is required" })
    .regex(nameRegex, { message: "Enter a valid name" }),
  websiteUrl: z
    .string()
    .min(1, { message: "Website URL is required" })
    .regex(urlRegex, { message: "Enter a valid url" }),
  totalStudents: z.coerce
    .number({ invalid_type_error: "Enter a valid number" })
    .min(1, { message: "This field is required" })
    .max(500, { message: "Cannot exceed 500 teachers" }),
  totalTeachers: z.coerce
    .number({ invalid_type_error: "Enter a valid number" })
    .min(1, { message: "This field is required" })
    .max(3000, { message: "Cannot exceed 3000 teachers" }),
  board: z
    .string()
    .min(1, { message: "Board's name is required" })
    .regex(alphabetOnlyRegex, { message: "Enter a valid board name" }),
  city: z
    .string()
    .min(1, { message: "City name is required" })
    .regex(addressRegex, { message: "Enter a valid city name" }),
  country: z
    .string()
    .min(1, { message: "Country name is required" })
    .regex(addressRegex, { message: "Enter a valid country name" }),
  state: z
    .string()
    .min(1, { message: "State name is required" })
    .regex(addressRegex, { message: "Enter a valid state name" }),
  postalCode: z
    .string()
    .min(1, { message: "Postal code is required" })
    .regex(postalCodeRegex, { message: "Enter a valid postal code" }),
});
