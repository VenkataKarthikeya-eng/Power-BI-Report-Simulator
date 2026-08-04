package models

import "time"

type UserRole string

const (
	RoleSuperAdmin      UserRole = "SUPER_ADMIN"
	RoleOrgAdmin        UserRole = "ORG_ADMIN"
	RoleDeveloper       UserRole = "DEVELOPER"
	RoleBusinessAnalyst UserRole = "BUSINESS_ANALYST"
	RoleViewer          UserRole = "VIEWER"
	RoleHR              UserRole = "HR"
	RoleGuest           UserRole = "GUEST"
	RoleExternalUser    UserRole = "EXTERNAL_USER"
)

type RegisterRequest struct {
	Email            string `json:"email"`
	Password         string `json:"password"`
	FullName         string `json:"fullName"`
	OrganizationName string `json:"organizationName,omitempty"`
}

type LoginRequest struct {
	Email      string `json:"email"`
	Password   string `json:"password"`
	RememberMe bool   `json:"rememberMe"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}

type VerifyEmailRequest struct {
	Token string `json:"token"`
}

type CreateOrgRequest struct {
	Name string `json:"name"`
	Slug string `json:"slug,omitempty"`
}

type InviteMemberRequest struct {
	Email string   `json:"email"`
	Role  UserRole `json:"role"`
}

type AcceptInviteRequest struct {
	Token    string `json:"token"`
	Password string `json:"password"`
	FullName string `json:"fullName"`
}

type UserDTO struct {
	ID             string    `json:"id"`
	OrganizationID string    `json:"organizationId"`
	Email          string    `json:"email"`
	FullName       string    `json:"fullName"`
	Role           UserRole  `json:"role"`
	Status         string    `json:"status"`
	IsMFAEnabled   bool      `json:"isMfaEnabled"`
	CreatedAt      time.Time `json:"createdAt"`
}

type OrganizationDTO struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	PlanTier  string    `json:"planTier"`
	CreatedAt time.Time `json:"createdAt"`
}

type AuthResponse struct {
	User         UserDTO         `json:"user"`
	Organization OrganizationDTO `json:"organization"`
	AccessToken  string          `json:"accessToken"`
	RefreshToken string          `json:"refreshToken"`
	ExpiresIn    int64           `json:"expiresIn"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *APIError   `json:"error,omitempty"`
}

type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}
