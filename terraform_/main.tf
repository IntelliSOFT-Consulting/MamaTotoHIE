module "compute" {
    source = "./compute"
    project_name = "hdc-test-arena"
    project_id = "hdc-test-arena"
}

module "network" {
    source = "./network"
    project_name = "hdc-test-arena"
    project_network = "vpc-network"
}