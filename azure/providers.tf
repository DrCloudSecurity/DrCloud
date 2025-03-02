# set azure as provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.1.0"

    }
  }
}

# config azure provider
provider "azurerm" {
  features {}
  # disable access check
  resource_provider_registrations = "none"
  # need to update this w/every sandbox change
  subscription_id = "4f6a6eb9-27d0-4ed6-a31c-2bde135e2db6"
}