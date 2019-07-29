Mopidy.Finder
====

Mopidy that Findable - Mopidy Frontend for a Thousand Songs or More.

![Mopidy.Finder](https://raw.githubusercontent.com/ume05rw/Mopidy.Finder/master/src/img/forHitHyb/fullscreen.png "Mopidy.Finder")  
  
## Description

Mopidy is a Great Music Server, It is very small and works every-linuxes.  
But, If you add a thousand songs, it will be difficult to find the album you are looking for.  
  
This app makes and holds the relationship data for Genres / Artists / Albums.  
You will soon find the song you are looking for!　　

## Supported Platform
* Windows10 (**only x64 platform**)  
* Any Linux on x64
* RaspberryPi (**Raspbian November 2018 or later**)
  

## Usage for Windows
1. [Download Zip-Arvhive.](https://github.com/ume05rw/Mopidy.Finder/releases/download/v1.0/win-x64-installer.zip)  
2. Unzip archived-files. 
3. Run 'setup.exe', to Install your system.
4. Run 'Start Mopidy Finder' on your Desktop Shoptcut and little wait, it wake up Browser.

## Usage for Linux
1. [Download Zip-Arvhive for your platform.](https://github.com/ume05rw/BrWebHost/releases)  
2. Unzip archived-files to your Install Folder, ex) /var/mopidyfinder/  
3. Set your Firewall, Open TCP/UDP 6690 ports.


Start on Command-Line.
     
     # /var/mopidyfinder/MopidyFinder
     

If Start on Systemd, add 'mopidyfinder.service' to /etc/systemd/system/, like:

    
    [Unit]
    Description=Mopidy.Finder

    [Service]
    ExecStart=/var/mopidyfinder/MopidyFinder
    WorkingDirectory=/var/mopidyfinder/
    Restart=alway
    RestartSet=10
    SyslogIdentifier=mopidyfinder
    KillSignal=SIGINT
    User=root
    Environment=ASPNETCORE_ENVIRONMENT=Production

    [Install]
    WantedBy=multi-user.target
    
enabling service:

     
    # sudo systemctl enable mopidyfinder 
     

starting service:

     
    # sudo systemctl start mopidyfinder
     

and Access **localhost:6690** from your browser.  
  
If it NOT Works, Install [**.Net Core 2.2 Runtime**](https://dotnet.microsoft.com/download/dotnet-core/2.2) to your platform.  


## Usage for Othres
1. Install [**.Net Core 2.2 SDK**](https://dotnet.microsoft.com/download/dotnet-core/2.2) to your platform.
2. Git Clone this project.
3. Restore, Build, Publish "BrWebHost" and Run.

restore Nuget packages:   
     
    # dotnet restore ./MopidyFinder.csproj

build:  
     
    # dotnet build ./MopidyFinder.csproj

publish:
     
    # dotnet publish ./MopidyFinder.csproj -c Release -r [osx-x64|linux-x86|win-x86|as your platform]

run:
     
    # dotnet [published_path]/MopidyFinder.dll
  
and Access **localhost:6690** from your browser.    
  


## Licence

[MIT Licence](https://github.com/ume05rw/MopidyFinder/blob/master/LICENSE)

## Author

[Do-Be's](http://dobes.jp)
