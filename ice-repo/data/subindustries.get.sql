SELECT subcode as code, name
FROM HT_PEOPLE_OCCUP_SUBCODE
WHERE status = 'A' and man_comp = :man_comp and code = :code
