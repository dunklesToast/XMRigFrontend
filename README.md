# XMRigFrontend
This is a Simple Frontend for the XMRig Monero Miners.
It shows all the important informations (Hashrate, Last Connection loss...) and has a simple, responsive Design.
You can test it at the [Live Demo](https://dunklestoast.github.io/XMRigFrontend/index.html) on GitHub Pages!

## Features
- Easy Install
- No Server needed
- configurable
- Supports [XMRig CPU Miner](https://github.com/xmrig/xmrig)


## Installation
##### GitHub Pages Version
If you don't have a WebServer you can simply use the Version on [my Server](http://xmrig.dunklestoast.de/).
It has no SSL due to #2. If you want to use it with SSL (maybe because you are mining on a Server or something use this: [GitHub Pages](https://dunklestoast.github.io/XMRigFrontend/index.html)
All requests to the miner are made directly from your Device. If you use the GitHub Pages Version there is no need too Setup a Server! If you use Chrome and your Miner has no HTTPS, you need click on the Shield in the Addressbar and Allow "Unsafe Scripts". 

##### SelfHosted
If you like to host this page yourself, simply drag and drop the 3 Files to your WebServer. All dependencies are loaded from cdn.js to make the installation as simple as possible. But if you want to, you can replace them easily!

## Setup
The Setup is very easy.
You just need to open the Page on your WebBrowser and enter your Host and Port in the Settings menu (the icon in the upper right).
The Host is the IP Address of your miner. On linux (and macOS) you can get it with the `ifconfig` command and on Windows there is the `ipconfig`!
If you enabled the Bearer Authorization you can also use it. All Settings are Stored locally on your PC.


## Bugs
If you found a Bug please let me know and create an Issue here!

## Enhancements
You have great Ideas how to make this better?
Create an Issue with your Idea or open a Pull Request!
