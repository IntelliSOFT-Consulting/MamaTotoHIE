output "allow_http_name" {
  value = google_compute_firewall.allow_http.name
}

output "allow_https_name" {
  value = google_compute_firewall.allow_https.name
}

output "allow_icmp_name" {
  value = google_compute_firewall.allow_icmp.name
}

output "allow_internal_name" {
  value = google_compute_firewall.allow_internal.name
}
