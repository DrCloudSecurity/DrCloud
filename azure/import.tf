# import pre-existing resources

# first attempt at importing
# resource "rg_sb_eastus_250496_1_174084373172" "example-rg" {
#    name = "existingrg"
#    location = "eastus"
# }

# 2nc attempt, this works
# resource "azurerm_resource_group" "example" {
#   name     = "rg_sb_eastus_250496_1_174084373172"
#   location = "eastus"
# }