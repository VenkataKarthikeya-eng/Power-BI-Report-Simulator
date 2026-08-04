package services

import (
	"testing"

	"github.com/dashboard-capsule-ai/services/auth-service/models"
)

func TestHasPermission(t *testing.T) {
	if !HasPermission(models.RoleSuperAdmin, PermManageOrg) {
		t.Errorf("SuperAdmin should have PermManageOrg")
	}

	if !HasPermission(models.RoleDeveloper, PermCompileCapsule) {
		t.Errorf("Developer should have PermCompileCapsule")
	}

	if HasPermission(models.RoleViewer, PermManageOrg) {
		t.Errorf("Viewer should NOT have PermManageOrg")
	}

	if HasPermission(models.RoleExternalUser, PermImportDashboard) {
		t.Errorf("ExternalUser should NOT have PermImportDashboard")
	}
}

func TestPasswordHashing(t *testing.T) {
	password := "EnterpriseSecret#2026"
	hash, err := HashPassword(password)
	if err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}

	if !CheckPasswordHash(password, hash) {
		t.Errorf("Password hash check failed for valid password")
	}

	if CheckPasswordHash("WrongPassword", hash) {
		t.Errorf("Password hash check succeeded for invalid password")
	}
}

func TestJWTGenerationAndValidation(t *testing.T) {
	userID := "usr_123"
	orgID := "org_456"
	email := "test@company.com"
	role := string(models.RoleDeveloper)

	token, err := GenerateAccessToken(userID, orgID, email, role, 900)
	if err != nil {
		t.Fatalf("Failed to generate access token: %v", err)
	}

	claims, err := ValidateJWT(token)
	if err != nil {
		t.Fatalf("Failed to validate JWT token: %v", err)
	}

	if claims.UserID != userID || claims.OrganizationID != orgID || claims.Role != role {
		t.Errorf("JWT claims mismatch. Expected UserID %s, got %s", userID, claims.UserID)
	}
}
