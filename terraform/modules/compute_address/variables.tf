variable "project" {
  description = "The project ID"
  type        = string
}

variable "region" {
  description = "The region where the address will be created"
  type        = string
}

variable "external_ip" {
  description = "External IP address"
  type        = string
}

variable "internal_ip" {
  description = "Internal IP address"
  type        = string
}

variable "address_type" {
  description = "address type"
  type        = string
}