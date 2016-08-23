#!/usr/bin/python
# -*- coding: utf-8 -*-
# Script ermittelt die IP per UDP

import socket
import requests

def main():
    UDP_IP = "127.0.0.1"
    UDP_PORT = 5005
    MESSAGE = "Hello, World!"

    sock = socket.socket(socket.AF_INET, # Internet
                         socket.SOCK_DGRAM) # UDP
    sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))

    print(sock)
    print(socket.getaddrinfo("frank-kuerten.de", 80, 0, 0, socket.IPPROTO_TCP))
    sock.connect(("frank-kuerten.de",80))
    print(sock.getsockname())
    print(sock.getsockname()[0])
    print(socket.gethostname())
    print(socket.gethostbyname(socket.gethostname()))

    ip = requests.get('http://frank-kuerten.de/hello')
    print(ip.headers)
    print(ip.request.headers)
    print(ip.request.headers['Connection'])
    print(ip.text)

    ip = requests.get('http://network-science.de/tools/myip/')
    print(ip.text)
    print(ip.headers)
    print(ip.request.headers)

if __name__ == '__main__':
    main()