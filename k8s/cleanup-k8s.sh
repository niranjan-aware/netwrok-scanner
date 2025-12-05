#!/bin/bash

echo "======================================"
echo "Network Scanner - Kubernetes Cleanup"
echo "======================================"

echo "Deleting all resources in scanner namespace..."
kubectl delete namespace scanner --ignore-not-found=true

echo ""
echo "Cleanup complete!"
