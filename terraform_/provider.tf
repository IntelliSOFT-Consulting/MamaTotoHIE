provider "google" {
    credentials = file("key.json")
    project = "hdc-test-arena"
    region = "europe-west1"
}