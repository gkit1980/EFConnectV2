-- SELECT JSON_OBJECT('event_type_id' IS all_events.event_type,
--                    'event_type' IS ev_name.name )
SELECT all_events.event_type, ev_name.name
FROM TABLE(insis_gen_cfg_v10.rb_cs_nom.c_ClaimEventTable) all_events
INNER JOIN h_event_list ev_name on all_events.event_type = ev_name.id
WHERE UPPER(ev_name.name) LIKE UPPER(NVL(:event_type, ev_name.name)) || '%'
AND all_events.insr_type LIKE NVL(:insr_type, all_events.insr_type)
AND ((:p_fulltext IS NULL) OR (all_events.insr_type LIKE :p_fulltext))
AND ((:p_fulltext IS NULL) OR (ev_name.name LIKE :p_fulltext))
GROUP BY ev_name.name, all_events.event_type
ORDER BY all_events.event_type DESC
OFFSET :offset ROWS
FETCH first :page_size ROWS ONLY
