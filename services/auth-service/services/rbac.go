package services

import "github.com/dashboard-capsule-ai/services/auth-service/models"

type Permission string

const (
	PermManageOrg       Permission = "org:manage"
	PermManageUsers     Permission = "users:manage"
	PermImportDashboard Permission = "dashboard:import"
	PermCompileCapsule  Permission = "capsule:compile"
	PermShareDashboard  Permission = "dashboard:share"
	PermViewDashboard   Permission = "dashboard:view"
	PermViewAuditLogs   Permission = "audit:view"
)

var RolePermissions = map[models.UserRole][]Permission{
	models.RoleSuperAdmin: {
		PermManageOrg, PermManageUsers, PermImportDashboard, PermCompileCapsule, PermShareDashboard, PermViewDashboard, PermViewAuditLogs,
	},
	models.RoleOrgAdmin: {
		PermManageOrg, PermManageUsers, PermImportDashboard, PermCompileCapsule, PermShareDashboard, PermViewDashboard, PermViewAuditLogs,
	},
	models.RoleDeveloper: {
		PermImportDashboard, PermCompileCapsule, PermShareDashboard, PermViewDashboard,
	},
	models.RoleBusinessAnalyst: {
		PermShareDashboard, PermViewDashboard,
	},
	models.RoleViewer: {
		PermViewDashboard,
	},
	models.RoleHR: {
		PermViewDashboard, PermViewAuditLogs,
	},
	models.RoleGuest: {
		PermViewDashboard,
	},
	models.RoleExternalUser: {
		PermViewDashboard,
	},
}

func HasPermission(role models.UserRole, perm Permission) bool {
	perms, exists := RolePermissions[role]
	if !exists {
		return false
	}
	for _, p := range perms {
		if p == perm {
			return true
		}
	}
	return false
}
