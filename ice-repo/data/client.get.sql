SELECT
    p.GNAME,
    p.FNAME,
    p.BIRTH_DATE,
    p.SEX,
    p.egn as pid,
    MAX(a.COUNTRY_CODE) as country_code,
    MAX(a.ADDRESS) as ADDRESS,
    MAX(c1.DETAILS) AS phone,
    MAX(c2.DETAILS) AS email
FROM p_people p
LEFT JOIN p_address a ON a.man_id = p.man_id
LEFT JOIN p_contacts c1 ON c1.man_id = p.man_id AND c1.contact_type = 'MOBILE' and c1.primary_flag = 'Y'
LEFT JOIN p_contacts c2 ON c2.man_id = p.man_id AND c2.contact_type = 'EMAIL' and c2.primary_flag = 'Y'
WHERE p.man_id = :manid
GROUP BY p.GNAME,
    p.FNAME,
    p.BIRTH_DATE,
    p.SEX,
    p.egn
FETCH first 1 ROWS ONLY
