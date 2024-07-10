resource "google_compute_disk" "disk" {
  guest_os_features {
    type = "GVNIC"
  }

  guest_os_features {
    type = "SEV_CAPABLE"
  }

  guest_os_features {
    type = "SEV_LIVE_MIGRATABLE"
  }

  guest_os_features {
    type = "SEV_SNP_CAPABLE"
  }

  guest_os_features {
    type = "UEFI_COMPATIBLE"
  }

  guest_os_features {
    type = "VIRTIO_SCSI_MULTIQUEUE"
  }

  licenses                  = ["https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/licenses/ubuntu-2204-lts"]
  name                      = var.disk_name
  physical_block_size_bytes = 4096
  project                   = var.project
  size                      = 80
  snapshot                  = "https://www.googleapis.com/compute/v1/projects/paf-hdc-dev/global/snapshots/mamatoto-hie-disk"
  type                      = "pd-standard"
  zone                      = var.zone
}
