<string> $email;
<string> $password;
<string> $first_name;
<string> $last_name;
<string> $phone_number;
<string> $country_code;
<string> $calling_code;
<option<record<user>>> $referrer;

CREATE ONLY user SET
    email = $email,
    password = crypto::bcrypt::generate($password),
    first_name = $first_name,
    last_name = $last_name,
    phone_number = $phone_number,
    country_code = $country_code,
    calling_code = $calling_code,
    referrer = $referrer;