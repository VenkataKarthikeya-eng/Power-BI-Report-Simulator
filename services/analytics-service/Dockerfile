FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o analytics-service .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/analytics-service .
EXPOSE 8084
CMD ["./analytics-service"]
