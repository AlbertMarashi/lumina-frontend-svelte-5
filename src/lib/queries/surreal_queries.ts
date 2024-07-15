import { type RecordId, Surreal } from "surrealdb.js"
export const MeQueryQuery = "SELECT id, first_name, last_name, email, role FROM ONLY $auth;"
export type MeQueryQueryResult = [{email:string,first_name:string,id:RecordId< |"user">,last_name:string,role:string|null,},];
export type MeQueryQueryVariables = {
    auth: RecordId< |"user">,
}

export const UserLoginQuery = "SELECT * FROM user WHERE email = $email AND password AND crypto::bcrypt::compare(password, $password) LIMIT 1;"
export type UserLoginQueryResult = [{calling_code:string,country_code:string,email:string,first_name:string,id:RecordId< |"user">,image:string|null,joined:Date,last_name:string,password:string|null,phone_number:string,referrer:RecordId< |"user">|null,role:string|null,stripe_customer_id:string|null,updated_at:Date,}[],];
export type UserLoginQueryVariables = {
    auth: RecordId< |"user">,
    password: string,
    email: string,
}

export class TypedSurreal extends Surreal {
    typed(query: typeof MeQueryQuery, variables: MeQueryQueryVariables): Promise<MeQueryQueryResult>;
    typed(query: typeof UserLoginQuery, variables: UserLoginQueryVariables): Promise<UserLoginQueryResult>;
    typed(query: string, variables: Record<string, unknown>): Promise<unknown[]> {
        return super.query(query, variables)
    }
};
