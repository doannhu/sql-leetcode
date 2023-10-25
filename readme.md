## 1070. Product Sales Analysis III
Write a solution to select the product id, year, quantity, and price for the first year of every product sold.

solution 1:
```sql
select product_id, year first_year, quantity, price
from (
    select *, 
        rank() over (partition by product_id order by year) rk 
    from Sales
) t
where rk = 1
```

solution 2:
```sql
select product_id, year first_year, quantity, price
from Sales
where (product_id, year) in (select product_id, min(year)
                            from Sales group by 1)
```

## 1045. Customers Who Bought All Products
Write a solution to report the customer ids from the Customer table that bought all the products in the Product table.

solution:
```sql
select customer_id
from customer
group by 1
having count(distinct product_key) = (select count(distinct product_key) from Product)
```

## 180. Consecutive Numbers

solution 1: (pass 9/21 cases)

```sql
select num ConsecutiveNums from Logs group by 1 having count(num) > 3

```

solution 2:
```sql
SELECT Num,
       CASE
         WHEN @prev = Num THEN @cnt := @cnt + 1  -- when clause 1
         WHEN (@prev := Num) IS NOT NULL THEN @cnt := 1  -- when clause 2
       END AS cnt
FROM Logs, (SELECT @prev := NULL, @cnt := NULL) t1

```













