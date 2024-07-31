resource "google_compute_address" "external" {
  address      = var.external_ip
  address_type = "EXTERNAL"
  name         = "mama-toto-hie-dev-external"
  network_tier = "PREMIUM"
  project      = var.project
  region       = var.region
}

resource "google_compute_address" "this" {
  address      = var.internal_ip
  address_type = var.address_type
  description  = "Mama toto dev server"
  name         = "mama-toto-dev-server"
  network_tier = "PREMIUM"
  project      = var.project
  purpose      = "GCE_ENDPOINT"
  region       = var.region
  subnetwork   = "https://www.googleapis.com/compute/v1/projects/${var.project}/regions/${var.region}/subnetworks/default"
}
