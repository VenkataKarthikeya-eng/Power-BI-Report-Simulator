package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/dashboard-capsule-ai/services/capsule-builder/handlers"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	capsuleHandler := handlers.NewCapsuleHandler()
	sharingHandler := handlers.NewSharingHandler()
	pluginHandler := handlers.NewPluginHandler()

	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"UP","service":"capsule-builder","version":"1.0.0"}`))
	})

	// Capsule Compiler Routes
	mux.HandleFunc("/api/v1/capsules/build", capsuleHandler.BuildCapsule)
	mux.HandleFunc("/api/v1/capsules/verify", capsuleHandler.VerifyCapsule)
	mux.HandleFunc("/api/v1/capsules/history", capsuleHandler.ListHistory)

	// Secure Sharing & Replay Routes
	mux.HandleFunc("/api/v1/share/create", sharingHandler.CreateShareLink)
	mux.HandleFunc("/api/v1/share/verify", sharingHandler.VerifyPasscode)
	mux.HandleFunc("/api/v1/replay/session", sharingHandler.GetReplayEvents)

	// Multi-BI Plugin & Webhook Routes
	mux.HandleFunc("/api/v1/marketplace", pluginHandler.ListMarketplacePlugins)
	mux.HandleFunc("/api/v1/webhooks", pluginHandler.CreateWebhookSubscription)

	fmt.Printf("📦 Dashboard Capsule AI — Multi-BI Plugin & Extensibility Engine running on port %s...\n", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Fatal capsule builder error: %v", err)
	}
}
