variable "instance_name" {
  description = "Name of the instance"
  type        = string
}

variable "project" {
  description = "The project ID"
  type        = string
}

variable "zone" {
  description = "The zone where the instance will be created"
  type        = string
}

variable "external_ip" {
  description = "External IP address"
  type        = string
}

variable "disk_source" {
  description = "Source of the boot disk"
  type        = string
}

variable "network_url" {
  description = "The network URL"
  type        = string
}

variable "subnetwork_url" {
  description = "The subnetwork URL"
  type        = string
}

variable "ssh_keys" {
  description = "SSH keys for the instance"
  type        = string
}
