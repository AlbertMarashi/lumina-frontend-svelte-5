import { type RecordId, Surreal } from 'surrealdb.js';
export const StatementPageQuery = "RETURN { against: (SELECT statement[*], score, rating_avg, total_votes, 5 AS total_replies FROM scored_statement WHERE statement.replying.to = $statement AND statement.replying.side = 'against'), current: (SELECT statement[*], score, rating_avg, total_votes, 5 AS total_replies FROM ONLY scored_statement:[$statement]), support: (SELECT statement[*], score, rating_avg, total_votes, 5 AS total_replies FROM scored_statement WHERE statement.replying.to = $statement AND statement.replying.side = 'support') };"
export type StatementPageResult = [{against:Array<{rating_avg:number,score:number,statement:{author:RecordId< |'user'>,content:string,created_at:Date,id:RecordId< |'statement'>,replying_to:RecordId< |'statement'>|undefined,side:string|undefined,updated_at:Date,},total_replies:number,total_votes:number,}>,current:{rating_avg:number,score:number,statement:{author:RecordId< |'user'>,content:string,created_at:Date,id:RecordId< |'statement'>,replying_to:RecordId< |'statement'>|undefined,side:string|undefined,updated_at:Date,},total_replies:number,total_votes:number,},support:Array<{rating_avg:number,score:number,statement:{author:RecordId< |'user'>,content:string,created_at:Date,id:RecordId< |'statement'>,replying_to:RecordId< |'statement'>|undefined,side:string|undefined,updated_at:Date,},total_replies:number,total_votes:number,}>,},]
export type StatementPageVariables = {    statement: RecordId< |'statement'>,}
export const ResetPasswordQuery = "UPDATE ONLY $user SET password = crypto::bcrypt::generate($password);"
export type ResetPasswordResult = [{calling_code:string,country_code:string,email:string,first_name:string,id:RecordId< |'user'>,image:string|undefined,joined:Date,last_name:string,password:string|undefined,phone_number:string,referrer:RecordId< |'user'>|undefined,role:string|undefined,stripe_customer_id:string|undefined,updated_at:Date,},]
export type ResetPasswordVariables = {    user: RecordId< |'user'>,    password: string,}
export const UserLoginQuery = "SELECT * FROM user WHERE email = $email AND password AND crypto::bcrypt::compare(password, $password) LIMIT 1;"
export type UserLoginResult = [Array<{calling_code:string,country_code:string,email:string,first_name:string,id:RecordId< |'user'>,image:string|undefined,joined:Date,last_name:string,password:string|undefined,phone_number:string,referrer:RecordId< |'user'>|undefined,role:string|undefined,stripe_customer_id:string|undefined,updated_at:Date,}>,]
export type UserLoginVariables = {    email: string,    password: string,}
export const PasswordResetGetUserQuery = "SELECT id, first_name, last_name, email FROM user WHERE email = string::lowercase($email);"
export type PasswordResetGetUserResult = [Array<{email:string,first_name:string,id:RecordId< |'user'>,last_name:string,}>,]
export type PasswordResetGetUserVariables = {    email: string,}
export const GetUserQuery = "SELECT id, first_name, last_name, email, role FROM $auth LIMIT 1;"
export type GetUserResult = [Array<{email:string,first_name:string,id:RecordId< |'user'>,last_name:string,role:string|undefined,}>,]
export const CreateUserQuery = "CREATE ONLY user SET email = $email, password = crypto::bcrypt::generate($password), first_name = $first_name, last_name = $last_name, phone_number = $phone_number, country_code = $country_code, calling_code = $calling_code, referrer = $referrer;"
export type CreateUserResult = [{calling_code:string,country_code:string,email:string,first_name:string,id:RecordId< |'user'>,image:string|undefined,joined:Date,last_name:string,password:string|undefined,phone_number:string,referrer:RecordId< |'user'>|undefined,role:string|undefined,stripe_customer_id:string|undefined,updated_at:Date,},]
export type CreateUserVariables = {    password: string,    phone_number: string,    last_name: string,    country_code: string,    referrer?: RecordId< |'user'>,    email: string,    calling_code: string,    first_name: string,}
export const CreateStatementQuery = "CREATE statement CONTENT $statement;"
export type CreateStatementResult = [Array<{author:RecordId< |'user'>,content:string,created_at:Date,id:RecordId< |'statement'>,replying_to:RecordId< |'statement'>|undefined,side:string|undefined,updated_at:Date,}>,]
export type Queries = {
    [StatementPageQuery]: {variables: StatementPageVariables, result: StatementPageResult }
    [ResetPasswordQuery]: {variables: ResetPasswordVariables, result: ResetPasswordResult }
    [UserLoginQuery]: {variables: UserLoginVariables, result: UserLoginResult }
    [PasswordResetGetUserQuery]: {variables: PasswordResetGetUserVariables, result: PasswordResetGetUserResult }
    [GetUserQuery]: {variables: never, result: GetUserResult }
    [CreateUserQuery]: {variables: CreateUserVariables, result: CreateUserResult }
    [CreateStatementQuery]: {variables: never, result: CreateStatementResult }
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
