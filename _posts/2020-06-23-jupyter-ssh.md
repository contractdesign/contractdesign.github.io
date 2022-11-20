---
layout: post
title: Jupyter Notes
categories: programming
tags: jupyter ssh
---

## Remote Access

I access Jupyter notebooks from a VM in the cloud.  I set it
up so infrequently that I forget how to do it, so I am recording
the steps here
(see reference [link](https://drscotthawley.github.io/How-To-Port-Forward-Jupyter-Notebooks/)))


On the VM in the cloud, start jupyter. Take note of the port that it uses on localhost.  It's typically 8888.

```
$ jupyter notebook
```

On your local machine, set up SSH port forwarding,
```
$ ssh -N -n -L 127.0.0.1:8888:127.0.0.1:8888 -p 222 <name>@<ip address>
```

You should be able to see the jupyter session on the browser now,  Access it by
going to `localhost:8888` in your browser.  If you password-protect your
notebooks, you would need to enter  your password here.

## Extracting Code from a Notebook

Sometimes I use jupyter to do some exploratory coding.  At some
point, I need to treat the code more formally and need to put it in its own
files.  This method extracts code from a notebook
([stackoverflow](https://stackoverflow.com/questions/54350254/get-only-the-code-out-of-jupyter-notebook)).
```
$ jupyter nbconvert --to script notebook_name.ipynb
```

## Saving a Notebook as HTML

You might need to save a notebook as an HTML to add to a
webpage using the CLI. Here is [stackoverflow](https://stackoverflow.com/questions/37657547/how-to-save-jupyter-notebook-to-html-by-code)
to the rescue again:
```
$ jupyter nbconvert --to html notebook_name.ipynb
```

## Viewing in github

To view rendered HTML in github, append the url of the HTML content to
```
https://htmlpreview.github.io/?https://github.com/...
```
