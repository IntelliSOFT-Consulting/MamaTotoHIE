module "folders" {
    source = "./folders"
    project_id = "hdc-test-arena"
}

module "compute" {
    source = "./compute"
    project_name = "hdc-test-arena"
}

module "network" {
    source = "./network"
    project_name = "hdc-test-arena"
}