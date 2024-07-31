resource "google_compute_instance_template" "default" {
  name        = var.instance_name
  # machine_type = var.machine_type
  project     = var.project

  disk {
    auto_delete = true 
    boot        = true
    image = "projects/ubuntu-os-cloud/global/images/family/ubuntu-2204-lts"
    size  = 80
    type  = "pd-standard"
  }

  machine_type = "n1-standard-1"
  network_interface {
    network = "default"
  }
  
}
