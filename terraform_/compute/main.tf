resource "google_project_service" "compute_api" {
  project = var.project_name
  service = "compute.googleapis.com"

  timeouts {
    create = "30m"
    update = "40m"
  }

  disable_on_destroy = false
}

resource "google_service_account" "default" {
  account_id   = var.project_id
  display_name = "Custom SA for VM Instance"
}

resource "google_compute_instance" "mamatoto_hie_server" {
  name         = "mamatoto-hie-disk"
  machine_type = "n2-standard-2"
  zone         = "europe-west4-a"

  tags = ["http-server", "https-server"]



  boot_disk {
    device_name = "mamatoto-hie-disk"
    auto_delete = false
    initialize_params {
      image = "debian-cloud/debian-11"
      size = 80
      labels = {
        my_label = "mamatoto-hie-disk"
      }
    }
    
  }

  // Local SSD disk
  scratch_disk {
    interface = "NVME"
  }

  network_interface {
    access_config {
      nat_ip       = ""
      network_tier = "PREMIUM"
    }

    network            = "vpc-network"
    subnetwork         = "vpc-subnetwork"
    network_ip         = ""
    stack_type         = "IPV4_ONLY"
    subnetwork         = "https://www.googleapis.com/compute/v1/projects/hdc-test-arena/regions/europe-west4/subnetworks/default"
    subnetwork_project = "hdc-test-arena"
  }

  scheduling {
    automatic_restart   = true
    on_host_maintenance = "MIGRATE"
    provisioning_model  = "STANDARD"
  }

  shielded_instance_config {
    enable_integrity_monitoring = true
    enable_vtpm                 = true
  }

  metadata = {
    foo = "bar"
  }

  metadata_startup_script = "echo hi > /test.txt"

  service_account {
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    email  = "452852160142-compute@developer.gserviceaccount.com"
    scopes = ["https://www.googleapis.com/auth/devstorage.read_only", "https://www.googleapis.com/auth/logging.write", "https://www.googleapis.com/auth/monitoring.write", "https://www.googleapis.com/auth/pubsub", "https://www.googleapis.com/auth/service.management.readonly", "https://www.googleapis.com/auth/servicecontrol", "https://www.googleapis.com/auth/trace.append"]
  }
}







