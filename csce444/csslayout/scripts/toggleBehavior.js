var toggleSwitch = 1;
function toggleBackground() {
  if (document.getElementsByTagName("BODY")[0].style.backgroundImage =='') {
    console.log("HI");
    document.getElementsByTagName("BODY")[0].style.backgroundImage = "url('css/webpage2.png')";
    document.getElementsByTagName("BODY")[0].style.opacity = ".7";    
  }
  else {
    document.getElementsByTagName("BODY")[0].style.backgroundImage = "";
    document.getElementsByTagName("BODY")[0].style.opacity = "1";    
    toggleSwitch = 0;
  }
}
