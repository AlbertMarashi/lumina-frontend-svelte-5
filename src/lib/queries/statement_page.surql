<record<statement>> $statement;

RETURN {
    current: (
        SELECT
            statement.*,
            score,
            rating_avg,
            total_votes,
            5 as total_replies
        FROM ONLY scored_statement:[$statement]
    ),
    support: (
        SELECT
            statement.*,
            score,
            rating_avg,
            total_votes,
            5 as total_replies
        FROM scored_statement WHERE statement.replying.to = $statement AND statement.replying.side = "support"
    ),
    against: (
        SELECT
            statement.*,
            score,
            rating_avg,
            total_votes,
            5 as total_replies
        FROM scored_statement WHERE statement.replying.to = $statement AND statement.replying.side = "against"
    )
}