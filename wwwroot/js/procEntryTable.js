function displayProcEntryTable(procEntries, rootElement){
    console.log(`userTasks ${JSON.stringify(procEntries)}`);
    //initUserTaskTable();
    ReactDOM.render(
        // We are passing in just the tasks - not the outer object 
        // which includes the success property
        ProcEntryTable (procEntries),
        document.querySelector(rootElement),
        hideWaitCursor("#history-spinner")
    );
}

const ProcEntryTable = function(procEntries){

    console.log(procEntries[0]);
    
     let allItems = [];

    for (let x=0; x < procEntries.length;x++){
        console.log(`procEntries[${x}].Name: ${procEntries[x].Name}`);
        let currentId = procEntries[x].id;
        allItems.push( React.createElement("tr",{key:x, id:procEntries[x].id},
        
        React.createElement("td",{id:`name-${currentId}`}, procEntries[x].Name),
        React.createElement("td",{id:`filename-${currentId}`}, procEntries[x].Filename),
        React.createElement("td",{id:`filedate-${currentId}`}, procEntries[x].FileDate),
        React.createElement("td",{id:`filehash-${currentId}`}, procEntries[x].FileHash),
        React.createElement("td",{id:`filesize-${currentId}`}, procEntries[x].FileSize),
        React.createElement("td",{id:`created-${currentId}`,width:"150px"},  procEntries[x].Created),
                
            )
       );
    }
    return allItems.reverse();
}

function hideWaitCursor(waitCursorId){
    document.querySelector(waitCursorId).classList.add("k-hidden");
}