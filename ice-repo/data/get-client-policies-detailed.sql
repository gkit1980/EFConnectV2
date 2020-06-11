  SELECT JSON_OBJECT(
              'policy_state' is policy_state, 
              'policy_id' is policy_id, 
              'policy_no' is policy_no,
              'policy_name' IS policy_name,
              'insr_type' is insr_type, 
              'product_name' is product_name,
              'package_code' IS package_code,
              'is_expired' IS is_expired,
              'policy_state_name' is policy_state_name, 
              'client_id' IS client_id,
              'pid' is pid,
              'man_id' IS man_id,
              'client_name' is client_name, 
              'insr_begin' is insr_begin, 
              'insr_end' is insr_end,
              'insr_duration' is insr_duration,
              'insr_duration_unit' is insr_duration_unit,
              'premium_amnt' IS premium_amnt,
              'active_claims' is active_claims, 
              'engagement_id' is engagement_id, 
              'engagement_no' is engagement_no, 
              'engagement_name' is engagement_name, 
              'quote_id' is quote_id, 
              'quote_no' is quote_no, 
              'quote_status' is quote_status, 
              'quote_status_name' is quote_status_name,
              'insured_objects' is (
                    SELECT JSON_ARRAYAGG( JSON_OBJECT('object_id' is io.object_id, 'object_name' is object_name) ) 
                      FROM insured_object io
                          LEFT JOIN insured_object_names ion
                            ON ion.insured_obj_id = io.insured_obj_id
                        WHERE io.policy_id = policy_id_for_object
                          AND open_date >= io.insr_begin
                          AND open_date <= io.insr_end ) )
          FROM ( 
        WITH od AS (SELECT sys_days.get_open_date AS open_date FROM dual)
        SELECT pol.policy_state, pol.policy_id, pol.policy_id AS policy_id_for_object, pol.policy_no, pol.policy_name, pol.insr_type,
              hit.name AS product_name,
              (SELECT package_type
                  FROM ( SELECT package_type, rank() over (ORDER BY PACKAGE_id desc) AS rnk
                          FROM gen_packages GP
                          WHERE policy_id = pol.policy_id
                            AND annex_id = 0
                            AND selected_package = 'Y' )
                WHERE rnk = 1) AS package_code, CASE WHEN od.open_date > pol.insr_end THEN 1 ELSE 0 END AS is_expired,
              CASE WHEN pol.policy_state IN (-3, -2, -1) THEN 'Application'
                            WHEN pol.policy_state = -4 THEN 'Quotation'
                            WHEN pol.policy_state = -30 THEN 'Canceled'
                            ELSE 'Policy' END AS policy_state_name, pn.client_id,
              pn.client_pid AS pid, pn.client_man_id AS man_id, pn.client_name, pol.insr_begin, pol.insr_end, pol.insr_duration, pol.dur_dimension as insr_duration_unit, 
              LTRIM(TO_CHAR( (SELECT SUM(amount)
                                  FROM blc_policy_payment_plan
                                WHERE policy_id = pol.policy_id
                                  AND amnt_type = 'DUE' ), 9999990.99 )) AS premium_amnt,  
             ( SELECT NVL( SUM( DECODE( clm.claim_state, -1, 1, 1, 1, 0)), 0 )
                 FROM ( SELECT c.claim_id, MIN(cr.claim_state) AS claim_state
                          FROM insis_gen_v10.claim c
                                    INNER JOIN insis_gen_v10.claim_request cr ON c.claim_id = cr.claim_id
                         WHERE c.policy_id = pol.policy_id
                         GROUP BY c.claim_id ) clm ) AS active_claims, pe.engagement_id, pe.engagement_no, pe.engagement_name, 
              peq.quote_id, peq.quote_no, peq.status as quote_status, hsv.NAME AS quote_status_name, od.open_date
          FROM policy pol
        CROSS JOIN od
          LEFT JOIN h_insr_type hit
            ON hit.id = pol.insr_type
          LEFT JOIN policy_names pn
            ON pn.policy_id = pol.policy_id
          LEFT JOIN policy_eng_policies pep
            ON pep.policy_id = pol.policy_id
          LEFT JOIN policy_engagement pe
            ON pe.engagement_id = pep.engagement_id
          LEFT JOIN policy_engagement_quote peq
            ON peq.quote_id = pep.quote_id
          LEFT JOIN hst_status_value hsv
            ON hsv.id = peq.status 
        WHERE pol.policy_state <> -10
          AND pol.policy_id LIKE NVL(:policy_id, pol.policy_id)
            AND pol.policy_no LIKE NVL(:policy_no, pol.policy_no)
            AND pol.policy_name LIKE NVL(:policy_name, pol.policy_name)
            AND pol.insr_type = NVL(:insr_type, pol.insr_type)
            AND (:policy_state IS NULL
                  OR :policy_state = CASE WHEN pol.policy_state = -4 THEN 'Quotation'
                                          WHEN pol.policy_state IN (-3, -2, -1) THEN 'Application'
                                          WHEN pol.policy_state IN (-30) THEN 'Canceled'
                                          ELSE 'Policy' END)
            AND (:p_client IS NULL OR pn.client_pid = :p_client OR pn.client_name LIKE :p_client)
            AND (:p_insr_end IS NULL OR pol.insr_end < to_date( :p_insr_end, 'yyyy-MM-dd' ) + 1)
          ORDER BY policy_id DESC
          FETCH first 20 ROWS ONLY )