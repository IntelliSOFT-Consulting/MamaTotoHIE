provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

resource "google_compute_disk" "mamatoto_hie_disk" {
  name                      = "mamatoto-hie-disk"
  type                      = "pd-standard"
  size                      = var.disk_size
  physical_block_size_bytes = 4096

  guest_os_features {
    type = "GVNIC"
  }

  guest_os_features {
    type = "SEV_CAPABLE"
  }

  guest_os_features {
    type = "SEV_LIVE_MIGRATABLE"
  }

  guest_os_features {
    type = "SEV_SNP_CAPABLE"
  }

  guest_os_features {
    type = "UEFI_COMPATIBLE"
  }

  guest_os_features {
    type = "VIRTIO_SCSI_MULTIQUEUE"
  }

  licenses = ["https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/licenses/ubuntu-2204-lts"]
  project  = var.project_id
  zone     = var.zone
}

resource "google_compute_address" "mama_toto_hie_dev_external" {
  name         = "mama-toto-hie-dev-external"
  address      = var.address_ip
  address_type = "EXTERNAL"
  network_tier = "PREMIUM"
  project      = var.project_id
  region       = var.region
}

resource "google_compute_firewall" "default_allow_http" {
  name    = "default-allow-http"
  network = "https://www.googleapis.com/compute/v1/projects/${var.project_id}/global/networks/${var.network_name}"
  allow {
    protocol = "tcp"
    ports    = ["80", "8080"]
  }
  direction     = "INGRESS"
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
  project       = var.project_id
}

resource "google_compute_instance" "mamatoto_hie_server" {
  name         = "mamatoto-hie-server"
  machine_type = var.machine_type
  zone         = var.zone
  project      = var.project_id

  boot_disk {
    auto_delete = false
    source      = google_compute_disk.mamatoto_hie_disk.self_link
    device_name = "mamatoto-hie-disk"
    initialize_params {
      size = var.disk_size
      type = "pd-standard"
    }
  }

  network_interface {
    network    = "https://www.googleapis.com/compute/v1/projects/${var.project_id}/global/networks/${var.network_name}"
    subnetwork = "https://www.googleapis.com/compute/v1/projects/${var.project_id}/regions/${var.region}/subnetworks/${var.subnetwork_name}"
    access_config {
      nat_ip       = google_compute_address.mama_toto_hie_dev_external.address
      network_tier = "PREMIUM"
    }
  }

  scheduling {
    automatic_restart   = true
    on_host_maintenance = "MIGRATE"
  }

  service_account {
    email  = var.service_account_email
    scopes = [
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring.write",
      "https://www.googleapis.com/auth/pubsub",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/trace.append",
    ]
  }

  shielded_instance_config {
    enable_integrity_monitoring = true
    enable_vtpm                 = true
  }

  tags = ["http-server", "https-server"]
}
