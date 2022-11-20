---
layout: post
title: What Happens When a Docker Network is Created?
categories: programming
tags: docker networking iptables
---

When a user creates a new docker user network, what happens behind the scenes?
We know that docker leverages Linux networking namespaces to do this, but how?
This post has some notes and experiments with Docker networking.

When Docker is installed, it creates a number of networking constructs.  Let's examine them as a baseline to see what changes when a new network is created.

It creates a bridge called `docker0`:
```bash
$ brctl show
bridge name	bridge id		STP enabled	interfaces
docker0		8000.0242a690e758	no		
```
It enters a number of tables and rules in the host's IP tables:
```bash
$ sudo iptables -S
-P INPUT ACCEPT
-P FORWARD DROP
-P OUTPUT ACCEPT
-N DOCKER
-N DOCKER-ISOLATION-STAGE-1
-N DOCKER-ISOLATION-STAGE-2
-N DOCKER-USER
-A FORWARD -j DOCKER-USER
-A FORWARD -j DOCKER-ISOLATION-STAGE-1
-A FORWARD -o docker0 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
-A FORWARD -o docker0 -j DOCKER
-A FORWARD -i docker0 ! -o docker0 -j ACCEPT
-A FORWARD -i docker0 -o docker0 -j ACCEPT
-A DOCKER-ISOLATION-STAGE-1 -i docker0 ! -o docker0 -j DOCKER-ISOLATION-STAGE-2
-A DOCKER-ISOLATION-STAGE-1 -j RETURN
-A DOCKER-ISOLATION-STAGE-2 -o docker0 -j DROP
-A DOCKER-ISOLATION-STAGE-2 -j RETURN
-A DOCKER-USER -j RETURN
```
Let's examine these rules.  Another way to view them is by listing them per
chain with the verbose option to show packet counts.  Because at the point I am
ssh'ing into the VM, only the INPUT and OUTPUT chains have non-zero packet
counts.

```bash
$ sudo iptables -Z  # first zero the counts
$ sudo iptables -vL
Chain INPUT (policy ACCEPT 371 packets, 25457 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 324 packets, 124K bytes)
 pkts bytes target     prot opt in     out     source               destination         
```
### Pinging Out to the Internet
The packet counts do not change if I bring up a container (`docker run -it
alpine ash`), but if I ping out from the container to the Internet (8.8.8.8),
they start to increment:

```bash

Chain INPUT (policy ACCEPT 145 packets, 8740 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain FORWARD (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
   28  2352 DOCKER-USER  all  --  any    any     anywhere             anywhere            
   28  2352 DOCKER-ISOLATION-STAGE-1  all  --  any    any     anywhere             anywhere            
   14  1176 ACCEPT     all  --  any    docker0  anywhere             anywhere             ctstate RELATED,ESTABLISHED
    0     0 DOCKER     all  --  any    docker0  anywhere             anywhere            
   14  1176 ACCEPT     all  --  docker0 !docker0  anywhere             anywhere            
    0     0 ACCEPT     all  --  docker0 docker0  anywhere             anywhere            

Chain OUTPUT (policy ACCEPT 123 packets, 31380 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain DOCKER (1 references)
 pkts bytes target     prot opt in     out     source               destination         

Chain DOCKER-ISOLATION-STAGE-1 (1 references)
 pkts bytes target     prot opt in     out     source               destination         
   14  1176 DOCKER-ISOLATION-STAGE-2  all  --  docker0 !docker0  anywhere             anywhere            
   28  2352 RETURN     all  --  any    any     anywhere             anywhere            

Chain DOCKER-ISOLATION-STAGE-2 (1 references)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 DROP       all  --  any    docker0  anywhere             anywhere            
   14  1176 RETURN     all  --  any    any     anywhere             anywhere            

Chain DOCKER-USER (1 references)
 pkts bytes target     prot opt in     out     source               destination         
   28  2352 RETURN     all  --  any    any     anywhere             anywhere            
```

### Pinging from One Container to Another
Here are the counts if I bring up a second container in the `docker0` network
and ping the first container:

```bash

Chain INPUT (policy ACCEPT 254 packets, 15737 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain FORWARD (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
   22  1848 DOCKER-USER  all  --  any    any     anywhere             anywhere            
   22  1848 DOCKER-ISOLATION-STAGE-1  all  --  any    any     anywhere             anywhere            
   21  1764 ACCEPT     all  --  any    docker0  anywhere             anywhere             ctstate RELATED,ESTABLISHED
    1    84 DOCKER     all  --  any    docker0  anywhere             anywhere            
    0     0 ACCEPT     all  --  docker0 !docker0  anywhere             anywhere            
    1    84 ACCEPT     all  --  docker0 docker0  anywhere             anywhere            

Chain OUTPUT (policy ACCEPT 201 packets, 98253 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain DOCKER (1 references)
 pkts bytes target     prot opt in     out     source               destination         

Chain DOCKER-ISOLATION-STAGE-1 (1 references)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 DOCKER-ISOLATION-STAGE-2  all  --  docker0 !docker0  anywhere             anywhere            
   22  1848 RETURN     all  --  any    any     anywhere             anywhere            

Chain DOCKER-ISOLATION-STAGE-2 (1 references)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 DROP       all  --  any    docker0  anywhere             anywhere            
    0     0 RETURN     all  --  any    any     anywhere             anywhere            

Chain DOCKER-USER (1 references)
 pkts bytes target     prot opt in     out     source               destination         
   22  1848 RETURN     all  --  any    any     anywhere             anywhere            
```


The rules for the default Docker bridge, `docker0`, are:
```
-A FORWARD -o docker0 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
-A FORWARD -o docker0 -j DOCKER
-A FORWARD -i docker0 ! -o docker0 -j ACCEPT
-A FORWARD -i docker0 -o docker0 -j ACCEPT
-A DOCKER-ISOLATION-STAGE-1 -i docker0 ! -o docker0 -j DOCKER-ISOLATION-STAGE-2
-A DOCKER-ISOLATION-STAGE-2 -o docker0 -j DROP
```


