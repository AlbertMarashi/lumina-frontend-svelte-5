<string> $email;
<string> $password;

SELECT
    *
FROM user WHERE
    email = $email AND
    password AND
    crypto::bcrypt::compare(password, $password) LIMIT 1