variable "project_id" {
  description = "The ID of the project to deploy resources"
  type        = string
}

variable "region" {
  description = "The region to deploy resources"
  type        = string
}

variable "zone" {
  description = "The zone to deploy resources"
  type        = string
}

variable "disk_size" {
  description = "Size of the disk in GB"
  type        = number
  default     = 80
}

variable "address_ip" {
  description = "External IP address"
  type        = string
}

variable "network_name" {
  description = "The name of the VPC network"
  type        = string
}

variable "subnetwork_name" {
  description = "The name of the subnetwork"
  type        = string
}

variable "machine_type" {
  description = "The type of machine"
  type        = string
  default     = "e2-custom-2-8704"
}

variable "service_account_email" {
  description = "Service account email"
  type        = string
}
