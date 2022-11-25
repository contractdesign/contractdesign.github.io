---
title: Notes on the Linux Linker ld
layout: post
categories: programming
tags: linux linker ld
---

To list the paths for the linker

    ldconfig -v

To list the default linker script

    ld --verbose

To print the size of elf sections

    size <PROGRAM> # size `which ls`

A linker takes a number of object files and produces an object file, sometimes called an executable.

[linker script syntax](https://home.cs.colorado.edu/~main/cs1300/doc/gnu/ld_3.html)

# Example of a Simple Linker Script

In this example,
- code (text) starts at 0x10000
- data starts at 0x8000000
- uninitialized data (bss) starts after data segment

```
SECTIONS {
. = 0x10000;
.text : { *(.text) }
. = 0x8000000;
.data : { *(.data) }
.bss : { *(.bss) } 
}
```

[Using ld, the Gnu Linker](http://web.mit.edu/rhel-doc/3/rhel-ld-en-3/scripts.html)
[linker commands](http://web.mit.edu/rhel-doc/3/rhel-ld-en-3/simple-commands.html)

## Sections

- text: executable
- bss: uninitialized data. heap area usually begins at end of bss
- data: initialized data

VMA (virtual memory address) and LMA (load memory address) are generally the same

# Tools

To see what the dynamic linker is doing,
```bash
$ LD_DEBUG=all ./a.out 2>ld.txt
```

Use `help` in place of `all` to see other outputs.


In `/proc/self/maps`, neither of the sections `[heap]` or `[stack]` are defined in the default linker script. Who defines them?
