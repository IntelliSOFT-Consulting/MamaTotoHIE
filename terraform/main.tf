module "compute_instance" {
  source                = "./modules/compute_instance"
  instance_name         = "mamatoto-hie-server"
  machine_type          = var.machine_type
  zone                  = var.zone
  project_id            = var.project_id
  auto_delete           = false
  disk_source           = google_compute_disk.mamatoto_hie_disk.self_link
  device_name           = "mamatoto-hie-disk"
  disk_size             = var.disk_size
  disk_type             = "pd-standard"
  network               = "https://www.googleapis.com/compute/v1/projects/${var.project_id}/global/networks/${var.network_name}"
  subnetwork            = "https://www.googleapis.com/compute/v1/projects/${var.project_id}/regions/${var.region}/subnetworks/${var.subnetwork_name}"
  nat_ip                = google_compute_address.mama_toto_hie_dev_external.address
  network_tier          = "PREMIUM"
  automatic_restart     = true
  on_host_maintenance   = "MIGRATE"
  service_account_email = var.service_account_email
  scopes                = [
    "https://www.googleapis.com/auth/devstorage.read_only",
    "https://www.googleapis.com/auth/logging.write",
    "https://www.googleapis.com/auth/monitoring.write",
    "https://www.googleapis.com/auth/pubsub",
    "https://www.googleapis.com/auth/service.management.readonly",
    "https://www.googleapis.com/auth/servicecontrol",
    "https://www.googleapis.com/auth/trace.append"
  ]
  enable_integrity_monitoring = true
  enable_vtpm                 = true
  tags                        = ["http-server", "https-server"]
}
