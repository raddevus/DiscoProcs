let mousePos = {};
let isContextMenuDisplayed = false;

document.addEventListener("mousemove",onMouseMove,false);
document.addEventListener("click", bodyClickHandler,false);

document.querySelector("#procList").addEventListener('contextmenu', e => {
    if (e.shiftKey == false) {
      e.preventDefault();
      drawContextMenu("procListMenu",140);
    }
});

document.querySelector("#procButtonList").addEventListener('contextmenu', e => {
  if (e.shiftKey == false) {
    e.preventDefault();
    drawContextMenu("procButtonMenu",80);
  }
});

function onMouseMove(e)
{
  mousePos = { x: e.clientX, y: e.clientY };
}


function drawContextMenu(menuClass,height)
{
  isContextMenuDisplayed = true;
  console.log('drawContextMenu : ' + new Date())
  document.querySelector(`.${menuClass}`).style.visibility = "visible";
  document.querySelector(`.${menuClass}`).style.display = "block";
  document.querySelector(`.${menuClass}`).style.top = `${mousePos.y + window.scrollY}px`;
  document.querySelector(`.${menuClass}`).style.left = mousePos.x + "px";
  document.querySelector(`.${menuClass}`).setAttribute('height',`${height}px`);
}

function onContextMenuClick(e)
{
  console.log("onContextMenuClick()");
  hideContextMenu();
  
  console.log(e.id);
  switch (e.id)
  {
    case 'save_procs':
      {
        // Allows user to save selected procs
        saveSelectedProcs();
        break;
      }
    case 'kill_process':
      {
        killProcess();
        break;
      }
    case 'get_proc_info_byName':
      {
        clearResultInfo();
        getProcInfoByName();
        break;
      }
    case 'find_proc_by_name':
      {
        searchProcList();     
        break;
      }
    case 'start_process':{
      startProcess(`${currentProcess.exePath},${currentProcess.params}`);
      break;
    }
    case 'get_proc_modules':{
      getProcessModules();
      break;
    }
    case 'remove_process':{

      break;
    }
  }
}

function searchProcList(){
  // next line unselects all selected items
  document.querySelector("#procList").selectedIndex = -1;
  var allItems = Array.from(document.querySelector("#procList").options);
  let searchText = prompt("Please enter name of proc you're trying to find");
  
  var foundCount = 0;
  var optionItem = null;
  if (searchText != null){
    allItems.find((s) => {
      if (s.textContent.toUpperCase().search(searchText.toUpperCase()) >= 0){
        s.selected = true;
        ++foundCount;
        if (foundCount == 1){
          optionItem = s;
        }
      }
    })
    if (foundCount >= 1){
      // this means we found at least one and
      // we want to scroll that first one into view.
      if (optionItem){
        optionItem.scrollIntoView();
      }
    }
  }
}

function bodyClickHandler()
{
  console.log("bodyClickHandler");
  hideContextMenu();
}

function hideContextMenu()
{
  if (isContextMenuDisplayed) {
      var allMenus = Array.from(document.querySelectorAll(".RADcontextMenu"));
      allMenus.forEach(menu => {
        menu.style.visibility = "hidden";
        menu.style.display = "none";
      });
      isContextMenuDisplayed = false;
    }
}