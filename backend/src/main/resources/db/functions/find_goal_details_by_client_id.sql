CREATE OR REPLACE FUNCTION find_goal_details_by_client_id(p_client_id UUID)
RETURNS TABLE (
    clientId          UUID,
    bodyParamName     VARCHAR,
    bodyTestName      VARCHAR,
    unitName          VARCHAR,
    action           VARCHAR,
    value            VARCHAR
)
LANGUAGE plpgsql -- ✅ Dodajemy język PL/pgSQL
AS $$
DECLARE
    user_language VARCHAR(32);
BEGIN
    -- Pobranie języka użytkownika
    SELECT dl.code::TEXT
    INTO user_language
    FROM user_details ud
    JOIN dict_languages dl ON ud.dict_language_id = dl.id
    JOIN clients c ON ud.user_id = c.user_id
    WHERE c.id = p_client_id;

    -- Domyślny język, jeśli NULL
    IF user_language IS NULL THEN
        user_language := 'en';
    END IF;

    -- Pobranie danych z przetłumaczonymi wartościami
    RETURN QUERY
    SELECT
        g.client_id,
        COALESCE(dbp.name ->> user_language, dbp.name ->> 'en', 'Unknown')::VARCHAR AS bodyParamName,
        COALESCE(dbtb.name ->> user_language, dbtpu.name ->> user_language, dbtb.name ->> 'en', 'Unknown')::VARCHAR AS bodyTestName,
        COALESCE(dub.name ->> user_language, dupu.name ->> user_language, dub.name ->> 'en', 'Unknown')::VARCHAR AS unitName,
        g.action,
        g.value
    FROM goals g
    INNER JOIN dict_body_params dbp ON g.dict_body_param_id = dbp.id
    LEFT JOIN dict_body_test dbt ON g.dict_body_test_id = dbt.id
    LEFT JOIN dict_body_test_basic dbtb ON dbt.dict_body_test_basic_id = dbtb.id
    LEFT JOIN dict_body_test_per_user dbtpu ON dbt.dict_body_test_per_user_id = dbtpu.id
    INNER JOIN dict_units du ON g.dict_unit_id = du.id
    LEFT JOIN dict_units_basic dub ON du.dict_units_basic_id = dub.id
    LEFT JOIN dict_units_per_user dupu ON du.dict_units_per_user_id = dupu.id
    WHERE g.client_id = p_client_id;
END;
$$;
