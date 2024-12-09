## Important NOTE
To build and run this project you'll need my other repo (.NET assembly / .DLL) located at: [https://github.com/raddevus/NlSysInfo](https://github.com/raddevus/NlSysInfo)
## 
## C# .NET Core (net8.x)
This project is written in C# & is built & runs on .net core 8.x

## Fully Cross-Platform
This app is built on [TryPhotino.io](https://www.tryphotino.io/) and runs on all Big-3 Operating Systems.
Runs on macOS, Linux, Windows
Just build and run on any platform

## Creates Sqlite DB & Tables
This project will create a sqlite db on your system.<br/>
It will create the sqlite db in your user share using the SpecialFolder LocalApplicationData<br/>
Ex. (linux) `/home/<user-name>/.local/share` <br/>
The sqlite filename is: `nlsysinfo.db`

## DiscoProcs Build Steps
You will need to :
1) get the DiscoProcs source (repo link above)
2) create a directory named `external` in the DiscoProcs project folder
3) get and build the NlSysInfo project
4) Copy the DLL (NlSysInfo.dll) to the `DiscoProcs/external` folder<br/>
  You'll find the dll in the `NlSysInfo/NlSysInfo/bin/Debug/net8.0` directory
6) Build & run DiscoProcs (`$ dotnet run`)

## DiscoProcs Usage - So Far
![DiscoProcsExplained](https://github.com/user-attachments/assets/06918739-69c8-4283-9967-1462399e8ff0)

## Update 2024-12-10
### Added Context Menu
Now you can right-click the Process List and you'll get two menu options for things you can do.
1. Save Selected Procs
2. Kill (selected) Process -- NOTE: there is no warning, selecting the menu item will attempt to kill the process
![image](https://github.com/user-attachments/assets/972c367a-1ff7-46a8-ab90-ed3419622fc8)
