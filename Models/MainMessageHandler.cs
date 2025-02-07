using Photino.NET;
using System.Text.Json;
using NewLibre;
using DiscoProcs;
using System.Reflection.Metadata.Ecma335;

public class MainMessageHandler{
    static public void MessageHandler(object? sender, string message) 
     {
        var window = sender as PhotinoWindow;

        if (message == null){
            return;
        }
        
        WindowMessage? wm = JsonSerializer.Deserialize<WindowMessage>(message);

        if (wm == null){
            return;
        }
        
        switch(wm.Command){
            case "getCurrentDirectory":{
                wm.Parameters = Environment.CurrentDirectory;
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getDirSeparator":{
                // Path seperators on diff OSes are not the same
                // This is a helper method to handle that.
                wm.Parameters = System.IO.Path.DirectorySeparatorChar.ToString();
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getUserProfile":{
                wm.Parameters = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getAllProcNames":{
                Program.allProcs = null;
                SystemInfo dpp = new();
                Program.allProcs = dpp.GetAllProcesses();
                wm.Parameters = string.Join(",",Program.allProcs.Select(p => {return $"{p.Name}:{p.ProcId}"; }));
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getProcessModules":{
                SystemInfo dpp = new();
                wm.Parameters = string.Join(",",dpp.GetAllProcModules(Convert.ToInt32(wm.AllParameters[0])));
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getProcFileName":{
                if (Program.allProcs.Count <= 0){
                    SystemInfo dpp = new();
                    Program.allProcs = dpp.GetAllProcesses();
                }
                var pinfo = Program.allProcs.First(p => p.ProcId == Convert.ToInt32(wm.Parameters));
                wm.Parameters = pinfo.Filename;
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getProcDetails":{
                if (Program.allProcs.Count <= 0){
                    SystemInfo dpp = new();
                    Program.allProcs = dpp.GetAllProcesses();
                }
                try{
                    var pinfo = Program.allProcs.First(p => p.ProcId == Convert.ToInt32(wm.Parameters));
                    wm.Parameters = $"{pinfo.Name},{pinfo.ProcId},{pinfo.Filename},{pinfo.FileDate},{pinfo.FileSize},{pinfo.GetWorkingSet()},{pinfo.GenSha256Hash()}";
                }
                catch(Exception ex){
                    Console.WriteLine($"Couldn't get details: ${ex.Message}");
                    wm.Parameters = $"Couldn't access details,inaccessible,inaccessible,inaccessible,inaccessible";
                }
                
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "saveProcSnapshot":{
                Console.WriteLine("I received saveProcSnapshot msg.");
                SystemInfo dpp = new();
                Program.allProcs = dpp.GetAllProcesses();

                List<int> allPids = new();
                bool isAdded = false;
                // Going to key off the filename in an attempt to only
                // get unique processes.
                // This is bec on MACOS they are named the same but point to different
                // exe files
                
                HashSet<string> nameTrack = new();
                bool isMacOS = OperatingSystem.IsMacOS();
                
                for (int idx = 0; idx < Program.allProcs.Count;idx++){
                    var name = Program.allProcs[idx].Name.ToLower();
                    var filename = Program.allProcs[idx].Filename;
                    if (String.IsNullOrEmpty(name)){
                        if (!String.IsNullOrEmpty(filename)){
                            var beginIdx = filename.LastIndexOf(Path.DirectorySeparatorChar);
                            if (beginIdx > -1){
                                name = filename.Substring(beginIdx,filename.Length - beginIdx);
                            }
                        }
                    }
                
                    isAdded = nameTrack.Add(filename);
                
                    
                    // if isAdded, it means that the process name was successfully
                    // added to the hashset, which means it hasn't been added previously
                    // which means we want to add it to our list of pids
                    // This all insures that each proc name is only added once.
                    // For our snapshots, we only want one of each unique process added.
                    if (isAdded){
                        //Console.Write($"{allProcs[idx].Id} : ");
                        allPids.Add(Program.allProcs[idx].ProcId);
                    }
                }
                
                SnapshotService snapsvc = new();
                snapsvc.SaveAllProcs(allPids.ToArray());

                wm.Parameters = $"{true}";
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "saveSelectedProcs":{
                wm.Parameters = "";
                List<int> allPids = new();
                if (wm.AllParameters.Count() <= 0){
                    wm.Parameters = $"{false}";
                    window?.SendWebMessage(JsonSerializer.Serialize(wm));
                    return;    
                }
                foreach(string id in wm.AllParameters){
                    allPids.Add(Convert.ToInt32(id)) ;
                }
                SnapshotService snapsvc = new();
                snapsvc.SaveAllProcs(allPids.ToArray());

                wm.Parameters = $"{true}";
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getProcInfoByName":{
                SnapshotRepository sr = new();
                wm.Parameters =  sr.GetMatchingSnapshotsByName(wm.AllParameters[0]);
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "killProcess": {
                SnapshotService ss = new();
                try{
                    var procId = Convert.ToInt32(wm.Parameters);
                    wm.Parameters = ss.KillProcess(procId).ToString();
                    window?.SendWebMessage(JsonSerializer.Serialize(wm));
                }
                catch (Exception ex){
                    // couldn't conver the proc id to a valid int
                    // so just return false.
                    wm.Parameters = "false";
                    window?.SendWebMessage(JsonSerializer.Serialize(wm));
                }
                
                break;
            }
            case "getSpecialFolders":{
                EnvironmentService es = new ();
                
                wm.Parameters = es.GetSpecialFolders();
                Console.WriteLine(wm.Parameters);
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "getEnvVars":{
                EnvironmentService es = new ();
                wm.Parameters = es.GetAllEnvVars();
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "doesFileExist":{
                var procFile = wm.Parameters.Trim();
                var result = File.Exists(procFile);
                wm.Parameters = JsonSerializer.Serialize(new {doesExist=result, procFile= (result ? procFile : string.Empty)});
                Console.WriteLine(wm.Parameters);
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "startProcess":{
                var procFile = wm.AllParameters[0];
                string localParams = wm.AllParameters.Length > 1 ? wm.AllParameters[1] : String.Empty;
                EnvironmentService es = new();
                var procId = es.StartProcess(procFile,localParams);
                wm.Parameters = JsonSerializer.Serialize(new{procId=procId});
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            case "showNewProcs":{
                SnapshotRepository sr = new();
                wm.Parameters = sr.GetNewProcesses();
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                break;
            }
            default :{
                // The message argument is coming in from sendMessage.
                // "window.external.sendMessage(message: string)"
                wm.Parameters = $"Received message: \"{wm.Parameters}\"";

                // Send a message back the to JavaScript event handler.
                // "window.external.receiveMessage(callback: Function)"
                window?.SendWebMessage(JsonSerializer.Serialize(wm));
                    break;
                }
        }
    }
}