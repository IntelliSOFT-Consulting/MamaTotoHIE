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
  address_type = "EXTERNAL"
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
  ssh_keys          = var.ssh_keys
}

module "compute_instance_template" {
  source        = "./modules/compute_instance_template"
  project       = var.project_id
  machine_type = var.machine_type
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
