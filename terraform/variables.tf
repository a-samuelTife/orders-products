variable "location" {
  description = "Azure region"
  type        = string
  default     = "westeurope"
}

variable "project" {
  description = "Project name, used in resource names"
  type        = string
  default     = "orders-products"
}

variable "environment" {
  description = "dev, staging or prod"
  type        = string
  default     = "dev"
}
variable "aks_vm_size" {
  description = "VM size for the AKS worker node"
  type        = string
  default     = "Standard_B2ls_v2"
}