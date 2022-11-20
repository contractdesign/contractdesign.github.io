---
layout: post
title: Network Namespaces
categories: programming
tags: linux networking
---

Network namespaces have their own network protocol stacks distinct
from those of the hosts.  This means that a namespace can have its own
internal routing rules, independent of those of the host.

# Setup
To play with this, let's create a pair of network namespaces, connect
them with veth pairs and experiment with pinging between them.  I
borrowed this
[script](https://unix.stackexchange.com/questions/405805/connecting-two-network-namespaces-via-a-veth-interface-pair-where-each-endpoint)
that I found on stackoverflow to create this situation.  The script
must be invoked with `sudo`.

{% highlight bash %}
#!/bin/bash

# Create two network namespaces
ip netns add 'test-1'
ip netns add 'test-2'

# Create a veth virtual-interface pair
ip link add 'myns-1-eth0' type veth peer name 'myns-2-eth0'

# Assign the interfaces to the namespaces
ip link set 'myns-1-eth0' netns 'test-1'
ip link set 'myns-2-eth0' netns 'test-2'

# Change the names of the interfaces (I prefer to use standard interface names)
ip netns exec 'test-1' ip link set 'myns-1-eth0' name 'eth0'
ip netns exec 'test-2' ip link set 'myns-2-eth0' name 'eth0'

# Assign an address to each interface
ip netns exec 'test-1' ip addr add 192.168.1.1/24 dev eth0
ip netns exec 'test-2' ip addr add 192.168.2.1/24 dev eth0

# Bring up the interfaces (the veth interfaces and the loopback interfaces)
ip netns exec 'test-1' ip link set 'lo' up
ip netns exec 'test-1' ip link set 'eth0' up
ip netns exec 'test-2' ip link set 'lo' up
ip netns exec 'test-2' ip link set 'eth0' up

# Configure routes
ip netns exec 'test-1' ip route add default via 192.168.1.1 dev eth0
ip netns exec 'test-2' ip route add default via 192.168.2.1 dev eth0
{% endhighlight %}

# Experiment
Now that the two namespaces, `test-1` and `test-2`, have been created,
use `ip netns exec test-1 /bin/bash` to open a shell to `test-1`
and similarly open one to `test-2`.  In `test-1`, ping the other
container at address 192.168.2.1 while watching the packet counts for
the various rules using:

{% highlight bash %}
$ watch -d iptables -vnL
{% endhighlight %}

Disable the ping response from `test-2` to observe only the
INPUT chain counters incrementing.

{% highlight bash %}
    echo "1" > /proc/sys/net/ipv4/icmp_echo_ignore_all
{% endhighlight %}

Experiment with adding chains and rules to the chains and seeing the
effect on the rule counters.

{% highlight bash %}
$ iptables -N COUNT
$ iptables -A INPUT -j COUNT
$ iptables -A COUNT -d 192.168.2.1 -j RETURN
{% endhighlight %}

To restore the original table,

{% highlight bash %}
$ iptables -F
$ iptables -X COUNT
{% endhighlight %}

Alternatively, delete the namespace itself in a shell on the *host*, 

{% highlight bash %}
$ ip netns rm test-1
{% endhighlight %}
