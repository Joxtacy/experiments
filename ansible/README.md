# ansible

## docker

```sh
docker build -t ansible-custom .
```

### Useful docker run flags

`--rm`: remove container on exit

`-t`: allocate a pseudo-TTY for colored output

`-v`: mount a host directory to a container directory

## Run single tasks

```sh
docker run \
 --rm \
 -t \
 -v $(pwd)/playbooks:/ansible \
 -v "$PWD/sshkeys/":/root/.ssh/:ro \
 ansible-custom ansible myhosts -m ping -i inventory.ini -u joxtacy
```

## Run playbooks

```sh
docker run \
 --rm \
 -t \
 -v $(pwd)/playbooks:/ansible \
 -v "$PWD/sshkeys/":/root/.ssh/:ro ansible-custom \
 ansible-playbook -i inventory.yaml -u joxtacy playbook.yaml
```
