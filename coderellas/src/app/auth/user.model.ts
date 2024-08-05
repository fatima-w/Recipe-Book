//to store data of user to know if the user is authenticated or not(validating if the token is still valid)
export class User{
    constructor(
        public email:string, 
        public id?:string, 
    ){}
}