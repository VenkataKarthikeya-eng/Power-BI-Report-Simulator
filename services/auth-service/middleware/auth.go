package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/dashboard-capsule-ai/services/auth-service/models"
	"github.com/dashboard-capsule-ai/services/auth-service/services"
)

type contextKey string

const ClaimsContextKey contextKey = "claims"

func AuthenticationMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			writeErrorResponse(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing or malformed Authorization header")
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := services.ValidateJWT(tokenString)
		if err != nil {
			writeErrorResponse(w, http.StatusUnauthorized, "INVALID_TOKEN", err.Error())
			return
		}

		ctx := context.WithValue(r.Context(), ClaimsContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func RequirePermission(perm services.Permission, next http.HandlerFunc) http.HandlerFunc {
	return AuthenticationMiddleware(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value(ClaimsContextKey).(*services.Claims)
		if !ok || claims == nil {
			writeErrorResponse(w, http.StatusUnauthorized, "UNAUTHORIZED", "User identity required")
			return
		}

		if !services.HasPermission(models.UserRole(claims.Role), perm) {
			writeErrorResponse(w, http.StatusForbidden, "FORBIDDEN", "Insufficient role permissions for this operation")
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeErrorResponse(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	resp := models.APIResponse{
		Success: false,
		Error: &models.APIError{
			Code:    code,
			Message: message,
		},
	}
	json.NewEncoder(w).Encode(resp)
}
