resource "google_compute_instance_template" "default" {
  name        = var.instance_name
  project     = var.project
  properties {
    disks {
      auto_delete = true
      boot        = true
      initialize_params {
        image = "projects/ubuntu-os-cloud/global/images/family/ubuntu-2204-lts"
        size  = 80
        type  = "pd-standard"
      }
    }
    machine_type = "n1-standard-1"
    network_interfaces {
      network = "default"
    }
  }
}
