provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

module "compute_disk" {
  source      = "./modules/compute_disk"
  disk_name   = "mamatoto-hie-disk"
  project     = var.project_id
  zone        = var.zone
}

module "compute_address" {
  source       = "./modules/compute_address"
  project      = var.project_id
  region       = var.region
  external_ip  = "35.204.24.214"
  internal_ip  = "10.128.0.2"
}

module "compute_firewall" {
  source      = "./modules/compute_firewall"
  project     = var.project_id
  network_url = "https://www.googleapis.com/compute/v1/projects/${var.project_id}/global/networks/default"
}

module "compute_instance" {
  source            = "./modules/compute_instance"
  instance_name     = "mamatoto-hie-server"
  project           = var.project_id
  zone              = var.zone
  external_ip       = "35.204.24.214"
  disk_source       = "https://www.googleapis.com/compute/v1/projects/${var.project_id}/zones/${var.zone}/disks/mamatoto-hie-disk"
  network_url       = "https://www.googleapis.com/compute/v1/projects/${var.project_id}/global/networks/default"
  subnetwork_url    = "https://www.googleapis.com/compute/v1/projects/${var.project_id}/regions/${var.region}/subnetworks/default"
  ssh_keys          = "mnyagah:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCq+IQoHY1Ymgi0nyCwKnFqCf5zj7HlbyXR1UxvxRXqIrNhT4qKjWXsRaPqDubZsufyqXBoQbV6rSXAzmeEX/mYKavvFKU7kOJc3lsjw1gcIyvHKw4zrTsSCxvtGKo6RdTyJ+PLFrqkpWyZNvEkjMmAvIisLsd/KB1yymNpZq/dyhc7gEeQKO7RUFCYI9vF/DU2E/TzBW8ENvXawn5W6ZMRMwuoa88RBJ+p50lWKZ5R1qZgmCnOHzeFKz+G+2ydjAicXYJu4PqvrA2cUAn5WUF0U+5eRR0CdB8r9hs0AGTkZdhSHoa89r5FWyjTuZnteXIaC4iWTwSa2Sh6MzFpqm8F google-ssh {\"userName\":\"mnyagah@pharmaccess.io\",\"expireOn\":\"2024-06-14T10:08:05+0000\"}"
}

module "compute_instance_template" {
  source        = "./modules/compute_instance_template"
  project       = var.project_id
  instance_name = "instance-template-1"
}

module "service_account" {
  source = "./modules/service_account"
  project = var.project_id
}

module "storage_bucket" {
  source = "./modules/storage_bucket"
  project = var.project_id
}
