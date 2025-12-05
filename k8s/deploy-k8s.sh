#!/bin/bash

echo "======================================"
echo "Network Scanner - Kubernetes Deployment"
echo "======================================"

# Create namespace
echo "Creating namespace..."
kubectl create namespace scanner --dry-run=client -o yaml | kubectl apply -f -

# Apply secrets
echo "Applying secrets..."
kubectl apply -f postgres-secret.yaml -n scanner

# Deploy PostgreSQL
echo "Deploying PostgreSQL..."
kubectl apply -f postgres-deployment.yaml -n scanner

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n scanner --timeout=120s

# Deploy Backend
echo "Deploying Backend..."
kubectl apply -f backend-configmap.yaml -n scanner
kubectl apply -f backend-deployment.yaml -n scanner

# Wait for Backend to be ready
echo "Waiting for Backend to be ready..."
kubectl wait --for=condition=ready pod -l app=scanner-backend -n scanner --timeout=120s

# Deploy Frontend
echo "Deploying Frontend..."
kubectl apply -f frontend-deployment.yaml -n scanner

# Wait for Frontend to be ready
echo "Waiting for Frontend to be ready..."
kubectl wait --for=condition=ready pod -l app=scanner-frontend -n scanner --timeout=120s

# Optional: Deploy Ingress
# kubectl apply -f ingress.yaml -n scanner

echo ""
echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo ""
echo "Get service URLs:"
echo "kubectl get services -n scanner"
echo ""
echo "View logs:"
echo "kubectl logs -f deployment/scanner-backend -n scanner"
echo "kubectl logs -f deployment/scanner-frontend -n scanner"
echo ""
echo "Access services:"
echo "kubectl port-forward svc/scanner-frontend 8081:80 -n scanner"
echo "kubectl port-forward svc/scanner-backend 8080:8080 -n scanner"
