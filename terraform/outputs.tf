output "compute_disk_name" {
  value = module.compute_disk.name
}

output "compute_address_name" {
  value = module.compute_address.name
}

output "compute_firewall_name" {
  value = module.compute_firewall.name
}

output "compute_instance_name" {
  value = module.compute_instance.name
}

output "compute_instance_template_name" {
  value = module.compute_instance_template.name
}

output "service_account_emails" {
  value = module.service_account.emails
}

output "storage_bucket_names" {
  value = module.storage_bucket.names
}
