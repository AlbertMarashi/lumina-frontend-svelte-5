<record<statement>> $statement;

SELECT
    *,
    (
        SELECT
            *,
                (
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
                FROM statement WHERE id = $parent.replying_to LIMIT 1
            )[0] as replying_to,
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
        FROM statement WHERE id = $parent.replying_to LIMIT 1
    )[0] as replying_to,
    ( SELECT id, rating FROM statement_vote WHERE statement = $parent.id AND user = $auth )[0] as my_rating,
    (
        SELECT
            rating_avg,
            total_votes,
            score
        FROM ONLY statement_score:[$parent.id]
    ) as vote_data,
    ( SELECT * FROM ONLY statement_author_data:[$parent.id] ) as author_data,
    ( SELECT VALUE total_replies FROM ONLY statement_replies:[$parent.id] ) as total_replies,
    (
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
        FROM statement WHERE replying_to = $statement AND side = "support"
    ) as support,
    (
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
        FROM statement WHERE replying_to = $statement AND side = "against"
    ) as against
FROM ONLY $statement