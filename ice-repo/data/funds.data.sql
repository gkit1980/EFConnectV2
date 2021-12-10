WITH cte
AS
(
SELECT /*+MATERIALIZE*/ 
       DISTINCT
     to_date(trunc(price_date),'dd/mm/yyyy')price_date
       FROM ul_unit_prices 
        WHERE :price_date is null or price_date >= TO_DATE(:price_date,'dd/mm/yyyy')  AND PRICE_TYPE='SELL'
        order by  to_date(trunc(price_date),'dd/mm/yyyy') asc
)
SELECT json_object( 'FundsNames' is (SELECT JSON_ARRAYAGG(ul_funds.fund_name) fund_name FROM ul_funds ),
                    'periods' is (select json_arrayagg(price_date order by price_date asc) from cte),
                    'Funds' is (SELECT JSON_ARRAYAGG
                                    (
                                        JSON_OBJECT('fundname' IS (SELECT FUND_NAME FROM ul_funds S WHERE B.fund_id=S.FUND_ID),
                                                    'Values' IS JSON_ARRAYAGG(price order by price_date RETURNING CLOB)
                                                    )RETURNING CLOB
                                    )
                                FROM  ul_unit_prices B
                                WHERE :price_date is null or price_date >= TO_DATE(:price_date,'dd/mm/yyyy')  AND PRICE_TYPE='SELL' 
                                GROUP BY  fund_id
                                )RETURNING CLOB 
                    )
FROM dual;

