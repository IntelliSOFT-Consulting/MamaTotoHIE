module "folders" {
    source = "./folders"
    project_id = "hdc-test-arena"
}

# module "projects" {
#     source = "./projects"
#     project_name = "hdc-project-mamatoto"
# }

module "compute" {
    source = "./compute"
    project_name = "hdc-test-arena"
}