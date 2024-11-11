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
}