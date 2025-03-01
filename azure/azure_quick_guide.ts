// azure quick guide

getting started w/new sandbox
- run 'az login' to update creds
- update providers.tf w/subscription
-terraform init
-terraform plan


// import things we cannot change
terraform import "azurerm_resource_group.build5nines_web" "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SCUS-prod-build5nines-web-rg"



log in, test credentials
az login


list env details/tenant/user
az account show


update azure cli
az upgrade


terraform init/plan/apply


vm creation
vm: ubuntu
disk: hdd
size: B1,B2
