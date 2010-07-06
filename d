#! /bin/sh
git push
ssh -t skookumx@skookumx.com "cd /var/www/vhosts/skookumx.com/subdomains/sitemap/httpdocs && git pull"