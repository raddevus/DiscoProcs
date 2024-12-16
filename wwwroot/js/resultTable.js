function displayResultTable(dataRows, rootElement, targetFunc){
    console.log(`userTasks ${JSON.stringify(dataRows)}`);
    //initUserTaskTable();
    ReactDOM.render(
        // We are passing in just the tasks - not the outer object 
        // which includes the success property
        targetFunc (dataRows),
        document.querySelector(rootElement),
        hideWaitCursor("#history-spinner")
    );
}

const buildSpecFoldersResultTable = function(dataRows){

    console.log(dataRows[0]);
    
     let allItems = [];
     let currentId = 0;
    for (let x=0; x < dataRows.length;x++){
        console.log(`dataRows[${x}].FolderName: ${dataRows[x].FolderName}`);
        
        allItems.push( React.createElement("tr",{key:x, id:dataRows[x].id},
        
            React.createElement("td",{id:`foldername-${currentId}`}, dataRows[x].folderName),
            React.createElement("td",{id:`folderpath-${currentId}`}, dataRows[x].folderPath),
        )
       );
       currentId++;
    }
    return allItems;
}

const buildProcResultTable = function(dataRows){

    console.log(dataRows[0]);
    
     let allItems = [];

    for (let x=0; x < dataRows.length;x++){
        console.log(`dataRows[${x}].Name: ${dataRows[x].Name}`);
        let currentId = dataRows[x].id;
        allItems.push( React.createElement("tr",{key:x, id:dataRows[x].id},
        
        React.createElement("td",{id:`name-${currentId}`}, dataRows[x].Name),
        React.createElement("td",{id:`filename-${currentId}`}, dataRows[x].Filename),
        React.createElement("td",{id:`filedate-${currentId}`}, dataRows[x].FileDate),
        React.createElement("td",{id:`filehash-${currentId}`}, dataRows[x].FileHash),
        React.createElement("td",{id:`filesize-${currentId}`}, dataRows[x].FileSize),
        React.createElement("td",{id:`created-${currentId}`,width:"150px"},  dataRows[x].Created),
                
            )
       );
    }
    return allItems.reverse();
}

function hideWaitCursor(waitCursorId){
    document.querySelector(waitCursorId).classList.add("k-hidden");
}