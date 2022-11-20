---
layout: post
title: A Makefile For This Website
categories: programming
tags: makefile jekyll
---

I use the makefile below to automate some of the maintenance of this
website.  It can build, serve, and upload the local copy to the web
host.  This website uses [Jekyll](https://jekyll.org) to generate the
site from markdown templates.

# Optional: Create SSH keypairs

To eliminate the need to provide a password during the upload (`scp`
below), create a new SSH keypair.

{% highlight bash %}
$ ssh-keygen -b 2048 -t rsa
{% endhighlight %}

Depending on your webhosting service, you might need to upload the key
through an administrative interface or use `ssh-copy-id` to copy it
directly to your host.

# makefile

{% highlight makefile %}
# local Jekyll directory name
SITE=plain

# info for hosted website 
USER=XXX
HOSTNAME=XXX

build: clean
	jekyll build -s ${SITE}

# to serve externally, add the --host option
serve:
	jekyll serve -s ${SITE} --host=0.0.0.0 -w

upload: build
	scp -r _site/* ${USER}@${HOSTNAME}:/home/public

clean:
	jekyll clean
{% endhighlight %}

