terraform {
  backend "azurerm" {
    resource_group_name  = "rg-fractal-capstone"
    storage_account_name = "tfstatefractal10122025"
    container_name       = "tfstate"
    key                  = "fractal-capstone.tfstate"
  }
}