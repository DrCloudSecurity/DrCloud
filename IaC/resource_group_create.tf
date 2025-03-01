resource "azurerm_resource_group" "example_group" {
  name     = "dev-resource-group"
  location = "eastus"
  tags = {
    environment = "dev"
  }
}