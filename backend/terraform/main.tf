terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
  }
  backend "s3" {
    bucket         = "lumen-pi2-terraform-state"
    key            = "terraform/state"
    region         = "us-east-1"
    encrypt        = true
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
}

resource "vercel_project" "lumen_api" {
  name = "lumen-api"
}

data "vercel_project_directory" "lumen_api_directory" {
  path = "../"
}

resource "vercel_deployment" "lumen_api_deployment" {
  project_id = vercel_project.lumen_api.id
  files = data.vercel_project_directory.lumen_api_directory.files
  path_prefix = "../"
  production = true

  lifecycle {
    replace_triggered_by = [ vercel_project_environment_variables.lumen_api_vars ]
  }
}

resource "vercel_project_environment_variables" "lumen_api_vars" {
  project_id = vercel_project.lumen_api.id
  variables = [ 
    {
        key = "MYSQL_HOST"
        value = var.mysql_host
        sensitive = true
        target   = ["production", "preview", "development"]
    },
    {
        key = "MYSQL_PORT"
        value = var.mysql_port
        sensitive = true
        target   = ["production", "preview", "development"]
    },
    {
        key = "MYSQL_DATABASE"
        value = var.mysql_database
        sensitive = true
        target   = ["production", "preview", "development"]
    },
    {
        key = "MYSQL_USER"
        value = var.mysql_user
        sensitive = true
        target   = ["production", "preview", "development"]
    },
    {
        key = "MYSQL_PASSWORD"
        value = var.mysql_password
        sensitive = true
        target   = ["production", "preview", "development"]
    }
  ]
}