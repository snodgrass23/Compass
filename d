#! /bin/sh
git push
ssh -t skookumx@skookumx.com "cd /hunter/sitemap/ && git pull"