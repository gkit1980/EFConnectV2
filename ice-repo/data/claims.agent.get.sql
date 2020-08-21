SELECT
    JSON_OBJECT('policy_id' IS p.policy_id,
    'policy_no' IS p.policy_no,
    'insr_type' IS p.insr_type,
    'insr_type_name' IS it.name,
    'claim_id' IS c.claim_id,
    'claim_no' IS c.claim_regid,
    'registration_date' IS c.registration_date,
    'event_date' IS c.event_date,
    'event_type' IS c.event_type,
    'event_place' IS c.event_place,
    'event_country' IS c.event_country,
    'event_type_name' IS e.name,
    'client_id' IS pn.client_pid,
    'client_type' IS peo.man_comp,
    'client_name' IS peo.name,
    'claim_state' IS cr.claim_state,
    'claim_state_name' IS  cs.name,
    'claim_state_aux' IS  cr.claim_state_aux,
    'total' is ceil(count(*) over ()),
    'claim_state_aux_name' IS csa.name )
FROM claim c
INNER JOIN claim_request cr ON c.claim_id=cr.claim_id
INNER JOIN p_clients cl ON c.client_id=cl.client_id
INNER JOIN p_people peo ON cl.man_id=peo.man_id
INNER JOIN policy_names pn ON pn.policy_id = c.policy_id
INNER JOIN policy p ON c.policy_id=p.policy_id
INNER JOIN h_insr_type it ON p.insr_type=it.id
INNER JOIN h_event_list e ON c.event_type=e.id
INNER JOIN hs_claim_state cs ON cr.claim_state=cs.id
LEFT OUTER JOIN hs_claim_state_aux csa ON cr.claim_state_aux=csa.id
WHERE pn.client_pid LIKE NVL(:client_pid, pn.client_pid)
  AND peo.name LIKE NVL(:client_name, peo.name)
  AND (:event_date_from IS NULL OR (c.event_date >= to_date(:event_date_from, 'yyyy-MM-dd')))
  AND (:event_date_to IS NULL OR (c.event_date <= to_date(:event_date_to, 'yyyy-MM-dd')))
  AND (:claim_date_from IS NULL OR (c.registration_date >= to_date(:claim_date_from, 'yyyy-MM-dd')))
  AND (:claim_date_to IS NULL OR (c.registration_date <= to_date(:claim_date_to , 'yyyy-MM-dd')))
  AND e.name LIKE NVL(:event_type, e.name)
  AND cs.name LIKE NVL(:claim_status, cs.name)
  AND p.policy_no LIKE NVL(:policy_no, p.policy_no)
  AND p.insr_type LIKE NVL(:product_id, p.insr_type)
  AND c.claim_regid LIKE NVL(:claim_no, c.claim_regid)
  AND ((:p_fulltext IS NULL) OR (
    p.policy_no LIKE :p_fulltext OR
    p.insr_type LIKE :p_fulltext OR
    c.claim_regid LIKE :p_fulltext OR
    cs.name LIKE :p_fulltext OR
    e.name LIKE :p_fulltext OR
    peo.name LIKE :p_fulltext OR
    pn.client_pid LIKE :p_fulltext))
ORDER BY p.policy_id DESC
OFFSET :offset ROWS
FETCH first :page_size ROWS ONLY


