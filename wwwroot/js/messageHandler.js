
let today = new Date();
let allLocalProcs = [];
let currentProcess = {};

initMessageHandler();
// read all the local procs from localStorage
let procButtonCount;
initLocalProcs();


document.querySelector("#specFoldersBtn").addEventListener("click", () => {
  clearResultInfo();
  getSpecialFolders();
});

document.querySelector("#envVarsBtn").addEventListener("click", () => {
  clearResultInfo();
  getEnvironmentVars();
});

document.querySelector("#v-pills-main-tab").addEventListener("click", () => {
  toggleResultAlert(false);
  scrollSelectedItemIntoView();
});

let selector = document.querySelector("#procList");
 selector.addEventListener("click", () => {
  toggleResultAlert(false);
   getProcDetails();
 });

selector.addEventListener("change", () => {
  toggleResultAlert(false);
  getProcDetails();
});

document.querySelector("#alertClose").addEventListener("click", () => {
  toggleResultAlert(false);
});

let startAllBtn = document.querySelector("#startAllBtn");
startAllBtn.addEventListener("click", () => {
    toggleResultAlert(false);
    startAllProcesses();
});

document.querySelector("#saveProcPathBtn").addEventListener("click", () =>
  {
    toggleResultAlert(false);
    addNewProc();
  }
);

function setActiveState(htmlEl){
  Array.from(document.querySelectorAll(".procBtnGroup")).map( btnGroup => {btnGroup.classList.remove("active");  btnGroup.classList.remove("current");});
  htmlEl.classList.add("active");
  htmlEl.setAttribute("aria-current","current");
}

function addNewProc(){
  toggleResultAlert(false);
  let procPath = document.querySelector("#procPath").value;
  if (procPath == ""){
    setResultMsg("Please add a path to a process & try again.");
    toggleResultAlert(true);
    return;
  }
  checkIfProcFileExists(procPath);
  // At this point processing gets pushed to the 
  // switch statement -- after the c# File.Exists() call is completed
}

function startAllProcesses(){
  // get the list out of localStorage
  var allProcs = JSON.parse(localStorage.getItem("allProcs"));
  allProcs.forEach(p => {
    var procDetails = `${p.ExePath},${p.Params}`;
    startProcess(procDetails);
  });
}

function checkIfProcFileExists(procPath){
  let message = {}; // create basic object
    message.Command = "doesFileExist";
    message.Parameters = procPath;
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
}

function startProcess(procDetails){
  let message = {}; // create basic object
    message.Command = "startProcess";
    message.Parameters = procDetails;
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
}

function sendMessage(sMessage){
    console.log(sMessage);
    window.external.sendMessage(sMessage);
}

function scrollSelectedItemIntoView(){
  var procList = document.querySelector("#procList");
  if (procList.selectedIndex >= 0){
    procList.selectedOptions[0].scrollIntoView();
  }
}

// allCommands is the list of all commands (strings) processed by the switch statement
var allCommands = ["getCurrentDirectory",
    "getDirSeparator",
    "getUserProfile", 
    "getAllProcNames",
    "getProcessModules",
    "getProcFileName", 
    "getProcDetails",
    "saveProcSnapshot",
    "saveSelectedProcs",
    "getProcInfoByName",
    "killProcess",
    "getSpecialFolders",
    "getEnvVars",
    "doesFileExist",
    "startProcess",
    "showNewProcs"];

  function getCurrentDir(){
    let message = {}; // create basic object
    message.Command = "getCurrentDirectory";
    message.Parameters = "null";
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getAllProcNames(){
    document.querySelector("#procList").options.length = 0;
    let message = {}; // create basic object
    message.Command = "getAllProcNames";
    message.Parameters = "null";
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getProcessModules(){
    let message = {}; // create basic object
    message.Command = "getProcessModules";
    // following line substrings out the pid header 
    // and trims out the spaces to get the pid
    let pid = Number(`${document.querySelector("#pid").innerHTML.substring(21).trim()}`);
    // sometimes we have a pid but no filename associated with process
    let exeFileName = document.querySelector("#pfile").innerHTML.substring(26).trim();
    if (Number.isNaN(pid) || exeFileName.length <= 1){
      setResultMsg("We can't seem to get either, a valid pid, or an exe file for that process,\n so we can't get more details.");
      toggleResultAlert(true);
      return;
    }
    message.Parameters = pid.toString();
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getProcFileName(){
    let message = {}; // create basic object
    message.Command = "getProcFileName";
    message.Parameters = document.querySelector("#procList").value;
    setResultMsg(`id: ${message.Parameters}`);
    toggleResultAlert(true);
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getProcDetails(){
    let message = {}; 
    message.Command = "getProcDetails";
    message.Parameters = document.querySelector("#procList").value;
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getSelectedProcDetails(){
    var allSelectedProcs = document.querySelector("#procList").selectedOptions;
    var allProcIds = Array.from(allSelectedProcs).map(({ value }) => value);
    console.log(allProcIds.length);
    var s = "";
    allProcIds.forEach(id => {s+= `${id},`});
    setResultMsg (s);
    toggleResultAlert(true);
  }

  function saveProcSnapshot(){
    // Saves all proc details to sqlite3 snapshot table.
    // This allows comparison of processes later.
    let message = {}; 
    message.Command = "saveProcSnapshot";
    message.Parameters = document.querySelector("#procList").value;
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function showNewProcs(){
    let message = {}; 
    message.Command = "showNewProcs";
    message.Parameters = "null";
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function saveSelectedProcs(){
    let message = {}; 
    message.Command = "saveSelectedProcs";
    var allProcIds = Array.from(document.querySelector("#procList").selectedOptions);
    var allIdCsv = "";
    allProcIds.map(v => allIdCsv += `${v.value},`);
    console.log(allIdCsv);
    message.Parameters = allIdCsv;
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getProcInfoByName(){
    let message = {};
    message.Command = "getProcInfoByName";
    var procName = document.querySelector("#procList").selectedOptions[0].textContent;
    // if it's equal to empty string, then we have to use the name from the details
    // bec this is an un-named proc
    // ## NOTE: Convert procName to an integer value -- bec if it is named after
    // the procId then it doens't have a procname and we have to get it from the filename
    if (procName >= 0){
      var fileText = document.querySelector("#pfile").textContent;
      var startIdx = fileText.lastIndexOf("/") >= 0 ? fileText.lastIndexOf("/") : fileText.lastIndexOf("\\");
      //increment startIdx by one bec need to skip / or \ symbol
      ++startIdx;
      if (startIdx >=0){
        procName = fileText.substring(startIdx);
      }
    }
    message.Parameters = procName;
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function killProcess(){
    // Need to add warning message that this will kill the process!
    let message = {}; 
    message.Command = "killProcess";
    message.Parameters = document.querySelector("#procList").value;
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getSpecialFolders(){
    let message = {}; 
    message.Command = "getSpecialFolders";
    message.Parameters = "null"
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getEnvironmentVars(){
    let message = {}; 
    message.Command = "getEnvVars";
    message.Parameters = "null"
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }


function initMessageHandler(){
    window.external.receiveMessage(response => {
      response = JSON.parse(response);
      switch (response.Command){
        case allCommands[0]:{
          setResultMsg(`current directory is: ${response.Parameters}`);
          toggleResultAlert(true);
          break;
        }
        case allCommands[1]:{

            dirSeparator = `${response.Parameters}`;
            setResultMsg(`dirSeparator ${dirSeparator}`);
            toggleResultAlert(true);
            break;
        }
        case allCommands[3]:{
          var allProcs = response.Parameters.split(",");
          document.querySelector("#ProcCount").innerHTML = `Found ${allProcs.length} processes.`;
          allProcs.forEach (p => {
            var pDetails = p.split(":");
            var procName = `${pDetails[0]}` != "" ? `${pDetails[0]}`: `${pDetails[1]}`
            var localOption = new Option(procName, pDetails[1], false, true);
		        document.querySelector('#procList').append(localOption);
		        //$("#procNames").val("");
          });
          // unselect all procs in the list
          document.querySelector("#procList").selectedIndex = -1; 
          break;
        }
        case allCommands[4]:{
          var resultObject = JSON.parse(response.Parameters);
          
          document.querySelector("#resultInfo").textContent = `Total memory size for all loaded modules is: ${parseInt(resultObject.totalMemSize).toLocaleString()} bytes.`;
          var allProcModuleRows = resultObject.modules;
          rowCount = allProcModuleRows.length;
          setButtonActive("v-pills-system");
          displayResultTable(allProcModuleRows, "#tableresults", buildProcModulesTable,"procModules","Process Modules");

          
          break;
        }
        case allCommands[5]:{
          var procFileName = `${response.Parameters}`;
          setResultMsg(`filename : ${procFileName}`);
          toggleResultAlert(true);          
          break;
        }
        case allCommands[6]:{
          var allParams = response.Parameters.split(",");
          allParams.forEach(p => {
             console.log(`param: ${p}`);
           });
          displayProcDetails(allParams);
          break;
        }
        case allCommands[7]:{
          var result = response.Parameters.split(",")[0].toLowerCase();
          if (result == "true"){
            setResultMsg("Successfully saved snapshot.");
            toggleResultAlert(true);
            return;
          }
          setResultMsg("Couldn't save.");
          toggleResultAlert(true);
          break;
        }
        case allCommands[8]:{
          var result = response.Parameters.split(",")[0].toLowerCase();
          if (result == "true"){
            setResultMsg("Successfully saved selected procs.");
            toggleResultAlert(true);
            return;
          }
          setResultMsg("Couldn't save.");
          toggleResultAlert(true);
            break;
          }
        case allCommands[9]:{
          var allSnapshotRows = JSON.parse(response.Parameters);
          var rowCount = allSnapshotRows.length;
          setButtonActive("v-pills-system");
          displayResultTable(allSnapshotRows, "#tableresults", buildProcResultTable,"history","Process History");
          break;
        }
        case allCommands[10]:{
          
          var result = response.Parameters.split(",")[0].toLowerCase();
          if (result == "true"){
            setResultMsg("Successfully killed proc.");
            toggleResultAlert(true);
          }
          else{
            setResultMsg("Could not kill the proc.");
            toggleResultAlert(true);
          }
          break;
        }
        case allCommands[11]:{
          var allSpecFolders = JSON.parse(response.Parameters);
          console.log(response.Parameters);
          var rowCount = allSpecFolders.length;
          setButtonActive("v-pills-system");
          displayResultTable(allSpecFolders, "#tableresults", buildSpecFoldersResultTable,"specialFolders", "Special Folders");
          break;
        }
        case allCommands[12]:{
          var allEnvVars = JSON.parse(response.Parameters);
          console.log(response.Parameters);
          var rowCount = allEnvVars.length;
          setButtonActive("v-pills-system");
          displayResultTable(allEnvVars, "#tableresults", buildEnvVarsResultTable,"envvars", "Environment Vars");
          break;
        }
        case allCommands[13]:{
          setResultMsg(response.Parameters);
          toggleResultAlert(true);
          var result = JSON.parse(response.Parameters);
          if (result.doesExist){
            var params = document.querySelector("#procParams").value;
            var qsproc = new QSProc(result.procFile,params);
            addProcessToList(qsproc);
            allLocalProcs.push(qsproc);
            saveQSProcsToLocalStorage();
            // --> We will start process later --> startProcess(result.procFile);
          }
          break;
        }
        case allCommands[14]:{
          var result = JSON.parse(response.Parameters);
          // -1 indicates that process couldn't be started
          if (result.procId == -1){
            setResultMsg("Couldn't start that process.");
            toggleResultAlert(true);
            return;
          }
          // alert(`Started the new process. pid:  ${result.procId}`);
          break;
        }
        case allCommands[15]:{
          var allNewProcs = JSON.parse(response.Parameters);
          
          if (allNewProcs.length == 0){
            document.querySelector("#resultInfo").textContent = "There were no new processes found.";
            document.querySelector("#resultInfo").style.backgroundColor = "yellow";
          }
          setButtonActive("v-pills-system");
          displayResultTable(allNewProcs, "#tableresults", buildNewProcsTable,"newProcs","New Processes (not seen before)");
          break;
        }
        default:{
            setResultMsg(response.Parameters);
            toggleResultAlert(true);
            break;
        }
      }
    });
  }

  function initLocalProcs(){
    allLocalProcs = JSON.parse(localStorage.getItem(`allProcs`));
    // if there are no procs in localStorage it will be null
    if (allLocalProcs == null){allLocalProcs = []; return;}
    procButtonCount = 0; //allLocalProcs.length;// ? allLocalProcs.length : 0;
    document.querySelector("#procButtonList").innerHTML = "";
    allLocalProcs.forEach(p => {
      addProcessToList(new QSProc(p.ExePath,p.Params));
    });
  }

  function saveQSProcsToLocalStorage(){
    localStorage.setItem("allProcs", JSON.stringify(allLocalProcs));
  }
  
  function addProcessToList(qsproc){
      var newButton = document.createElement("button");
      newButton.textContent = qsproc.ExePath;
      newButton.setAttribute(`id`,`proc-${++procButtonCount}`);
      newButton.setAttribute(`onclick`,"setActiveState(this)");
      newButton.setAttribute(`onmouseover`,"captureProcDetails(this)");
      newButton.setAttribute(`type`,"button");
      newButton.setAttribute(`class`,"procBtnGroup list-group-item list-group-item-action");
      newButton.setAttribute('data-bs-toggle',"tooltip");
      newButton.setAttribute('data-bs-placement',"top");
      newButton.setAttribute('data-bs-title',`params: ${qsproc.Params}`);
      document.querySelector("#procButtonList").prepend(newButton);
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
      const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  }

  function captureProcDetails(e){
    currentProcess.exePath = document.querySelector(`#${e.id}`).textContent;
    // The params are set on the data-bs-title attribute of the 
    // proc button, but we don't want the first 9 (idx 8) chars
    // because that's just the "header" text
    currentProcess.params = document.querySelector(`#${e.id}`).getAttribute('data-bs-title').substring(8);
  }

  function setButtonActive(idForActive){
    Array.from(document.querySelectorAll(".nav-link")).map( tabPanels => tabPanels.classList.remove("active"));
    Array.from(document.querySelectorAll(".nav-link")).map( tabPanels => tabPanels.classList.remove("show"));
    Array.from(document.querySelectorAll(".tab-pane")).map( tabPanels => tabPanels.classList.remove("active"));
    Array.from(document.querySelectorAll(".tab-pane")).map( tabPanels => tabPanels.classList.remove("show"));
    document.querySelector(`#${idForActive}`).classList.add('show');
    document.querySelector(`#${idForActive}`).classList.add('active');
    document.querySelector(`#${idForActive}-tab`).classList.add('active');
    
  }

  function displayProcDetails(allParams){
    document.querySelector("#pname").innerHTML = `<strong>Name</strong>: ${allParams[0]}`;
    document.querySelector("#pid").innerHTML = `<strong>PID</strong>: ${allParams[1]}`;
    document.querySelector("#pfile").innerHTML = `<strong>Exe File</strong>: ${allParams[2]}`;
    document.querySelector("#pfiledate").innerHTML = `<strong>Exe File Date</strong>: ${allParams[3]}`;
    document.querySelector("#psize").innerHTML = `<strong>Exe File Size</strong>: ${parseInt(allParams[4]).toLocaleString("en")}`;
    document.querySelector("#pworkingset").innerHTML = `<strong>RAM</strong>: ${parseInt(allParams[5]).toLocaleString("en")} bytes used.`;
    document.querySelector("#phash").innerHTML = `<strong>SHA256 (exe file)</strong>: ${allParams[6]}`;
    
  }

  function clearResultInfo(){
    // This item needs to be cleared when user traverses to another tab, 
    // because we don't want non-related messages to be shown to user.
    document.querySelector("#resultInfo").textContent = "";
    toggleResultAlert(false);
  }

  function setResultMsg(msg){
    document.querySelector("#resultMsg").textContent = msg;
  }

  function toggleResultAlert(shouldShow){
    if (shouldShow){
      document.querySelector("#resultAlert").classList.add("k-show");
      document.querySelector("#resultAlert").classList.remove("k-hidden");
    }
    else{
      document.querySelector("#resultAlert").classList.add("k-hidden");
      document.querySelector("#resultAlert").classList.remove("k-show");

    }
  }

  Date.prototype.yyyymmdd = function(isDash=true) {
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    if (isDash){
      return [this.getFullYear() + "-", mm.length===2 ? '' : '0', mm + "-", dd.length===2 ? '' : '0', dd].join(''); // padding
    }
    else{
      return [this.getFullYear() + "/", mm.length===2 ? '' : '0', mm + "/", dd.length===2 ? '' : '0', dd].join(''); // padding
    }
  };