resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-${var.project}-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "aks-${var.project}-${var.environment}"
  sku_tier            = "Free"

  default_node_pool {
    name            = "system"
    node_count      = 1
    vm_size         = var.aks_vm_size
    os_disk_size_gb = 30
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}

# Let the cluster's nodes pull images from our registry (read-only)
resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                            = azurerm_container_registry.acr.id
  role_definition_name             = "AcrPull"
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  skip_service_principal_aad_check = true
}