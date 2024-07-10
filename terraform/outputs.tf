output "disk_self_link" {
  value = google_compute_disk.mamatoto_hie_disk.self_link
}

output "external_ip" {
  value = google_compute_address.mama_toto_hie_dev_external.address
}

output "instance_name" {
  value = google_compute_instance.mamatoto_hie_server.name
}
