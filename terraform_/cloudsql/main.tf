resource "google_sql_database_instance" "mamatoto" {
  name             = "mamatoto-instance"
  database_version = "POSTGRES_15"
  region           = "us-central1"

  settings {
    # Second-generation instance tiers are based on the machine
    # type. See argument reference below.
    tier = "db-f1-micro"
    
  }
  deletion_protection= false
}

resource "google_sql_database" "database" {
  name     = "mamatoto-database"
  instance = google_sql_database_instance.mamatoto.name 
}