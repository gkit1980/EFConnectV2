SELECT
    p.policy_id,
    p.policy_no,
    p.insr_type,
    it.name AS insr_type_name, 
    c.claim_id, 
    c.claim_regid AS claim_no, 
    c.registration_date,
    c.event_date,
    c.event_type,
    c.event_place,
    c.event_country,
    e.name AS event_type_name,
    cr.claim_state,
    cs.name AS claim_state_name,
    cr.claim_state_aux,
    csa.name AS claim_state_aux_name
FROM claim c
INNER JOIN claim_request cr ON c.claim_id=cr.claim_id
INNER JOIN p_clients cl ON c.client_id=cl.client_id
INNER JOIN p_people peo ON cl.man_id=peo.man_id
INNER JOIN policy p ON c.policy_id=p.policy_id
INNER JOIN h_insr_type it ON p.insr_type=it.id
INNER JOIN h_event_list e ON c.event_type=e.id
INNER JOIN hs_claim_state cs ON cr.claim_state=cs.id
LEFT OUTER JOIN hs_claim_state_aux csa ON cr.claim_state_aux=csa.id
WHERE 
    peo.egn=:PID
            