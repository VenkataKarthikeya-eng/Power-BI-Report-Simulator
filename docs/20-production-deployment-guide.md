# Deliverable 20: Production Multi-Cloud Deployment Guide

## 1. Deployment Topology Overview

**Dashboard Capsule AI** supports multi-cloud deployment across AWS, Azure, Google Cloud (GCP), and self-hosted Kubernetes (EKS, AKS, GKE, K3s).

```
[ AWS Route 53 / Cloudflare DNS ]
                │
        [ ALB Ingress Controller ]
                │
   ┌────────────┴────────────┐
   │  EKS Kubernetes Cluster │
   │                         │
   ├── apps/landing-web      │
   ├── apps/app-dashboard    │
   ├── apps/admin-portal     │
   ├── apps/viewer           │
   └── Microservices Cluster │
   └────────────┬────────────┘
                │
 ┌──────────────┼──────────────┐
 │              │              │
[RDS Postgres] [ElastiCache] [AWS S3 Vault]
```

---

## 2. Quickstart Helm Deployment

```bash
# 1. Add Kubernetes Helm Values
helm upgrade --install dcaps-release ./deployments/helm \
  --namespace production \
  --create-namespace \
  -f ./deployments/helm/values.yaml

# 2. Verify Pod Health
kubectl get pods -n production
```
