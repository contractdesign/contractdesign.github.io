---
layout: page
title: "Networking"
category: notes
---

This page has notes on various network protocols

# VLAN
A *virtual lan* (VLAN) is a broadcast domain that is partitioned and
isolated in a computer network at the data link layer.  A *broadcast
domain* is a logical division of a computer network, in which all nodes
can reach each other by broadcast at the data link layer.

The VLAN tag a 32-bit field is added after the Source MAC address and before the EtherType/Size field.
- 16b: Tag protocol identifier set to 0x8100 (TPID)

The following 16b comprise the tag control information (TCI):

- 3b: Priority code point (PCP) indicates class of service
- 1b: drop eligible indicator (DEI) to allow dropping during congestion
- 12b: VLAN Identifer (VID).  values of 0x000 and 0xfff are reserved

## References
[IEEE 802.1Q](http://www.ieee802.org/1/pages/802.1Q.html)

# VXLAN (Virtual Extensible LAN)
VXLAN is a L2 in L3 tunneling protocol that has a VLAN-like encapsulation to encapsulate Ethernet frames in UDP packets ([RFC 7348](https://tools.ietf.org/html/rfc826)).

# DHCP
DHCP lets a network element discover its IP address, among other parameters.  A DHCP exchange consists of four steps ("DORA") ([RFC 2131](http://tools.ietf.org/html/rfc2131)):

  1. **d**iscovery by client
  2. **o**ffer address by server 
  3. **r**equest address by client
  4. **a**cknowledge by server

## DHCP client in Linux
`dhclient` is the Ubuntu DHCP client daemon.  Search for dhcp in  /var/log

# Address Resolution Protocol (ARP)

ARP lets a network element determine the Ethernet address that corresponds to an IP address ([RFC 826](https://tools.ietf.org/html/rfc826)).

An ARP exchange consists of two messages:

1. query: sent to the data link **broadcast** address indicating a network layer address for which the transmitter needs the corresponding data link address
2. response: response that contains the desired data link layer address.

ARP is carried in an Ethernet frame with protocol type 0x0806 and
contains no IP header.

# TODO
802.1AD








