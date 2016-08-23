#!/bin/bash
# Script zum Upload einer fadenscheinigen Entschuldigung

cd /home/frank/Python/BrettSpiele

ftp -n frank-kuerten.de << EOF
user p7265746 $1
cd Abalone
ascii
passive
put sorry.html content.html
bye
EOF
