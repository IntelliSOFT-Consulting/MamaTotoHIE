resource "google_storage_bucket" "default" {
  name     = "${var.project}-bucket"
  location = "US"
  project  = var.project
}
