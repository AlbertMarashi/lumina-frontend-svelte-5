import { type RecordId, Surreal } from "surrealdb.js"
export const GetUserQuery = "SELECT id, first_name, last_name, email, role FROM $auth LIMIT 1;"
export type GetUserResult = [Array<{email:string,first_name:string,id:RecordId< |"user">,last_name:string,role:string|undefined,}>,]
export const ResetPasswordQuery = "UPDATE ONLY $user SET password = crypto::bcrypt::generate($password);"
export type ResetPasswordResult = [{calling_code:string,country_code:string,email:string,first_name:string,id:RecordId< |"user">,image:string|undefined,joined:Date,last_name:string,password:string|undefined,phone_number:string,referrer:RecordId< |"user">|undefined,role:string|undefined,stripe_customer_id:string|undefined,updated_at:Date,},]
export type ResetPasswordVariables = {    password: string,
    user: RecordId< |"user">,
}
export const UserLoginQuery = "SELECT * FROM user WHERE email = $email AND password AND crypto::bcrypt::compare(password, $password) LIMIT 1;"
export type UserLoginResult = [Array<{calling_code:string,country_code:string,email:string,first_name:string,id:RecordId< |"user">,image:string|undefined,joined:Date,last_name:string,password:string|undefined,phone_number:string,referrer:RecordId< |"user">|undefined,role:string|undefined,stripe_customer_id:string|undefined,updated_at:Date,}>,]
export type UserLoginVariables = {    password: string,
    email: string,
}
export const PasswordResetGetUserQuery = "SELECT id, first_name, last_name, email FROM user WHERE email = string::lowercase($email);"
export type PasswordResetGetUserResult = [Array<{email:string,first_name:string,id:RecordId< |"user">,last_name:string,}>,]
export type PasswordResetGetUserVariables = {    email: string,
}
export const CreateUserQuery = "CREATE ONLY user SET email = $email, password = crypto::bcrypt::generate($password), first_name = $first_name, last_name = $last_name, phone_number = $phone_number, country_code = $country_code, calling_code = $calling_code, referrer = $referrer;"
export type CreateUserResult = [{calling_code:string,country_code:string,email:string,first_name:string,id:RecordId< |"user">,image:string|undefined,joined:Date,last_name:string,password:string|undefined,phone_number:string,referrer:RecordId< |"user">|undefined,role:string|undefined,stripe_customer_id:string|undefined,updated_at:Date,},]
export type CreateUserVariables = {    password: string,
    country_code: string,
    first_name: string,
    email: string,
    last_name: string,
    phone_number: string,
    calling_code: string,
    referrer?: RecordId< |"user">,
}
export type Queries = {
    [GetUserQuery]: {variables: never, result: GetUserResult }
    [ResetPasswordQuery]: {variables: ResetPasswordVariables, result: ResetPasswordResult }
    [UserLoginQuery]: {variables: UserLoginVariables, result: UserLoginResult }
    [PasswordResetGetUserQuery]: {variables: PasswordResetGetUserVariables, result: PasswordResetGetUserResult }
    [CreateUserQuery]: {variables: CreateUserVariables, result: CreateUserResult }
}


type QueryKeys = keyof Queries
type InferVariables<Q extends keyof Queries> = Queries[Q]["variables"]
type InferResult<Q extends keyof Queries> = Queries[Q]["result"]
type QueryWithVariables<Q extends QueryKeys> = InferVariables<Q> extends never ? Q : Q & string
type QueryWithoutVariables<Q extends QueryKeys> = InferVariables<Q> extends never ? Q : Exclude<Q, string>

Surreal.prototype.typed = function <Q extends keyof Queries, V extends InferVariables<Q>>(query: Q, variables?: V): Promise<InferResult<Q>> {
    return this.query(query, variables)
}

declare module "surrealdb.js" {
    interface Surreal {
        typed<Q extends QueryKeys>(query: QueryWithVariables<Q>, variables: InferVariables<Q>): Promise<InferResult<Q>>;
        typed<Q extends QueryKeys>(query: QueryWithoutVariables<Q>): Promise<InferResult<Q>>;
    }
}
