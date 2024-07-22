SELECT
    id,
    first_name,
    last_name,
    email,
    (SELECT VALUE true FROM application WHERE application.user == $parent.id LIMIT 1)[0] as has_citizenship_application,
    role
    -- TODO: get referral count
    -- TODO: citizenship status
FROM $auth LIMIT 1