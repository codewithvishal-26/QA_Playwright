Feature: Login error validation

  @Validation
  Scenario Outline: Login fails with invalid credentials
    Given I log in with email "<username>" and password "<password>"
    Then I should see the error message "Incorrect email or password."

    Examples:
      | username                       | password      |
      | testuser1787810623872@test.com | WrongPass@123 |
      | nouser.invalid@test.com        | Strong@123    |
      | wrong.email@test.com           | Random@456    |