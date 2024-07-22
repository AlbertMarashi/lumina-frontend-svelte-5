<set<string>> $tags;

SELECT
    *,
    ( SELECT id, rating FROM statement_vote WHERE statement = $parent.id AND user = $auth )[0] as my_rating,
    (
        SELECT
            rating_avg,
            total_votes,
            score
        FROM ONLY statement_score:[$parent.id]
    ) as vote_data,
    ( SELECT * FROM ONLY statement_author_data:[$parent.id] ) as author_data,
    ( SELECT VALUE total_replies FROM ONLY statement_replies:[$parent.id] ) as total_replies
FROM statement WHERE replying_to IS NONE AND (array::len($tags) == 0 OR tags ANYINSIDE $tags)