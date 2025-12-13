terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}

  subscription_id = "7ff0452d-4b5d-4884-9d6a-819b7f91d14f"
  tenant_id       = "9146c327-4309-4f4c-9705-7c189ec56c76"

  use_cli = true
}