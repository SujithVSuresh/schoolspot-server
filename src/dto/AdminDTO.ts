

export interface AdminResponseDTO {
        _id: string,
       fullName: string,
        phoneNumber: string,
        role: 'principal' | 'it_admin' | 'vice_principal' | 'other',
        userId?: string,
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