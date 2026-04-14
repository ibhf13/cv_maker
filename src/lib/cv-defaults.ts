import type { CvData } from "@/lib/cv-schema"

export function createEmptyCvData(): CvData {
  return {
    personal_info: {
      name: "",
      date_of_birth: "",
      place_of_birth: "",
      nationality: "",
      marital_status: "",
      driving_license: "",
      address: { street: "", plz: "", city: "" },
      phone: "",
      email: "",
      website: "",
      linkedin: "",
      xing: "",
    },
    summary: "",
    experience: [],
    education: [],
    certifications: [],
    skills: [],
    projects: [],
    languages: [],
    volunteer: [],
    interests: [],
    signature: null,
  }
}
