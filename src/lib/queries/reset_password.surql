<record<user>> $user;
<string> $password;

UPDATE ONLY $user SET
    password = crypto::bcrypt::generate($password);