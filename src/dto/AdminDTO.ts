

export interface AdminResponseDTO {
        _id: string,
       fullName: string,
        phoneNumber: string,
        userId?: string,
        schoolId?: string
}

export interface CreateAdminProfileDTO {
    fullName: string,
    phoneNumber: string,
    userId: string,
    schoolId?: string
}

export interface AdminProfileResponseDTO extends AdminResponseDTO {
    user?: {
        _id: string,
        email:string,
        role: 'superadmin' | 'admin' | 'teacher' | 'student',
        status: 'active' | 'inactive' | 'deleted' | 'blocked'
    }
}