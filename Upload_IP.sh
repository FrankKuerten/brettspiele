#!/bin/bash
# Script zur Erstellung einer Weiterleitung auf die eigene lokale IP

cd /home/frank/Python/BrettSpiele
echo '<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; URL=http://' > content.html
wget -q -O - http://network-science.de/tools/myip/ >> content.html
echo ':8080/"></head></html>' >> content.html

ftp -n frank-kuerten.de << EOF
user p7265746 $1
cd Abalone
ascii
passive
put content.html
bye
EOF
