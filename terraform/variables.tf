variable "vercel_api_token" {
  sensitive = true
  default = ""
}

variable "mysql_host" {
  sensitive = true
  default = ""
}

variable "mysql_port" {
  sensitive = true
  default = ""
}

variable "mysql_database" {
  sensitive = true
  default = ""
}

variable "mysql_user" {
  sensitive = true
  default = ""
}

variable "mysql_password" {
  sensitive = true
  default = ""
}

variable "aws_secret_access_key" {
  sensitive = true
  default = ""
}

variable "aws_access_key_id" {
  sensitive = true
  default = ""
}

variable "aws_region" {
  sensitive = true
  default = ""
}