WITH cte AS (
    SELECT p.date_covered,
           ias.fund_id  
    FROM insis_gen_v10.policy p,
         inv_account_structure ias
    WHERE p.policy_id = ias.policy_id
          AND p.policy_id =:policy_id
),cnt AS (
    SELECT COUNT(1) numOfFunds
    FROM  cte
),periods AS (
    SELECT /*+MATERIALIZE*/ DISTINCT TO_DATE(trunc(price_date),'dd/mm/yyyy') price_date
    FROM insis_ul_v10.ul_unit_prices
    WHERE price_date >= (SELECT date_covered FROM  cte WHERE ROWNUM = 1)
        AND price_type = 'SELL'
    ORDER BY TO_DATE(trunc(price_date),'dd/mm/yyyy') ASC
OFFSET :offset ROWS FETCH NEXT :fetchNext ROWS ONLY
),
fundPriceData as (
    SELECT /*+MATERIALIZE*/  fund_id,PRICE, PRICE_DATE 
    FROM insis_ul_v10.ul_unit_prices 
    WHERE  PRICE_TYPE='SELL' 
        AND price_date>= (SELECT date_covered FROM cte WHERE rownum =1)
        AND fund_id in (SELECT fund_id FROM cte)
    ORDER BY PRICE_DATE ASC   
    OFFSET :offset ROWS FETCH NEXT :fetchNext*(SELECT numOfFunds FROM cnt) ROWS ONLY
)
SELECT JSON_OBJECT( 'FundsNames' is (SELECT JSON_ARRAYAGG(ul_funds.fund_name) fund_name FROM insis_ul_v10.ul_funds WHERE fund_id in (select fund_id from cte)),
                    'periods' is (SELECT JSON_ARRAYAGG(price_date ORDER BY price_date asc RETURNING CLOB) FROM periods),
                    'Funds' is (SELECT JSON_ARRAYAGG( JSON_OBJECT('fundname' IS (SELECT FUND_NAME FROM insis_ul_v10.ul_funds S WHERE B.fund_id=S.FUND_ID),
                                                                  'Values' IS JSON_ARRAYAGG(price ORDER BY price_date asc RETURNING CLOB)
                                                                 )RETURNING CLOB
                                                    )
                                FROM  fundPriceData B                          
                                GROUP BY  fund_id
                                ),
                    'FundsPercentage' is (SELECT JSON_ARRAYAGG(JSON_OBJECT('name' is (SELECT fund_name FROM insis_ul_v10.ul_funds s WHERE ias.fund_id = s.fund_id),
                                                                           'value'is percentage
                                                                           )
                                                              )
                                          FROM inv_account_structure ias
                                          WHERE policy_id =:policy_id
                                          ) 
                  ) 
FROM dual;
