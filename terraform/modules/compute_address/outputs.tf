output "external_name" {
  value = google_compute_address.external.name
}

# output "internal_name" {
#   value = google_compute_address.internal.name
# }

output "name" {
  value = google_compute_address.this.name
}