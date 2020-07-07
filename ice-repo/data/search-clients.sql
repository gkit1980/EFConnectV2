  SELECT client_id, man_id, pid, NAME, GNAME, FNAME, BIRTH_DATE, SEX, TYPE, MAX(city) AS city, MAX(COUNTRY_CODE) as COUNTRY_CODE,
              COUNT(DISTINCT CASE WHEN open_date BETWEEN insr_begin AND insr_end THEN policy_id ELSE NULL END) AS num_active_policies,
              COUNT(DISTINCT claim_id) AS num_active_claims
            FROM (
          WITH od AS (SELECT sys_days.get_open_date AS open_date FROM dual)
          SELECT c.client_id, c.man_id, p.egn AS pid, NVL(pc.NAME, p.NAME) AS NAME, p.FNAME, p.GNAME, p.BIRTH_DATE, p.SEX, pmc.NAME AS TYPE, a.city, a.COUNTRY_CODE,
                od.open_date, io.insr_begin, io.insr_end, io.policy_id,
                co.claim_id
            FROM p_clients c CROSS JOIN od
          INNER JOIN p_people p
              ON p.man_id = c.man_id
            LEFT JOIN p_people_changes pc
              ON pc.man_id = p.man_id
            AND od.open_date BETWEEN NVL(pc.valid_from, od.open_date) AND NVL(pc.valid_to, od.open_date)
            LEFT JOIN p_address a
              ON a.man_id = p.man_id
            LEFT JOIN hst_people_man_comp pmc
              ON pmc.id = p.man_comp
            LEFT JOIN policy pol
              ON pol.client_id = c.client_id
            AND pol.policy_state BETWEEN 0 AND 30
            LEFT JOIN insured_object io
              ON io.policy_id = pol.policy_id
            LEFT JOIN claim clm
              ON clm.client_id = c.client_id
            LEFT JOIN claim_objects co 
              ON co.claim_id = clm.claim_id
            AND co.claim_state = 1 
            WHERE ( p.egn LIKE NVL(:client_pid_name, p.egn)
                  OR NVL(pc.NAME, p.NAME) LIKE NVL(:client_pid_name, NVL(pc.NAME, p.NAME)) )
            AND pmc.id = NVL(:cl_type, pmc.id) --0,1,2
            AND (:city IS NULL OR (:city IS NOT NULL AND a.city LIKE :city)))
          GROUP BY client_id, man_id, pid, NAME, TYPE, FNAME, GNAME, BIRTH_DATE, SEX
          FETCH first 20 ROWS ONLY