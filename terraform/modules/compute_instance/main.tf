resource "google_compute_instance" "instance" {
  boot_disk {
    auto_delete = true
    source      = var.disk_source
  }

  guest_accelerator {
    count = 1
    type  = "nvidia-tesla-t4"
  }

  machine_type = "n1-standard-4"
  metadata = {
    enable-oslogin = "TRUE"
    ssh-keys       = var.ssh_keys
  }

  name              = var.instance_name
  network_interface {
    access_config {
      nat_ip = var.external_ip
    }
    network    = var.network_url
    subnetwork = var.subnetwork_url
  }

  project = var.project
  zone    = var.zone
}
