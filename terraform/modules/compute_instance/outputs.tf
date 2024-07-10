output "instance_name" {
  value = google_compute_instance.compute_instance.name
}

output "instance_self_link" {
  value = google_compute_instance.compute_instance.self_link
}

output "instance_network_interface" {
  value = google_compute_instance.compute_instance.network_interface
}
