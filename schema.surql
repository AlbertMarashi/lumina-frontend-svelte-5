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
            WHERE id = $auth
        FOR CREATE
            WHERE true;

DEFINE FIELD first_name ON TABLE user TYPE string;
DEFINE FIELD last_name ON TABLE user TYPE string;
DEFINE FIELD email ON TABLE user TYPE string
    VALUE string::lowercase($value)
    ASSERT string::is::email($value);
DEFINE FIELD joined ON TABLE user TYPE datetime VALUE time::now() READONLY;
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
    PERMISSIONS
        FOR DELETE, SELECT WHERE false
        FOR UPDATE WHERE id = $auth
        FOR CREATE WHERE true;

DEFINE INDEX email_index ON TABLE user COLUMNS email UNIQUE;

DEFINE TABLE user_count AS SELECT count() FROM user GROUP ALL
    PERMISSIONS
        FOR SELECT WHERE true;

-------------------
-- ACCOUNT TABLE --
-------------------
DEFINE TABLE account SCHEMAFULL;

DEFINE FIELD provider_id ON TABLE account TYPE string;
DEFINE FIELD provider ON TABLE account TYPE string;
DEFINE FIELD user ON TABLE account TYPE record<user>;

DEFINE INDEX search_by_user ON TABLE account COLUMNS user;
DEFINE INDEX search_by_provider ON TABLE account COLUMNS provider, provider_id;
DEFINE INDEX compound_unique_account ON TABLE account COLUMNS user, provider, provider_id UNIQUE;



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
        FOR SELECT, CREATE, UPDATE WHERE $auth AND application.user = $auth;

DEFINE FIELD created_at ON TABLE application TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD updated_at ON TABLE application TYPE datetime VALUE time::now();
DEFINE FIELD application ON TABLE application FLEXIBLE TYPE object;
DEFINE FIELD application_type ON TABLE application TYPE string;

-----------------
-- QUESTION ASSESSMENTS --
-----------------
DEFINE TABLE question_assessment SCHEMAFULL
    PERMISSIONS
        FOR SELECT, CREATE, UPDATE, DELETE WHERE $auth AND user = $auth;

DEFINE FIELD user ON TABLE question_assessment TYPE record<user> READONLY;
DEFINE FIELD updated_at ON TABLE question_assessment TYPE datetime VALUE time::now();
DEFINE FIELD created_at ON TABLE question_assessment TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD course_slug ON TABLE question_assessment TYPE string READONLY;
DEFINE FIELD unit_slug ON TABLE question_assessment TYPE string READONLY;
DEFINE FIELD question_slug ON TABLE question_assessment TYPE string READONLY;
DEFINE FIELD answer ON TABLE question_assessment TYPE string;
DEFINE FIELD feedback ON TABLE question_assessment TYPE string;
DEFINE FIELD assessment ON TABLE question_assessment TYPE string;

DEFINE INDEX compound_unique_assessment ON TABLE question_assessment COLUMNS user, course_slug, unit_slug, question_slug UNIQUE;

-------------------
-- UNIT PROGRESS --
-------------------
DEFINE TABLE unit_progress SCHEMAFULL
    PERMISSIONS
        FOR SELECT, CREATE, UPDATE, DELETE WHERE $auth AND user = $auth;

DEFINE FIELD user ON TABLE unit_progress TYPE record<user> READONLY;
DEFINE FIELD updated_at ON TABLE unit_progress TYPE datetime VALUE time::now();
DEFINE FIELD created_at ON TABLE unit_progress TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD status ON TABLE unit_progress TYPE string;
DEFINE FIELD unit_slug ON TABLE unit_progress TYPE string READONLY;
DEFINE FIELD course_slug ON TABLE unit_progress TYPE string READONLY;

DEFINE INDEX compound_unique_progress ON TABLE unit_progress COLUMNS user, course_slug, unit_slug UNIQUE;

-----------------
-- STATEMENTS --
-----------------

DEFINE TABLE statement SCHEMAFULL
    PERMISSIONS
        -- let anyone see statements
        FOR SELECT WHERE true

        -- let users create statements
        FOR CREATE WHERE $auth AND author = $auth

        -- prevent users from updating or deleting their statements after 5 minutes
        FOR UPDATE, DELETE WHERE created_at < time::now() + duration::mins(5);

DEFINE FIELD author ON TABLE statement TYPE record<user> DEFAULT $auth READONLY;
DEFINE FIELD created_at ON TABLE statement TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD updated_at ON TABLE statement TYPE datetime VALUE time::now();
DEFINE FIELD replying_to ON TABLE statement TYPE option<record<statement>> READONLY;
DEFINE FIELD side ON TABLE statement TYPE option<string> READONLY; -- "support" or "against"
DEFINE FIELD content ON TABLE statement TYPE string;
DEFINE FIELD tags ON TABLE statement TYPE option<set<string>>;

DEFINE INDEX search_by_author ON TABLE statement COLUMNS author;

DEFINE EVENT on_delete_delete_children_and_votes ON TABLE statement
    WHEN $event == "DELETE"
    THEN {
        DELETE FROM statement_vote WHERE statement = $before.id;
        DELETE FROM statement WHERE replying_to = $before.id;
        DELETE FROM statement_author_data WHERE id = statement_author_data:[$before.id];
        DELETE FROM statement_replies WHERE id = statement_replies:[$before.id];
    };

---------------------
-- STATEMENT VOTES --
---------------------

DEFINE TABLE statement_vote SCHEMAFULL
    PERMISSIONS
        FOR SELECT, CREATE, UPDATE, DELETE WHERE $auth AND user = $auth;

DEFINE FIELD user ON TABLE statement_vote TYPE record<user> DEFAULT $auth READONLY;
DEFINE FIELD rating ON TABLE statement_vote TYPE int ASSERT $value >= 0 AND $value <= 4; -- 0 = disagree, 5 = agree
DEFINE FIELD created_at ON TABLE statement_vote TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD updated_at ON TABLE statement_vote TYPE datetime VALUE time::now();
DEFINE FIELD statement ON TABLE statement_vote TYPE record<statement> READONLY; -- The statement that was voted on

-- Unique compound index on the user, statement so that a user can only vote once on a statement
DEFINE INDEX compound_unique_statement_vote ON TABLE statement_vote COLUMNS user, statement UNIQUE;

------------------
-- LAUGH REACTS --
------------------

-- DEFINE TABLE laugh_react SCHEMAFULL
--     PERMISSIONS
--         FOR SELECT, CREATE, UPDATE, DELETE WHERE user = $auth;

-- DEFINE FIELD user ON TABLE laugh_react TYPE record<user>;
-- DEFINE FIELD created_at ON TABLE laugh_react TYPE datetime DEFAULT time::now() READONLY;
-- DEFINE FIELD statement ON TABLE laugh_react TYPE record<statement> READONLY; -- The statement that was laughed on

-- -- Unique compound index on the user, statement so that a user can only laugh once on a statement
-- DEFINE INDEX compound_unique_laugh_react ON TABLE laugh_react COLUMNS user, statement UNIQUE;

------------------------------
-- DEBATE SCORING AND VIEWS --
------------------------------

DEFINE TABLE statement_rating AS
    SELECT
        math::mean(<float> rating) AS rating_avg,
        count() as total_votes,
        statement
    FROM statement_vote
    GROUP BY statement;

DEFINE TABLE statement_score AS
    SELECT
        *,
        fn::calc_score(total_votes, rating_avg) AS score
    FROM statement_rating
    PERMISSIONS
        FOR SELECT WHERE true;

DEFINE TABLE statement_replies AS
    SELECT
        count() as total_replies,
        replying_to
    FROM statement
    WHERE replying_to IS NOT NONE
    GROUP BY replying_to
    PERMISSIONS
        FOR SELECT WHERE true;

DEFINE TABLE statement_author_data AS
    SELECT
        -- id as statement,
        id,
        author.first_name + " " + author.last_name AS author_name
    FROM statement
    GROUP BY id
    PERMISSIONS
        FOR SELECT WHERE true;

DEFINE FUNCTION fn::calc_score($vote_count: number, $average_rating: number) {
    RETURN <number> function($vote_count, $average_rating) {
        const [voteCount, averageRating] = arguments;
        return Math.log10(voteCount + 1.5) * averageRating;
    };
};

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