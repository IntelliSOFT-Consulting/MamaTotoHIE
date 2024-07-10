resource "google_compute_instance" "compute_instance" {
  name         = var.instance_name
  machine_type = var.machine_type
  zone         = var.zone
  project      = var.project_id

  boot_disk {
    auto_delete = var.auto_delete
    source      = var.disk_source
    device_name = var.device_name
    initialize_params {
      size = var.disk_size
      type = var.disk_type
    }
  }

  network_interface {
    network    = var.network
    subnetwork = var.subnetwork
    access_config {
      nat_ip       = var.nat_ip
      network_tier = var.network_tier
    }
  }

  scheduling {
    automatic_restart   = var.automatic_restart
    on_host_maintenance = var.on_host_maintenance
  }

  service_account {
    email  = var.service_account_email
    scopes = var.scopes
  }

  shielded_instance_config {
    enable_integrity_monitoring = var.enable_integrity_monitoring
    enable_vtpm                 = var.enable_vtpm
  }

  tags = var.tags
}
