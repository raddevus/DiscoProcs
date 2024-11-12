using System.Diagnostics;
public class DpProcess{
    // The class to handle the management of executble processes.
    public List<string> GetAllProcNames(){
        Process [] allProcs = Process.GetProcesses();
        List<string> sl = new List<string>();
        foreach (Process p in allProcs)
        {
            var stopChar = p.ProcessName.IndexOf(" ");
            if (stopChar < 1){
                stopChar = p.ProcessName.Length;
            }
            sl.Add($"{p.ProcessName.Substring(0,stopChar)}:{p.Id}");
        }
        sl.Sort();
        return sl;
    }

    public List<string> GetAllProcModules(string targetProcName){
        // Get all the modules that a specific process loads
        Process [] allProcs = Process.GetProcesses();
        foreach (Process p in allProcs){
            if (p.ProcessName == targetProcName){
                ProcessModuleCollection allModules = p.Modules;
                foreach (ProcessModule pm in allModules){
                    Console.WriteLine(pm.ModuleName);
                }
            }
        }
        return new List<string>();
    }

    public string GetProcFileName(int procId){
        
        Process [] allProcs = Process.GetProcesses();
        foreach (Process p in allProcs){
            if (p.Id == procId){
                Console.WriteLine("### GOT THE PROC #####!");
                try{
                Console.WriteLine($"{p.MainModule.FileName}");
                return p.MainModule.FileName;
                //return p.PrivateMemorySize.ToString("N0");
                }
                catch (Exception ex){
                    Console.WriteLine($"Failed: {ex.Message}");
                    return string.Empty;
                }
            }
        }
        return "Couldn't get title";
    }
}