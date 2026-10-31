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