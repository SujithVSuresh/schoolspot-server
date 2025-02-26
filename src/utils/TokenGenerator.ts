import crypto from 'crypto'


export function generateToken(length: number): Promise<string>{
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, buf) => {
            if(err){
                reject(err)
            }
        
            if(buf){
                console.log(buf.toString('hex'))
                resolve(buf.toString('hex'))
            }
        })
    })
}