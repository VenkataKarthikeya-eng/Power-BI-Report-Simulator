FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o import-engine .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/import-engine .
EXPOSE 8082
CMD ["./import-engine"]
