Feature: Customer

  Scenario: Create a customer with invalid data
    Given the API endpoint is "/api/v1/customer"
    And the request payload is:
      """
      {
        "name": "Cl",
        "phone": "35999552211",
        "cpf": "35999552211"
      }
      """
    When I send a POST request to the endpoint
    Then the response status should be 400
    And the response should contain:
      | field            | value                                               |
      | friendlyMessage  | Fail while trying to access POST - /api/v1/customer |
      | errorMessage     | Name must be greater than 3 and less than 100!      |
