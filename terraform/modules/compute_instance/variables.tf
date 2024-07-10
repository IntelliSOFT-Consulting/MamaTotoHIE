variable "instance_name" {
  description = "Name of the instance"
  type        = string
}

variable "machine_type" {
  description = "Type of the machine"
  type        = string
}

variable "zone" {
  description = "Zone of the instance"
  type        = string
}

variable "project_id" {
  description = "Project ID"
  type        = string
}

variable "auto_delete" {
  description = "Whether the boot disk should be auto-deleted"
  type        = bool
  default     = false
}

variable "disk_source" {
  description = "Source of the boot disk"
  type        = string
}

variable "device_name" {
  description = "Name of the device"
  type        = string
}

variable "disk_size" {
  description = "Size of the disk"
  type        = number
}

variable "disk_type" {
  description = "Type of the disk"
  type        = string
}

variable "network" {
  description = "Network URL"
  type        = string
}

variable "subnetwork" {
  description = "Subnetwork URL"
  type        = string
}

variable "nat_ip" {
  description = "NAT IP address"
  type        = string
}

variable "network_tier" {
  description = "Network tier"
  type        = string
  default     = "PREMIUM"
}

variable "automatic_restart" {
  description = "Whether the instance should automatically restart"
  type        = bool
  default     = true
}

variable "on_host_maintenance" {
  description = "Maintenance behavior"
  type        = string
  default     = "MIGRATE"
}

variable "service_account_email" {
  description = "Service account email"
  type        = string
}

variable "scopes" {
  description = "Service account scopes"
  type        = list(string)
}

variable "enable_integrity_monitoring" {
  description = "Enable integrity monitoring"
  type        = bool
  default     = true
}

variable "enable_vtpm" {
  description = "Enable vTPM"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Instance tags"
  type        = list(string)
}
