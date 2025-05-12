


export const checkSubscription = (endDate: string) => {
    const now = new Date()
    const expiryDate = new Date(endDate)

    if(now > expiryDate){
        return false
    }else{
        return true
    }
}