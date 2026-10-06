variable "region"  { type = string; default = "ap-northeast-1" }
variable "project" { type = string; default = "prj" }
variable "env"     { type = string; description = "production / staging / development" }

variable "vpc_cidr" { type = string; default = "10.0.0.0/20" }
variable "nat_count" {
  type        = number
  default     = 1
  description = "1 for dev/staging, 2 for production (AZ-resilient)"
  validation  { condition = contains([1, 2], var.nat_count); error_message = "nat_count must be 1 or 2." }
}

variable "acm_certificate_arn" {
  type        = string
  description = "Existing ACM certificate ARN for ALB HTTPS listener"
}

variable "task_cpu"    { type = number; default = 512 }
variable "task_memory" { type = number; default = 1024 }
variable "min_tasks"   { type = number; default = 2 }
variable "max_tasks"   { type = number; default = 10 }

variable "log_retention_days" {
  type    = number
  default = 90
  validation { condition = contains([14, 30, 60, 90, 120, 180, 365], var.log_retention_days); error_message = "Must be a valid CloudWatch retention period." }
}

variable "db_password" {
  type      = string
  sensitive = true
  description = "Aurora master password — provide via TF_VAR_db_password env var or tfvars"
}