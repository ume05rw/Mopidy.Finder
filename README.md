Mopidy.Finder
====

Mopidy that Findable - Mopidy Frontend for a Thousand Songs.

[Mopidy.Finder](https://raw.githubusercontent.com/ume05rw/Mopidy.Finder/master/src/img/forGitHub/fullscreen.png "Mopidy.Finder")
  
## Description

Mopidy is a Great Music Server, It is very small and works every-linuxes.  
But, If you add a thousand songs, it will be difficult to find the album you are looking for.  
  
This app makes and holds the relationship data for Genres / Artists / Albums.  
You will soon find the song you are looking for!　　

## Supported Platform
* Windows10 (**only x64 platform**)  
* Any Linux on x64
* RaspberryPi (**Raspbian November 2018 or later**)
  
## Requirements
* Mopidy (Running on your LAN, It doesn't have to run on the same device as Mopidy.Finder.)
* Mopidy-Local-Images
* Mopidy-Local-Sqlite (recommended, not required)

## Installation on Windows
1. [Download Zip-Archived Installer.](https://github.com/ume05rw/Mopidy.Finder/releases/download/v1.3/win-x64-installer-v1.3.zip)  
2. Unzip archived-files. 
3. Run 'setup.exe', to Install your system.
4. Run 'Start Mopidy Finder' on your Desktop Shoptcut and little wait, it wake up Browser.
5. Once started, The icon is added to your task tray.  
![IconOnTray](https://raw.githubusercontent.com/ume05rw/Mopidy.Finder/master/src/img/forGitHub/iconOnTray.jpg "IconOnTray")  
6. Show, Start and Stop, Right-click the icon to display a list for each operation.  
![ShowList](https://raw.githubusercontent.com/ume05rw/Mopidy.Finder/master/src/img/forGitHub/iconRightClicked.jpg "ShowList")  

## Installation on Linux
1. [Download Tar-Archive for your platform.](https://github.com/ume05rw/Mopidy.Finder/releases)  
for Raspberry-Pi: [linux-arm-v1.3.tar.gz](https://github.com/ume05rw/Mopidy.Finder/releases/download/v1.3/linux-arm-v1.3.tar.gz)  
for any linux-x64: [linux-x64-v1.3.tar.gz](https://github.com/ume05rw/Mopidy.Finder/releases/download/v1.3/linux-x64-v1.3.tar.gz)

```sh
# wget https://github.com/ume05rw/Mopidy.Finder/releases/download/v1.3/linux-arm-v1.3.tar.gz 
```

2. Extract archive to your Install Folder: ex) /var/mopidyfinder

```sh     
# sudo mkdir /var/mopidyfinder
# sudo tar xvzf ./linux-arm-v1.3.tar.gz -C /var/mopidyfinder
# sudo chown pi:pi -R /var/mopidyfinder
# sudo chmod 755 -R /var/mopidyfinder
```     

3. Set your Firewall, Open TCP 6690 ports.

4. Start on Command-Line.

```sh    
# cd /var/mopidyfinder
# ./MopidyFinder
```    

5. Access **device-ipaddress:6690** from your browser.  

6. If Start on Systemd, add 'mopidyfinder.service' to /etc/systemd/system/, like:

```sh    
    [Unit]
    Description=Mopidy.Finder
    
    [Service]
    ExecStart=/var/mopidyfinder/MopidyFinder
    WorkingDirectory=/var/mopidyfinder/
    Restart=alway
    RestartSet=10
    SyslogIdentifier=mopidyfinder
    KillSignal=SIGINT
    User=pi
    Environment=ASPNETCORE_ENVIRONMENT=Production
    
    [Install]
    WantedBy=multi-user.target
```
    
enabling service:

```sh     
# sudo systemctl enable mopidyfinder 
```     

starting service:

```sh
# sudo systemctl start mopidyfinder
```

check status:
```sh
# sudo systemctl status mopidyfinder
● mopidyfinder.service - Mopidy.Finder - Mopidy that Findable
   Loaded: loaded (/etc/systemd/system/mopidyfinder.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2019-07-31 15:34:34 JST; 26s ago
 Main PID: 21102 (MopidyFinder)
   CGroup: /system.slice/mopidyfinder.service
           mq21102 /var/mopidyfinder/MopidyFinder

 7月 31 15:34:48 raspberrypi mopidyfinder[21102]: 2019-07-31 15:34:48.0929|10103|WARN|Microsoft.EntityFrameworkCore.Query|Query: '(from Settin
 7月 31 15:34:52 raspberrypi mopidyfinder[21102]: Hosting environment: Production
 7月 31 15:34:52 raspberrypi mopidyfinder[21102]: Content root path: /var/mopidyfinder
 7月 31 15:34:52 raspberrypi mopidyfinder[21102]: Now listening on: http://[::]:6690
 7月 31 15:34:52 raspberrypi mopidyfinder[21102]: Application started. Press Ctrl+C to shut down.
 7月 31 15:34:53 raspberrypi mopidyfinder[21102]: 2019-07-31 15:34:53.1781|10102|WARN|Microsoft.EntityFrameworkCore.Query|Query: '(from Album
 7月 31 15:34:53 raspberrypi mopidyfinder[21102]: 2019-07-31 15:34:53.7283|20500|WARN|Microsoft.EntityFrameworkCore.Query|The LINQ expression
 7月 31 15:34:53 raspberrypi mopidyfinder[21102]: 2019-07-31 15:34:53.7493|20500|WARN|Microsoft.EntityFrameworkCore.Query|The LINQ expression
 7月 31 15:34:53 raspberrypi mopidyfinder[21102]: 2019-07-31 15:34:53.7581|20500|WARN|Microsoft.EntityFrameworkCore.Query|The LINQ expression
 7月 31 15:34:53 raspberrypi mopidyfinder[21102]: 2019-07-31 15:34:53.8376|20500|WARN|Microsoft.EntityFrameworkCore.Query|The LINQ expression
```
  
If it NOT Works, Install [**.Net Core 2.2 Runtime**](https://dotnet.microsoft.com/download/dotnet-core/2.2) to your platform.  

## Installation on OSX
...I'm only checking that the binary running correctly.  
I don't know how to make the app work as a service.  
Please let me know!  
  
## Initial Setup

1. When Mopidy can not be found in local, a setup form comes out.  
Enter your Mopidy address.  
![Initial-Setup1](https://raw.githubusercontent.com/ume05rw/Mopidy.Finder/master/src/img/forGitHub/initial-setup1.png "Initial-Setup1")  

2. If App find your Mopidy, Data initialization for the app will be performed.  
![Initial-Setup2](https://raw.githubusercontent.com/ume05rw/Mopidy.Finder/master/src/img/forGitHub/initial-setup2.png "Initial-Setup2")  

3. Data initialization may take some time depending on the number of songs, or app running device.  
![Initial-Setup3](https://raw.githubusercontent.com/ume05rw/Mopidy.Finder/master/src/img/forGitHub/initial-setup3.png "Initial-Setup3")  

4. If possible, leave it for a night or so after initialization.  
The album-scanning is finished, It can be used comfortably.  
![Initial-Setup1](https://raw.githubusercontent.com/ume05rw/Mopidy.Finder/master/src/img/forGitHub/initial-setup4.png "Initial-Setup1")  


## Licence

[MIT Licence](https://github.com/ume05rw/Mopidy.Finder/blob/master/LICENSE)

## Author

[Do-Be's](http://dobes.jp)
