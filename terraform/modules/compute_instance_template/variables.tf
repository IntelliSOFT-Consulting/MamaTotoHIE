variable "instance_name" {
  description = "Name of the instance template"
  type        = string
}

variable "project" {
  description = "The project ID"
  type        = string
}

variable "machine_type" {
  description = "The machine type for the instance template"
  type        = string
  default     = "e2-custom-2-8704"
}
