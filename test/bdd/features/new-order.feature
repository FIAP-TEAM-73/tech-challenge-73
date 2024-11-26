Feature: Order Page

Scenario: ask for order 
  Given a new order
  When request for a new order
  Then create a order sucessfully

  Scenario: payment order updated
  Given a order
  When callback payment
  Then update payment sucessfully