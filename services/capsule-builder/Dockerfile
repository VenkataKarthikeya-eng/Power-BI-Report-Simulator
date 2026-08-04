FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o capsule-builder .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/capsule-builder .
EXPOSE 8083
CMD ["./capsule-builder"]
