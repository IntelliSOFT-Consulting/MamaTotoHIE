provider "google" {
    credentials = file("key.json")
    project = "hdc-test-arena"
    region = "us-east1"
}