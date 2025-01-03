
let today = new Date();
let allLocalProcs = [];
let currentProcess = {};
initMessageHandler();
// read all the local procs from localStorage
let procButtonCount;
initLocalProcs();


document.querySelector("#specFoldersBtn").addEventListener("click", () => {
  getSpecialFolders();
});

document.querySelector("#envVarsBtn").addEventListener("click", () => {
  getEnvironmentVars();
});

document.querySelector("#v-pills-main-tab").addEventListener("click", () => {
  scrollSelectedItemIntoView();
});

let selector = document.querySelector("#procList");
 selector.addEventListener("click", () => {
   getProcDetails();
 });

selector.addEventListener("change", () => {
  getProcDetails();
});

let startAllBtn = document.querySelector("#startAllBtn");
startAllBtn.addEventListener("click", () => {
    startAllProcesses();
});

document.querySelector("#saveProcPathBtn").addEventListener("click", () =>
  {
    addNewProc();
  }
);

function setActiveState(htmlEl){
  Array.from(document.querySelectorAll(".procBtnGroup")).map( btnGroup => {btnGroup.classList.remove("active");  btnGroup.classList.remove("current");});
  htmlEl.classList.add("active");
  htmlEl.setAttribute("aria-current","current");
}

function addNewProc(){
  let procPath = document.querySelector("#procPath").value;
  if (procPath == ""){
    alert("Please add a path to a process & try again.");
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
    "startProcess"];

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
    message.Parameters = document.querySelector("#procList").value;
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getProcFileName(){
    let message = {}; // create basic object
    message.Command = "getProcFileName";
    message.Parameters = document.querySelector("#procList").value;
    alert(`id: ${message.Parameters}`);
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
    alert (s);
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
          alert(`current directory is: ${response.Parameters}`);
          break;
        }
        case allCommands[1]:{

            dirSeparator = `${response.Parameters}`;
            alert(`dirSeparator ${dirSeparator}`);
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
          return;
          var allProcs = response.Parameters.split(",");
          allProcs.forEach (p => {
            var pDetails = p.split(":");

            var localOption = new Option(`${pDetails[0]}               ${pDetails[1]}`, pDetails[0], false, true);
		        document.querySelector('#procList').append(localOption);
		        //$("#procNames").val("");
          });
          
          break;
        }
        case allCommands[5]:{
          var procFileName = `${response.Parameters}`;
          alert(`filename : ${procFileName}`);
          
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
            alert("Successfully saved snapshot.");
            return;
          }
          alert("Couldn't save.");
          break;
        }
        case allCommands[8]:{
          var result = response.Parameters.split(",")[0].toLowerCase();
          if (result == "true"){
            alert("Successfully saved selected procs.");
            return;
          }
          alert("Couldn't save.");
            break;
          }
        case allCommands[9]:{
          var allSnapshotRows = JSON.parse(response.Parameters);
          var rowCount = allSnapshotRows.length;
          setButtonActive("v-pills-system");
          displayResultTable(allSnapshotRows, "#tableresults", buildProcResultTable,"history");
          break;
        }
        case allCommands[10]:{
          
          var result = response.Parameters.split(",")[0].toLowerCase();
          if (result == "true"){
            alert("Successfully killed proc.");
          }
          else{
            alert("Could not kill the proc.");
          }
          break;
        }
        case allCommands[11]:{
          var allSpecFolders = JSON.parse(response.Parameters);
          console.log(response.Parameters);
          var rowCount = allSpecFolders.length;
          setButtonActive("v-pills-system");
          displayResultTable(allSpecFolders, "#tableresults", buildSpecFoldersResultTable,"specialFolders");
          break;
        }
        case allCommands[12]:{
          var allEnvVars = JSON.parse(response.Parameters);
          console.log(response.Parameters);
          var rowCount = allEnvVars.length;
          setButtonActive("v-pills-system");
          displayResultTable(allEnvVars, "#tableresults", buildEnvVarsResultTable,"envvars");
          break;
        }
        case allCommands[13]:{
          alert(response.Parameters);
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
            alert("Couldn't start that process.");
            return;
          }
          // alert(`Started the new process. pid:  ${result.procId}`);
          break;
        }
        default:{
            alert(response.Parameters);
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