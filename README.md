### Setup
  - #### Issuer configuration
    Issuer is configured in a `.issuerrc.json` file. Use the `.issuerrc.json.example` file as a template.<br>
    List of properties:
    
    | Name        | Required | Description |
    | :---------- | :------: | :---------- |
    | name        |   Yes    | The name of the entity or organization |
    | url         |   Yes    | The homepage or social media profile of the entity |
    | email       |   Yes    | Issuer's contact address |
    | description |   No     | A short description of the issuer entity or organization |
    | telephone   |   No     | A phone number for the entity |
    | imagePath   |   No     | Absolute path to Issuer's profile image |
    | publicKey   |   No     | Absolute path to Issuer's public PEM key |
    | privateKey  |   No     | Absolute path to Issuer's private PEM key |
