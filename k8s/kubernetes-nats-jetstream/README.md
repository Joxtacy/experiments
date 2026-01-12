# NATS JetStream on Kubernetes

This project provides a simple setup for deploying NATS JetStream on Kubernetes using Helm charts and standalone manifests.

## Project Structure

- **charts/nats/**: Contains the Helm chart for NATS JetStream.
  - **Chart.yaml**: Metadata about the Helm chart.
  - **values.yaml**: Default configuration values for the Helm chart.
  - **templates/**: Contains Kubernetes resource definitions.
    - **deployment.yaml**: Deployment resource for NATS.
    - **service.yaml**: Service resource for NATS.
    - **statefulset.yaml**: StatefulSet resource for NATS JetStream.

- **manifests/**: Contains standalone Kubernetes resource definitions.
  - **nats-deployment.yaml**: Deployment resource for NATS.
  - **nats-service.yaml**: Service resource for NATS.
  - **nats-statefulset.yaml**: StatefulSet resource for NATS JetStream.

- **.helmignore**: Files and directories to ignore when packaging the Helm chart.
- **.gitignore**: Files and directories to ignore in version control.

## Setup Instructions

1. **Install Helm**: Ensure you have Helm installed on your local machine.

2. **Deploy NATS JetStream using Helm**:
   - Navigate to the `charts/nats` directory.
   - Run the following command to install the chart:
     ```
     helm install nats-jetstream .
     ```

3. **Deploy NATS JetStream using standalone manifests**:
   - Apply the Kubernetes manifests directly:
     ```
     kubectl apply -f manifests/nats-deployment.yaml
     kubectl apply -f manifests/nats-service.yaml
     kubectl apply -f manifests/nats-statefulset.yaml
     ```

## Usage

Once deployed, you can interact with NATS JetStream using the NATS client libraries available for various programming languages. Refer to the NATS documentation for more details on how to publish and subscribe to messages.

## Contributing

Feel free to submit issues or pull requests to improve this project.