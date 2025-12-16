resource "azurerm_resource_group" "rg" {
  name     = "rg-fractal-capstone"
  location = "centralindia"
}

resource "azurerm_container_registry" "acr" {
  name                = "fractalcapacr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"

  admin_enabled = true
}
# ---------------------------------------------------------
# App Service Plan (Linux, S1)
# ---------------------------------------------------------
resource "azurerm_service_plan" "appservice_plan" {
  name                = "asp-fractal-capstone"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  os_type  = "Linux"
  sku_name = "S1"

  # optional: keep default capacity = 1
}
resource "azurerm_linux_web_app" "frontend" {
  name                = "loan-frontend"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.appservice_plan.id

  site_config {
    always_on = true

    application_stack {
      docker_image_name   = "loan-frontend:webapp"
      docker_registry_url = "https://${azurerm_container_registry.acr.login_server}"
    }
  }

  app_settings = {
    WEBSITES_PORT = "80"
    BACKEND_URL = "loan-backend.azurewebsites.net"
    COLOR       = "blue"
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_linux_web_app" "backend" {
  name                = "loan-backend"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.appservice_plan.id

  site_config {
    always_on = true

    container_registry_use_managed_identity = true

    app_command_line = "uvicorn main:app --host 0.0.0.0 --port 8080"

    application_stack {
      docker_image_name   = "loan-backend:latest"
      docker_registry_url = "https://${azurerm_container_registry.acr.login_server}"
    }
  }

  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
    WEBSITES_PORT                       = "8080"
    COLOR                               = "blue"
  }

  identity {
    type = "SystemAssigned"
  }
}
