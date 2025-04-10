terraform quick guide


getting set up


clean things up when it gets drifty
- delete local state files
- .terraform
- terraform.lock.hcl
- terraform.tfstate
- terraform.tfstate.backup
-run terraform init to build new state


aws resource list
https://registry.terraform.io/providers/hashicorp/aws/latest/docs


the basics
terraform init          Prepare your working directory for other commands
terraform validate      Check whether the configuration is valid
terraform plan          Show changes required by the current configuration
terraform apply         Create or update infrastructure
terraform destroy       Destroy previously-created infrastructure

list available commands
terraform state

list resources in play
terraform state list

print resource details
terraform show state <resource>

prints the var value after terraform apply completes
output "public_ip" {
        value = aws_eip.one.public_ip
}


print all outputs from last terraform apply
terraform output


refreshes state/lists outputs w/o running apply
terraform refresh


precision remove of resources w/o running destroy
terraform destroy -target aws_instance.webserver


add a specifc resource
terraform apply -target aws_instance.web


assign var from cli
terraform apply -var "subnet_prefix=10.20.30.40/32"


variable file
-create terraform.tfvars
-add variables to the file
-terraform will check the file for vars when run

example:
--------------------------------------
variable "aws_access_key" {
        type = string
        description = "aws access key"
        sensitive = true
}
variable "aws_secret_key" {
        type = string
        description = "aws secret key"
        sensitive = true
}
--------------------------------------


reference a custom variable file (.tfvars)
-create file example.tfvars
-terraform apply -var-file example.tfvars


ref keys outside of git control
provider "aws" {
        region = "us-east-1"
        shared_credentials_file = "/users/person/.aws/credentials"
}


mark field as sensitive to mask value
locals {
        db_password = {
        admin = "password"
      }
}


data types
Collection
- list: ordered group of elements
- set: unordered group of unique elements
- map: key=value pair
structural
-allow you to mix data types stored
-tuple: equivalent to list
-object: equivalent to maps
Other
any: unknown type, list(any)
null: absence of value


list example
["us-east-1", "us-west-2"]


map example
{
        small = "t2.micro"
        medium = "t2.small"
        large = "t2.large"
}

reference collection values
var.<name_label>[<element_number>]
var.aws_regions[0]




supplying inputs
constructing values
specifying outputs
validate config
