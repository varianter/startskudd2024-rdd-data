# Periodic seed functions RDD

Test project for Startskudd 2024 - Seeding test data for Rock Displacement Dashboard Elastic Search Index.

## Running locally

In `local.settings.json` be sure to set `KeyVault_Name` to the current unique key vault name. You should
also be added to the Developers group in Azure, and have done `az login` to use Default Credentials to get access to the key vault.

For running on emulators locally you should have [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite) installed and make sure it is running.

After setup:

1. Install dependencies `yarn`
1. Start locally: `yarn start`
1. Have fun
