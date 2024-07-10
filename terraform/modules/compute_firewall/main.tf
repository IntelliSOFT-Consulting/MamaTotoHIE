resource "google_compute_firewall" "allow_http" {
  allow {
    ports    = ["80", "8080"]
    protocol = "tcp"
  }

  direction     = "INGRESS"
  name          = "default-allow-http"
  network       = var.network_url
  priority      = 1000
  project       = var.project
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}

resource "google_compute_firewall" "allow_https" {
  allow {
    ports    = ["443"]
    protocol = "tcp"
  }

  direction     = "INGRESS"
  name          = "default-allow-https"
  network       = var.network_url
  priority      = 1000
  project       = var.project
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["https-server"]
}

resource "google_compute_firewall" "allow_icmp" {
  allow {
    protocol = "icmp"
  }

  description   = "Allow ICMP from anywhere"
  direction     = "INGRESS"
  name          = "default-allow-icmp"
  network       = var.network_url
  priority      = 65534
  project       = var.project
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow_internal" {
  allow {
    ports    = ["0-65535"]
    protocol = "tcp"
  }

  allow {
    ports    = ["0-65535"]
    protocol = "udp"
  }

  allow {
    protocol = "icmp"
  }

  description   = "Allow internal traffic on the network"
  direction     = "INGRESS"
  name          = "default-allow-internal"
  network       = var.network_url
  priority      = 65534
  project       = var.project
  source_ranges = ["10.128.0.0/9"]
}
