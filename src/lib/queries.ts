import { type RecordId, Surreal } from "$lib/pojo_surreal"
export const UserCountQuery = "SELECT VALUE count FROM ONLY user_count LIMIT 1;"
export type UserCountResult = [number | undefined,]
export const StatementPageQuery = "SELECT *, (SELECT *, (SELECT *, (SELECT id, rating FROM statement_vote WHERE statement = $parent.id AND user = $auth)[0] AS my_rating, (SELECT rating_avg, total_votes, score FROM ONLY statement_score:[$parent.id]) AS vote_data, (SELECT * FROM ONLY statement_author_data:[$parent.id]) AS author_data, (SELECT VALUE total_replies FROM ONLY statement_replies:[$parent.id]) AS total_replies FROM statement WHERE id = $parent.replying_to LIMIT 1)[0] AS replying_to, (SELECT id, rating FROM statement_vote WHERE statement = $parent.id AND user = $auth)[0] AS my_rating, (SELECT rating_avg, total_votes, score FROM ONLY statement_score:[$parent.id]) AS vote_data, (SELECT * FROM ONLY statement_author_data:[$parent.id]) AS author_data, (SELECT VALUE total_replies FROM ONLY statement_replies:[$parent.id]) AS total_replies FROM statement WHERE id = $parent.replying_to LIMIT 1)[0] AS replying_to, (SELECT id, rating FROM statement_vote WHERE statement = $parent.id AND user = $auth)[0] AS my_rating, (SELECT rating_avg, total_votes, score FROM ONLY statement_score:[$parent.id]) AS vote_data, (SELECT * FROM ONLY statement_author_data:[$parent.id]) AS author_data, (SELECT VALUE total_replies FROM ONLY statement_replies:[$parent.id]) AS total_replies, (SELECT *, (SELECT id, rating FROM statement_vote WHERE statement = $parent.id AND user = $auth)[0] AS my_rating, (SELECT rating_avg, total_votes, score FROM ONLY statement_score:[$parent.id]) AS vote_data, (SELECT * FROM ONLY statement_author_data:[$parent.id]) AS author_data, (SELECT VALUE total_replies FROM ONLY statement_replies:[$parent.id]) AS total_replies FROM statement WHERE replying_to = $statement AND side = 'support') AS support, (SELECT *, (SELECT id, rating FROM statement_vote WHERE statement = $parent.id AND user = $auth)[0] AS my_rating, (SELECT rating_avg, total_votes, score FROM ONLY statement_score:[$parent.id]) AS vote_data, (SELECT * FROM ONLY statement_author_data:[$parent.id]) AS author_data, (SELECT VALUE total_replies FROM ONLY statement_replies:[$parent.id]) AS total_replies FROM statement WHERE replying_to = $statement AND side = 'against') AS against FROM ONLY $statement;"
export type StatementPageResult = [{against:Array<{author:RecordId< |'user'>,author_data?:{author_name:string,id:RecordId< |'statement_author_data'>,},content:string,created_at:Date,id:RecordId< |'statement'>,my_rating?:{id:RecordId< |'statement_vote'>,rating:number,},replying_to?:RecordId< |'statement'>,side?:string,tags?:Array<string>,total_replies?:number,updated_at:Date,vote_data?:{rating_avg:number,score:number,total_votes:number,},}>,author:RecordId< |'user'>,author_data?:{author_name:string,id:RecordId< |'statement_author_data'>,},content:string,created_at:Date,id:RecordId< |'statement'>,my_rating?:{id:RecordId< |'statement_vote'>,rating:number,},replying_to?:{author:RecordId< |'user'>,author_data?:{author_name:string,id:RecordId< |'statement_author_data'>,},content:string,created_at:Date,id:RecordId< |'statement'>,my_rating?:{id:RecordId< |'statement_vote'>,rating:number,},replying_to?:{author:RecordId< |'user'>,author_data?:{author_name:string,id:RecordId< |'statement_author_data'>,},content:string,created_at:Date,id:RecordId< |'statement'>,my_rating?:{id:RecordId< |'statement_vote'>,rating:number,},replying_to?:RecordId< |'statement'>,side?:string,tags?:Array<string>,total_replies?:number,updated_at:Date,vote_data?:{rating_avg:number,score:number,total_votes:number,},},side?:string,tags?:Array<string>,total_replies?:number,updated_at:Date,vote_data?:{rating_avg:number,score:number,total_votes:number,},},side?:string,support:Array<{author:RecordId< |'user'>,author_data?:{author_name:string,id:RecordId< |'statement_author_data'>,},content:string,created_at:Date,id:RecordId< |'statement'>,my_rating?:{id:RecordId< |'statement_vote'>,rating:number,},replying_to?:RecordId< |'statement'>,side?:string,tags?:Array<string>,total_replies?:number,updated_at:Date,vote_data?:{rating_avg:number,score:number,total_votes:number,},}>,tags?:Array<string>,total_replies?:number,updated_at:Date,vote_data?:{rating_avg:number,score:number,total_votes:number,},} | undefined,]
export type StatementPageVariables = {statement:RecordId< |'statement'>,}
export const ResetPasswordQuery = "UPDATE ONLY $user SET password = crypto::bcrypt::generate($password);"
export type ResetPasswordResult = [{calling_code:string,country_code:string,email:string,first_name:string,id:RecordId< |'user'>,image?:string,joined:Date,last_name:string,password?:string,phone_number:string,referrer?:RecordId< |'user'>,role?:string,stripe_customer_id?:string,updated_at:Date,},]
export type ResetPasswordVariables = {password:string,user:RecordId< |'user'>,}
export const VoteForStatementQuery = "CREATE statement_vote CONTENT $vote;"
export type VoteForStatementResult = [Array<{created_at:Date,id:RecordId< |'statement_vote'>,rating:number,statement:RecordId< |'statement'>,updated_at:Date,user:RecordId< |'user'>,}>,]
export type VoteForStatementVariables = {vote:(|Array<{id?:RecordId< |'statement_vote'>,rating:number,statement:RecordId< |'statement'>,user?:RecordId< |'user'>,}>|{id?:RecordId< |'statement_vote'>,rating:number,statement:RecordId< |'statement'>,user?:RecordId< |'user'>,}),}
export const PasswordResetGetUserQuery = "SELECT id, first_name, last_name, email FROM user WHERE email = string::lowercase($email);"
export type PasswordResetGetUserResult = [Array<{email:string,first_name:string,id:RecordId< |'user'>,last_name:string,}>,]
export type PasswordResetGetUserVariables = {email:string,}
export const CreateUserQuery = "CREATE ONLY user SET email = $email, password = crypto::bcrypt::generate($password), first_name = $first_name, last_name = $last_name, phone_number = $phone_number, country_code = $country_code, calling_code = $calling_code, referrer = $referrer;"
export type CreateUserResult = [{calling_code:string,country_code:string,email:string,first_name:string,id:RecordId< |'user'>,image?:string,joined:Date,last_name:string,password?:string,phone_number:string,referrer?:RecordId< |'user'>,role?:string,stripe_customer_id?:string,updated_at:Date,},]
export type CreateUserVariables = {calling_code:string,country_code:string,email:string,first_name:string,last_name:string,password:string,phone_number:string,referrer?:RecordId< |'user'>,}
export const UserLoginQuery = "SELECT * FROM user WHERE email = $email AND password AND crypto::bcrypt::compare(password, $password) LIMIT 1;"
export type UserLoginResult = [Array<{calling_code:string,country_code:string,email:string,first_name:string,id:RecordId< |'user'>,image?:string,joined:Date,last_name:string,password?:string,phone_number:string,referrer?:RecordId< |'user'>,role?:string,stripe_customer_id?:string,updated_at:Date,}>,]
export type UserLoginVariables = {email:string,password:string,}
export const AddStatementQuery = "CREATE statement CONTENT $statement;"
export type AddStatementResult = [Array<{author:RecordId< |'user'>,content:string,created_at:Date,id:RecordId< |'statement'>,replying_to?:RecordId< |'statement'>,side?:string,tags?:Array<string>,updated_at:Date,}>,]
export type AddStatementVariables = {statement:(|Array<{author?:RecordId< |'user'>,content:string,id?:RecordId< |'statement'>,replying_to?:RecordId< |'statement'>,side?:string,tags?:Array<string>,}>|{author?:RecordId< |'user'>,content:string,id?:RecordId< |'statement'>,replying_to?:RecordId< |'statement'>,side?:string,tags?:Array<string>,}),}
export const LoadTownHallQuery = "SELECT *, (SELECT id, rating FROM statement_vote WHERE statement = $parent.id AND user = $auth)[0] AS my_rating, (SELECT rating_avg, total_votes, score FROM ONLY statement_score:[$parent.id]) AS vote_data, (SELECT * FROM ONLY statement_author_data:[$parent.id]) AS author_data, (SELECT VALUE total_replies FROM ONLY statement_replies:[$parent.id]) AS total_replies FROM statement WHERE replying_to = NONE AND (array::len($tags) == 0 OR tags ANYINSIDE $tags);"
export type LoadTownHallResult = [Array<{author:RecordId< |'user'>,author_data?:{author_name:string,id:RecordId< |'statement_author_data'>,},content:string,created_at:Date,id:RecordId< |'statement'>,my_rating?:{id:RecordId< |'statement_vote'>,rating:number,},replying_to?:RecordId< |'statement'>,side?:string,tags?:Array<string>,total_replies?:number,updated_at:Date,vote_data?:{rating_avg:number,score:number,total_votes:number,},}>,]
export type LoadTownHallVariables = {tags:Array<string>,}
export const UpdateStatementVoteQuery = "UPDATE $vote SET rating = $rating;"
export type UpdateStatementVoteResult = [Array<{created_at:Date,id:RecordId< |'statement_vote'>,rating:number,statement:RecordId< |'statement'>,updated_at:Date,user:RecordId< |'user'>,}>,]
export type UpdateStatementVoteVariables = {rating:number,vote:RecordId< |'statement_vote'>,}
export const GetUserQuery = "SELECT id, first_name, last_name, email, (SELECT VALUE true FROM application WHERE application.user == $parent.id LIMIT 1)[0] AS has_citizenship_application, role FROM $auth LIMIT 1;"
export type GetUserResult = [Array<{email:string,first_name:string,has_citizenship_application?:boolean,id:RecordId< |'user'>,last_name:string,role?:string,}>,]
export const CreateApplicationQuery = "CREATE ONLY application CONTENT $application;"
export type CreateApplicationResult = [{application:any,application_type:string,created_at:Date,id:RecordId< |'application'>,updated_at:Date,},]
export type CreateApplicationVariables = {application:(|Array<{application:any,application_type:string,id?:RecordId< |'application'>,}>|{application:any,application_type:string,id?:RecordId< |'application'>,}),}
export type Queries = {
    [UserCountQuery]: {variables: never, result: UserCountResult }
    [StatementPageQuery]: {variables: StatementPageVariables, result: StatementPageResult }
    [ResetPasswordQuery]: {variables: ResetPasswordVariables, result: ResetPasswordResult }
    [VoteForStatementQuery]: {variables: VoteForStatementVariables, result: VoteForStatementResult }
    [PasswordResetGetUserQuery]: {variables: PasswordResetGetUserVariables, result: PasswordResetGetUserResult }
    [CreateUserQuery]: {variables: CreateUserVariables, result: CreateUserResult }
    [UserLoginQuery]: {variables: UserLoginVariables, result: UserLoginResult }
    [AddStatementQuery]: {variables: AddStatementVariables, result: AddStatementResult }
    [LoadTownHallQuery]: {variables: LoadTownHallVariables, result: LoadTownHallResult }
    [UpdateStatementVoteQuery]: {variables: UpdateStatementVoteVariables, result: UpdateStatementVoteResult }
    [GetUserQuery]: {variables: never, result: GetUserResult }
    [CreateApplicationQuery]: {variables: CreateApplicationVariables, result: CreateApplicationResult }
}


export type Variables<Q extends keyof Queries> = Queries[Q]["variables"] extends never ? [] : [Queries[Q]["variables"]]

export class TypedSurreal extends Surreal {
    typed<Q extends keyof Queries>(query: Q, ...rest: Variables<Q>): Promise<Queries[Q]["result"]> {
        return this.query(query, rest[0])
    }
}
