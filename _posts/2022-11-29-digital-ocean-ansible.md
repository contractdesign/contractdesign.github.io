---
layout: post
title: Configuring a New Digital Ocean Instance with Ansible
---

Newly created Digital Ocean instances only have a root account. It's good practice to create a regular user account which has sudoer privileges and to login with this account in place of the root account. This page gives instructions for setting up a cloud instance this way.

## Prerequisites
Digital Ocean offers the option of accessing a remote host by password or by SSH. These instructions were written assuming the instances is accessed by SSH.

## Create a Digital Ocean Instance
Create a new digital ocean instance in the web interface and  record its IP address in the inventory file, `hosts.txt` as below:

```ini
[all:vars]
ansible_ssh_private_key_file=<PATH to SSH .pub>
ansible_ssh_user=root

[all]
1.1.1.1 # change this to your Digital Ocean insteance's IP address
```

## Verify Connectivity
Check that ansible can connect to the instance by running the `ansible` command. Note that this command is different than the command to run a playbook (`ansible-playbook`)

```bash
$ ansible -i hosts.txt -m ping all
```
A successful response returns a `pong` to the `ping`:
```bash
1.1.1.1 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
```

## Create New Account with Ansible
Run ansible new account playbook to create the `user` account.
```bash
$ ansible-playbook new_account.yml -i hosts.txt 
```

An example `new_account.yml` playbook is below which is based on one from [minimum-viable-automation.com]( http://minimum-viable-automation.com/ansible/use-ansible-create-user-accounts-setup-ssh-keys/)

*Note* that you will need to change the path to your SSH key (see line with `digital_ocean.pub`)
```yaml
- hosts: all
  vars:
    users:
    - "user"

  tasks:
  - name: "Create user accounts"
    user:
      name: "{{ item }}"
      groups: users, admin
    with_items: "{{ users }}"

  - name: "Add authorized keys"
    authorized_key:
      user: "{{ item }}"
      key: "{{ lookup('file', '/Users/user/.ssh/digital_ocean.pub') }}"
    with_items: "{{ users }}"

  - name: "Allow admin users to sudo without a password"
    lineinfile:
      dest: "/etc/sudoers" # path: in version 2.3
      state: "present"
      regexp: "^%admin"
      line: "%admin ALL=(ALL) NOPASSWD: ALL"
```
