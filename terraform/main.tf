terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "dcaps-terraform-state-vault"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "dcaps-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "us-east-1"
}

# AWS EKS Kubernetes Cluster
resource "aws_eks_cluster" "dcaps_cluster" {
  name     = "dcaps-prod-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]
  }
}

# AWS KMS Master Envelope Key for AES-256-GCM Capsule Encryption
resource "aws_kms_key" "dcaps_kms" {
  description             = "KMS Master Key for Dashboard Capsule AI AES-256 Envelope Encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

# AWS S3 Storage Vault for .dcaps Capsule Archives
resource "aws_s3_bucket" "capsule_vault" {
  bucket = "dcaps-production-vault"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "vault_crypto" {
  bucket = aws_s3_bucket.capsule_vault.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.dcaps_kms.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

# IAM Role Stub
resource "aws_iam_role" "eks_cluster_role" {
  name = "dcaps-eks-cluster-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
    }]
  })
}

resource "aws_subnet" "private_1" {
  vpc_id     = "vpc-12345678"
  cidr_block = "10.0.1.0/24"
}

resource "aws_subnet" "private_2" {
  vpc_id     = "vpc-12345678"
  cidr_block = "10.0.2.0/24"
}
