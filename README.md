### Setup
- #### Issuer configuration
  Issuer is configured in a `.issuer-rc.json` file. Use the `.issuer-rc.json.example` file as a template:
  `cp .issuer-rc.json.example .issuer-rc.json` and enter configuration details.
  List of properties:<br>
  | Name        | Required | Description |
  | :---------- | :------: | :---------- |
  | name        |   Yes    | The name of the entity or organization |
  | url         |   Yes    | The homepage or social media profile of the entity |
  | email       |   Yes    | Issuer's contact address |
  | description |   No     | A short description of the issuer entity or organization |
  | telephone   |   No     | A phone number for the entity |
  | imagePath * |   No     | Relative path to Issuer's profile image |
  | publicKey   |   No     | A public PEM key |
  | privateKey  |   No     | A private PEM key |

  \* Issuer's image is optional and can be configured in two ways:
   - Persisted at desired path with that path specified as `imagePath` option.
   - Persisted in `server/assets` folder as `issuer-image.(jpg|jpeg|png|svg)`, and Badggio will locate the image automatically (`"imagePath": ""`). If you want to use some other file name or extension, please choose the previous option.
