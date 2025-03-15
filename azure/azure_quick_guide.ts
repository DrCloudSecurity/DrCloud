// azure getting started guide

getting started w/new sandbox
// clear cache
az login --use-device-code
// another option
az account clear

- run 'az login' to update creds
- update providers.tf w/subscription
- update main.tf w/Resource Group
terraform init
terraform state list
terraform state rm <old resource>
terraform plan


// import things we cannot change
add a stanza to main.tf for the resource
// show RG name
az group show --name your-resource-group-name --query "{id:id}"
// rum import, replacing the end with the output above
terraform import azurerm_resource_group.example /subscriptions/{subscription-id}/resourceGroups/your-resource-group-name
// verify
terraform state list

in import.tf change 'name' field to just the resource id
// reconcile config
terraform plan



// rm resources you added
terraform state list
terraform state rm <name>


terraform.exe import "rg_sb_eastus_250496_1_174084373172.M
yResourceGroup" "/subscriptions/4f6a6eb9-27d0-4ed6-a31c-2bde135e2db6/resourceGroups/rg_sb_eastus_250496_1_174084373172"



log in, test credentials
az login


list env details/tenant/user
az account show


update azure cli
az upgrade


terraform init/plan/apply


vm creation
sg: eastus
vm: ubuntu
disk: hdd
size: B1,B2
