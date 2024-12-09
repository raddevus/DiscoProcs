initMessageHandler();
addEventListener("load", getCurrentDir());

function sendMessage(sMessage){
    console.log(sMessage);
    window.external.sendMessage(sMessage);
}

function getCurrentDir(){
    let message = {}; 
    message.Command = "getCurrentDirectory";
    message.Parameters = "";
    let sMessage = JSON.stringify(message);
    sendMessage(sMessage);
  }

  function getProcInfoByName(procName){
    let message = {};
    message.Command = "getProcInfoByName";
    //var procName = document.querySelector("#procList").selectedOptions[0].textContent;
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

function initMessageHandler(){
    window.external.receiveMessage(response => {
        response = JSON.parse(response);
        switch (response.Command){
            case "getCurrentDirectory":{
                var currentDir = response.Parameters;
                
               document.querySelector("#result1").innerHTML = currentDir;
            break;
            }
            case "getProcInfoByName":{
                console.log(response.Parameters);
                var allSnapshotRows = JSON.parse(response.Parameters);
                var rowCount = allSnapshotRows.length;
                if (rowCount >0){
                    document.querySelector("#result1").innerHTML = `rowCount: ${rowCount} : ${allSnapshotRows[rowCount-1].Filename}`;
                }
                break;
            }
        }
    })
}