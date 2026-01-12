FROM python:3.13-slim

# Install Ansible and dependencies
RUN apt-get update && apt-get install -y \
	sshpass \
	&& pip install --no-cache-dir ansible \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

# Set the ansible_python_interpreter environment variable
ENV ANSIBLE_PYTHON_INTERPRETER=/usr/local/bin/python3.13

# Set up a directory for your playbooks
WORKDIR /ansible
