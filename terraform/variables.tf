variable "project_id" {
  description = "The ID of the project to which resources will be added"
  type        = string
}

variable "region" {
  description = "The region where resources will be created"
  type        = string
}

variable "zone" {
  description = "The zone where resources will be created"
  type        = string
}

variable "ssh_keys" {
  description = "The ssh keys will be created"
  type        = string
}