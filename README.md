# Contract-Consent Agent

## Overview

The **Contract-Consent Agent** is a library designed to integrate seamlessly with the **contract-manager** and **consent-manager**. It facilitates consent and contract profile management, negotiation automation, and personalized recommendations while providing a robust routing system for efficient operation.

The design document for this project can be found [here](./docs/design-document.md).

Although the design document displays example endpoints for the library, they are not meant to be used independently without context. Endpoints related to contracts should be tested within the [contract-manager](https://github.com/prometheus-x-association/contract-manager), while those for consents and consent profiles are active within the [consent-manager](https://github.com/prometheus-x-association/consent-manager).

## Features

- **Consent Profile Management**: Enables user profiles in the consent-manager.
- **Contract Profile Management**: Enables contract profiles for organizations.
- **Contract Negotiation Management**: Automates negotiation rules and conditions.
- **DataProvider Configuration**: Supports configuration for managing profiles and data.

## Usage

The **Contract-Consent Agent** is a library meant to be integrated into projects such as:

- [Consent Manager](https://github.com/Prometheus-X-association/consent-manager)
- [Contract Manager](https://github.com/Prometheus-X-association/contract-manager)

### Integration Guide

#### Requirements

The library works in projects built on [express](https://www.npmjs.com/package/express) as it extends the routers with additionnal endpoints. It is also required for the project to have a `Mongo` database to feed into the library.

1. Install the library:

   ```bash
   npm install https://gitpkg.now.sh/Prometheus-X-association/contract-consent-agent?VERSION
   ```

2. Create the config file and add your settings.

3. Initialize the library in your `main.ts`:

   ```typescript
   import { Agent, ConsentAgent } from 'contract-agent';
   import path from 'path';
   import fs from 'fs';

   const configFilePath = path.resolve(
     __dirname,
     '../consent-agent.config.json',
   );
   if (fs.existsSync(configFilePath)) {
     Agent.setConfigPath('../consent-agent.config.json', __filename);
     Agent.setProfilesHost('profiles');
     await ConsentAgent.retrieveService();
   }
   ```

4. Add the required router in your project:

   ```typescript
   import { ConsentAgentRouter } from 'contract-agent';

   app.use('/consents', consentRouter);
   app.use('/', verifyUserJWT, ConsentAgentRouter);
   ```

#### Configuration file

The configuration file (`contract-agent.config.json`) defines settings to be used by the library instance where it is installed. Below is an example:

| Parameter         | Description                                                                                                                                           |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **source**        | The name of the target collection or table that the DataProvider connects to.                                                                         |
| **url**           | The base URL of the database host.                                                                                                                   |
| **dbName**        | The name of the database to be used.                                                                                                                 |
| **watchChanges**  | A boolean that enables or disables change monitoring for the DataProvider. When enabled, events will be fired upon detecting changes.                 |
| **hostsProfiles** | A boolean indicating whether the DataProvider hosts the profiles.                                                                                   |
| **existingDataCheck** | A boolean that enables the creation of profiles when the module is initialized.                                                                    |

```json
{
  "source": "profiles",
  "url": "mongodb://localhost:27017",
  "dbName": "contract_consent_agent_db",
  "watchChanges": false,
  "hostsProfiles": true,
  "existingDataCheck": true
}
```

## Building and Testing

To build the project or test it independently, you can clone this repository.

### Build the Project

```bash
pnpm build
```

### Run Tests

To run tests, you are going to need a mongo database

```bash
pnpm test
```

#### Independent Tests

```bash
pnpm test-cca-contract
pnpm test-cca-consent
```

#### Generate Test Reports

```bash
pnpm report-cca-contract
pnpm report-cca-consent
```

## API Documentation

The API is documented using Swagger. To generate `swagger.json`, run:

```bash
npm run swagger
```

> The swagger.json file can also be found [here](./docs/swagger.json)

### Example Endpoints

- **Get Recommendations**: `GET /profile/{profileId}/recommendations/consent`
- **Set Preferences**: `POST /profile/{profileId}/preferences`
- **Negotiate Contract**: `POST /negotiation/contract/negotiate`

## Architecture

The system consists of:

1. **Contract Agent**: Manages contract profiles and automates negotiation.
2. **Consent Agent**: Handles consent preferences and automates responses.

## Standards & Compliance

The library supports:

- **Data Standards**: JSON-LD, ISO 3166-1 alpha-2, ISO 8601, ODRL
- **Logging & Debugging**: Logs operations, errors, and warnings for easy troubleshooting.

## Contributing

Contributions are welcome! Submit a pull request or open an issue for enhancements or bug fixes.

## License

This project is licensed under the **MIT License**.

## Contact

For more information, please contact the project maintainers.
