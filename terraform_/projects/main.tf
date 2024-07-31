resource "google_project" "my_project-in-a-folder" {
  name       = var.project_name
  project_id = var.project_name
  folder_id  = "folders/${var.folder_id}"
}
