# Database Migration, Backup & Disaster Recovery Guide

This guide describes operational management procedures for the PostgreSQL database cluster serving Dashboard Capsule AI Version 1.0.0.

---

## 1. Schema Migrations

Dashboard Capsule AI manages database migrations using standard SQL scripts and Prisma ORM.

### Running Migrations in Local / Staging
```bash
npm run db:migrate --workspace=@dcaps/database
```

### Applying Migrations in Production Environments
During container deployment, migrations are executed automatically via init containers or manual CLI invocation:

```bash
docker exec -it dcaps-postgres-1 psql -U capsule_admin -d dcaps_production -f /migrations/001_initial_schema.sql
```

---

## 2. Automated Snapshot Backups

Production clusters schedule hourly transaction log archiving and daily full database snapshots.

### Executing Manual Backup Snapshot
```bash
# Trigger backup endpoint via Admin API
curl -X POST http://localhost:8081/api/v1/admin/backup/trigger \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

### PostgreSQL Native Backup Dump Command
```bash
pg_dump -U capsule_admin -h localhost -d dcaps_production -F c -b -v -f /backups/dcaps_backup_$(date +%Y%m%m_%H%M%S).dump
```

---

## 3. Disaster Recovery & Point-in-Time Restoration

To restore a database snapshot into a new PostgreSQL cluster:

```bash
# 1. Re-create empty target database
createdb -U capsule_admin -h localhost dcaps_production_restored

# 2. Restore binary dump
pg_restore -U capsule_admin -h localhost -d dcaps_production_restored /backups/dcaps_backup_20260803_0452.dump
```
