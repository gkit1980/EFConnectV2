SELECT
    JSON_OBJECT('policy_id' IS policy_id,
    'policy_no' IS policy_no,
    'insr_type' IS insr_type,
    'insr_type_name' IS itname,
    'claim_id' IS claim_id,
    'claim_no' IS claim_regid,
    'registration_date' IS registration_date,
    'event_date' IS event_date,
    'event_type' IS event_type,
    'event_place' IS event_place,
    'event_country' IS event_country,
    'event_type_name' IS ename,
    'client_id' IS client_pid,
    'client_type' IS man_comp,
    'client_name' IS peoname,
    'claim_state' IS croclaim_state,
    'claim_details' IS (SELECT JSON_OBJECT( 'claim_state_name' IS cs.name,
                                           'claim_state_aux' IS  cr2.claim_state_aux,
                                           'claim_state_aux_name' IS csa.name,
                                           'claim_FNOL'           IS CASE NVL(cr2.claim_state, 101010)
                                                                     WHEN -1 THEN 'YES'
                                                                     WHEN 101010 THEN 'YES'
                                                                     ELSE 'NO' END)
                        FROM claim clcl
                        LEFT JOIN claim_request cr2 on clcl.claim_id = cr2.claim_id
                        LEFT JOIN hs_claim_state cs ON cr2.claim_state=cs.id
                        LEFT JOIN hs_claim_state_aux csa ON cr2.claim_state_aux=csa.id
                        WHERE clcl.claim_id = claim_side
                        AND (cr2.request_id = crorequest_id OR crorequest_id IS NULL)
                        AND (cs.name LIKE :claim_status or :claim_status is null)
                        AND ((:p_fulltext IS NULL) OR (cs.name LIKE :p_fulltext))
                        ),

    'total' is ceil(count(*) over ()) ) as jsonRowItem
FROM (
    WITH cldata AS (select p.policy_id, p.policy_no, p.insr_type, it.name as itname, c.claim_id, c.claim_regid, c.registration_date,
       c.event_date,c.event_type, c.event_place, c.event_country, e.name as ename, pn.client_pid, peo.man_comp, c.claim_id AS claim_side,
       peo.name as peoname
FROM claim c
INNER JOIN p_clients cl ON c.client_id=cl.client_id
INNER JOIN p_people peo ON cl.man_id=peo.man_id
INNER JOIN policy_names pn ON pn.policy_id = c.policy_id
INNER JOIN policy p ON c.policy_id=p.policy_id
INNER JOIN h_insr_type it ON p.insr_type=it.id
INNER JOIN h_event_list e ON c.event_type=e.id
WHERE pn.client_pid LIKE NVL(:client_pid, pn.client_pid)
  AND peo.name LIKE NVL(:client_name, peo.name)
  AND (:event_date_from IS NULL OR (c.event_date >= to_date(:event_date_from, 'yyyy-MM-dd')))
  AND (:event_date_to IS NULL OR (c.event_date <= to_date(:event_date_to, 'yyyy-MM-dd')))
  AND (:claim_date_from IS NULL OR (c.registration_date >= to_date(:claim_date_from, 'yyyy-MM-dd')))
  AND (:claim_date_to IS NULL OR (c.registration_date <= to_date(:claim_date_to , 'yyyy-MM-dd')))
  AND e.name LIKE NVL(:event_type, e.name)
  AND p.policy_no LIKE NVL(:policy_no, p.policy_no)
  AND p.insr_type LIKE NVL(:product_id, p.insr_type)
  AND c.claim_regid LIKE NVL(:claim_no, c.claim_regid)
  AND ((:p_fulltext IS NULL) OR (
    p.policy_no LIKE :p_fulltext OR
    p.insr_type LIKE :p_fulltext OR
    c.claim_regid LIKE :p_fulltext OR
    e.name LIKE :p_fulltext OR
    peo.name LIKE :p_fulltext OR
    pn.client_pid LIKE :p_fulltext)))
SELECT cro.claim_state as croclaim_state, cro.claim_state_aux as croclaim_state_aux,
cro.request_id as crorequest_id,  cda.claim_id AS croclaim_id,cda.*
FROM cldata cda
LEFT JOIN claim_request cro on cda.claim_id =cro.claim_id
ORDER BY cda.policy_id DESC
OFFSET :offset ROWS
FETCH first :page_size ROWS ONLY)
