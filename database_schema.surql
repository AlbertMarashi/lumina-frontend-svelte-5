-----------------
-- USER TABLE --
-----------------
DEFINE TABLE user SCHEMAFULL
    PERMISSIONS
        FOR SELECT
            WHERE id = $auth
            -- OR ... let users see other users if... temporary disabled
        FOR UPDATE
            # Allow users to update their own details
            WHERE id = $auth;

DEFINE FIELD first_name ON TABLE user TYPE string;
DEFINE FIELD last_name ON TABLE user TYPE string;
DEFINE FIELD email ON TABLE user TYPE string
    VALUE string::lowercase($value)
    ASSERT string::is::email($value);
DEFINE FIELD joined ON TABLE user TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE user TYPE datetime VALUE time::now();
DEFINE FIELD image ON TABLE user TYPE option<string>;
DEFINE FIELD calling_code ON TABLE user TYPE string;
DEFINE FIELD country_code ON TABLE user TYPE string;
DEFINE FIELD phone_number ON TABLE user TYPE string;
DEFINE FIELD role ON TABLE user TYPE option<string>;
DEFINE FIELD stripe_customer_id ON TABLE user TYPE option<string>;
DEFINE FIELD referrer ON TABLE user TYPE option<record<user>>;
# Users can have no password because of oauth
# Must be bcrypted
DEFINE FIELD password ON TABLE user TYPE option<string>
    # Disable users from changing or reading their password
    # May allow them to change their own password in the future
    PERMISSIONS NONE;

DEFINE INDEX email_index ON TABLE user COLUMNS email UNIQUE;

-------------------
-- ACCOUNT TABLE --
-------------------
DEFINE TABLE account SCHEMAFULL;

DEFINE FIELD provider_id ON TABLE account TYPE string;
DEFINE FIELD provider ON TABLE account TYPE string;
DEFINE FIELD user ON TABLE account TYPE record<user>;

DEFINE INDEX search_by_user ON TABLE account COLUMNS user;
DEFINE INDEX search_by_provider ON TABLE account COLUMNS provider, provider_id;



----------------
-- USER SCOPE --
----------------
DEFINE SCOPE users;
-- This needs to be generated using `openssl rand -hex 32`
-- DEFINE TOKEN siteforge_token on SCOPE users type HS256 VALUE "RANDOM_SECRET_KEY_HEX";

-----------------
-- APPLICATION --
-----------------
DEFINE TABLE application SCHEMAFULL
    PERMISSIONS
        FOR SELECT, CREATE, UPDATE WHERE user = $auth;

DEFINE FIELD created_at ON TABLE application TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE application TYPE datetime VALUE time::now();
DEFINE FIELD application ON TABLE application FLEXIBLE TYPE object;
DEFINE FIELD application_type ON TABLE application TYPE string;

-----------------
-- QUESTION ASSESSMENTS --
-----------------


-----------------
--

------------------
-- ORGANISATION --
------------------

-- DEFINE TABLE organisation SCHEMAFULL
--     PERMISSIONS
--         FOR SELECT, UPDATE WHERE <-member<-user CONTAINS $auth;

-- DEFINE FIELD name ON TABLE organisation TYPE string;
-- DEFINE FIELD created_at ON organisation TYPE datetime DEFAULT time::now();
-- DEFINE FIELD updated_at ON organisation TYPE datetime VALUE time::now();
-- DEFINE FIELD stripe_customer_id ON TABLE organisation TYPE string;

-- DEFINE INDEX search_by_stripe_customer_id ON TABLE organisation COLUMNS stripe_customer_id UNIQUE;

-----------------
-- BRAND TABLE --
-----------------
-- DEFINE TABLE brand SCHEMAFULL
--     PERMISSIONS
--         FOR SELECT, CREATE, DELETE, UPDATE WHERE organisation<-member<-user CONTAINS $auth;

-- DEFINE FIELD name ON TABLE brand TYPE string;
-- DEFINE FIELD created_at ON TABLE brand TYPE datetime DEFAULT time::now();
-- DEFINE FIELD updated_at ON TABLE brand TYPE datetime VALUE time::now();
-- DEFINE FIELD organisation ON TABLE brand TYPE record<organisation>;
-- DEFINE FIELD website ON TABLE brand TYPE option<string>;
-- DEFINE FIELD industry ON TABLE brand TYPE option<string>;
-- DEFINE FIELD generation_instructions ON TABLE brand TYPE option<string>;
-- DEFINE FIELD reader_feelings ON TABLE brand TYPE option<array<string>>;
-- DEFINE FIELD tone_of_voice ON TABLE brand TYPE option<array<string>>;
-- DEFINE FIELD offerings ON TABLE brand FLEXIBLE TYPE option<array<object>>;
-- DEFINE FIELD summary ON TABLE brand TYPE option<string>;

-- DEFINE INDEX search_by_organisation ON TABLE brand COLUMNS organisation;

------------------
-- MEMBER TABLE --
------------------
-- DEFINE TABLE member SCHEMAFULL
--     PERMISSIONS
--         FOR SELECT, CREATE, DELETE, UPDATE WHERE ->organisation<-member<-user CONTAINS $auth;

-- DEFINE FIELD in ON TABLE member TYPE record<user>;
-- DEFINE FIELD out ON TABLE member TYPE record<organisation>;
-- DEFINE FIELD role ON TABLE member TYPE string;
-- DEFINE FIELD invited_by ON TABLE member TYPE option<record<user>>;
-- DEFINE FIELD date_invited ON TABLE member TYPE option<datetime>;
-- DEFINE FIELD date_joined ON TABLE member TYPE datetime DEFAULT time::now();

-- DEFINE INDEX unique_memberships ON TABLE member COLUMNS in, out UNIQUE;

---------------------
-- PENDING INVITES --
---------------------
-- DEFINE TABLE pending_invite SCHEMAFULL
--     PERMISSIONS
--         FOR SELECT, CREATE, DELETE, UPDATE WHERE organisation<-member<-user CONTAINS $auth;

-- DEFINE FIELD organisation ON TABLE pending_invite TYPE record<organisation>;
-- DEFINE FIELD email ON TABLE pending_invite TYPE string
--     VALUE string::lowercase($value)
--     ASSERT string::is::email($value);
-- DEFINE FIELD date_invited ON TABLE pending_invite TYPE datetime DEFAULT time::now();
-- DEFINE FIELD invited_by ON TABLE pending_invite TYPE record<user> DEFAULT $auth;
-- DEFINE FIELD role ON TABLE pending_invite type string;
-- DEFINE FIELD name ON TABLE pending_invite type string;

-- DEFINE INDEX unique_invites ON TABLE pending_invite COLUMNS organisation, email UNIQUE;

-----------------
-- PAGES TABLE --
-----------------
-- DEFINE TABLE page SCHEMAFULL
--     PERMISSIONS
--         FOR SELECT, CREATE, DELETE, UPDATE WHERE brand.organisation<-member<-user CONTAINS $auth;

-- DEFINE FIELD url ON TABLE page TYPE string;
-- DEFINE FIELD created_at ON TABLE page TYPE datetime DEFAULT time::now();
-- DEFINE FIELD updated_at ON TABLE page TYPE datetime VALUE time::now();
-- DEFINE FIELD brand ON TABLE page TYPE record<brand>;
-- DEFINE FIELD inputs ON TABLE page FLEXIBLE TYPE option<object>;
-- DEFINE FIELD outputs ON TABLE page FLEXIBLE TYPE  option<object>;
-- DEFINE FIELD is_collection ON TABLE page TYPE bool DEFAULT false;
-- DEFINE FIELD parent ON TABLE page TYPE option<record<page>>;

-- DEFINE INDEX search_by_brand ON TABLE page COLUMNS brand;
-- DEFINE INDEX parent_url_unique ON TABLE page COLUMNS brand, parent, url UNIQUE;

-- DEFINE FIELD langfuse_uuid ON TABLE page TYPE string DEFAULT rand::uuid();
-- DEFINE FIELD sections ON TABLE page TYPE array<record<section>> DEFAULT [];

-- DEFINE EVENT on_delete_delete_subpages ON TABLE page
--     WHEN $event == "DELETE"
--     THEN (
--         DELETE FROM page WHERE parent = $before.id
--     );

--------------------
-- SECTIONS TABLE --
--------------------
-- DEFINE TABLE section SCHEMAFULL
--     PERMISSIONS
--         FOR SELECT, CREATE, DELETE, UPDATE WHERE page.brand.organisation<-member<-user CONTAINS $auth;

-- // Potential fine tuning data for future AI training
-- DEFINE FIELD wireframe_prompt ON TABLE section TYPE string;
-- DEFINE FIELD infill_prompt ON TABLE section TYPE string;
-- DEFINE FIELD initial_index ON TABLE section TYPE int;

-- DEFINE FIELD page ON TABLE section TYPE record<page>;
-- DEFINE FIELD created_at ON TABLE section TYPE datetime DEFAULT time::now();
-- DEFINE FIELD current_version ON TABLE section TYPE int DEFAULT 0;
-- DEFINE FIELD style ON TABLE section TYPE string;

-- DEFINE FIELD versions ON TABLE section FLEXIBLE TYPE array<object>;
-- DEFINE FIELD versions.*.wireframe ON TABLE section FLEXIBLE TYPE object;
-- DEFINE FIELD versions.*.infills ON TABLE section FLEXIBLE TYPE object;
-- DEFINE FIELD versions.*.updated_at ON TABLE section TYPE datetime DEFAULT time::now();

-- DEFINE INDEX search_by_page ON TABLE section COLUMNS page;

--------------
-- FEEDBACK --
--------------

-- DEFINE TABLE feedback SCHEMAFULL
--     PERMISSIONS
--         FOR SELECT, CREATE WHERE user = $auth;

-- DEFINE FIELD user ON TABLE feedback TYPE record<user>;
-- DEFINE FIELD type ON TABLE feedback TYPE string;
-- DEFINE FIELD comment ON TABLE feedback TYPE option<string>;
-- DEFINE FIELD created_at ON TABLE feedback TYPE datetime DEFAULT time::now();
-- DEFINE FIELD rating ON TABLE feedback TYPE int;
-- DEFINE FIELD metadata ON TABLE feedback FLEXIBLE TYPE option<object>;

----------------
-- TEMPORARY MIGRATION --
----------------
-- UPDATE page SET sections = [], langfuse_uuid = rand::uuid() WHERE sections IS NONE AND langfuse_uuid IS NONE;