resource "google_service_account" "default" {
  account_id   = "service-account-id"
  display_name = "Service Account"
  project      = var.project
}

resource "google_service_account_key" "default" {
  service_account_id = google_service_account.default.name
}
