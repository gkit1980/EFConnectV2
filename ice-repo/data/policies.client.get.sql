SELECT insr_type,
    product_name,
    policy_id,
    policy_no,
    policy_state,
    policy_state_name,
    insr_begin,
    insr_end,
    premium,
    currency,
    engagement_id,
    engagement_no,
    engagement_name,
    quote_id,
    quote_no,
    quote_status,
    quote_status_name,
    rejection_reason_id,
    rejection_reason_name
FROM (
    WITH
    pol_info AS
( SELECT p.*, pn.client_pid
FROM policy p, policy_names pn
WHERE pn.policy_id = p.policy_id
    AND pn.client_pid = :PID )
,
    eng_info AS
( SELECT pe.engagement_id, pe.engagement_no, pe.engagement_name, peq.quote_id, peq.quote_no, peq.status, pep.policy_id,
    peq.rejection_reason, hrr.NAME, hsv.NAME AS quote_status_name
FROM policy_eng_policies pep,
    policy_engagement_quote peq,
    policy_engagement pe,
    h_reject_reason hrr,
    hst_status_value hsv,
    pol_info pi
WHERE pep.quote_id = peq.quote_id
    AND pe.engagement_id = pep.engagement_id
    AND pep.policy_id = pi.policy_id
    AND peq.rejection_reason = hrr.id(+)
    AND peq.status = hsv.id(+) )
,
    grc AS
(SELECT a.policy_id
                       , SUM(full_premium *
                                decode(a.currency ,io.iv_currency ,1
                                    ,currency.cross_rate(a.currency, io.iv_currency, nvl(ga.date_given, p.date_given)))) AS grc_premium
                       , SUM(add_premium  *
                                    decode(a.currency ,io.iv_currency , 1
                                    ,currency.cross_rate(a.currency, io.iv_currency, nvl(ga.date_given, p.date_given)))) AS add_premium
FROM gen_risk_covered a, gen_annex ga, insured_object io, pol_info p
WHERE a.policy_id = ga.policy_id(+)
    AND a.annex_id = ga.annex_id(+)
    AND a.insured_obj_id = io.insured_obj_id
    AND p.policy_id = a.policy_id
GROUP BY  a.policy_id)
,
            wp AS
(SELECT a.policy_id
                       , SUM(risk_amnt *
                            decode(a.currency
                           ,io.iv_currency
                           ,1
                           ,currency.cross_rate(a.currency, io.iv_currency, nvl(ga.date_given, p.date_given)))) AS wp_premium
FROM prem_inst_wp a, gen_annex ga, insured_object io, pol_info p
WHERE a.policy_id = ga.policy_id(+)
    AND a.annex_id = ga.annex_id(+)
    AND a.insured_obj_id = io.insured_obj_id
    AND p.policy_id = a.policy_id
    AND fraction_type NOT IN (SELECT tax_type
    FROM gen_premium_taxes
    WHERE policy_id = a.policy_id
        AND included = 'NO'
                                                )
GROUP BY a.policy_id )
,
            prem_tab AS
( SELECT grc.policy_id,
    CASE WHEN NVL(grc.add_premium, 0) = 0
                      THEN GREATEST ( NVL( wp.wp_premium, grc.grc_premium), 0)
                      ELSE GREATEST ( grc.grc_premium, 0)
                  END AS prm
FROM grc, wp
WHERE grc.policy_id = wp.policy_id )

SELECT pi.client_pid AS pid,
    p.client_id,
    p.insr_type,
    hit.name AS product_name,
    p.policy_id,
    p.policy_no,
    p.policy_state,
    hps.NAME AS policy_state_name,
    p.insr_begin,
    p.insr_end,
    NVL( prem_tab.prm, 0 ) AS premium,
    pol_values.Get_policy_currency( p.policy_id ) AS currency,
    eng_info.engagement_id,
    eng_info.engagement_no,
    eng_info.engagement_name,
    eng_info.quote_id,
    eng_info.quote_no,
    eng_info.status AS quote_status,
    eng_info.quote_status_name,
    eng_info.rejection_reason AS rejection_reason_id,
    eng_info.NAME AS rejection_reason_name
FROM policy p,
    h_insr_type hit,
    pol_info pi,
    hs_policy_state hps,
    prem_tab,
    eng_info
WHERE p.policy_state <> -10
    AND hit.id = p.insr_type
    AND pi.policy_id = p.policy_id
    AND p.policy_id = prem_tab.policy_id(+)
    AND p.policy_state = hps.id(+)
    AND p.policy_id = eng_info.policy_id(+)
ORDER BY p.policy_id DESC
)
