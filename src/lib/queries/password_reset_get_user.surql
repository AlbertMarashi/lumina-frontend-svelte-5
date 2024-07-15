<string> $email;

SELECT id, first_name, last_name, email FROM user WHERE email = string::lowercase($email);