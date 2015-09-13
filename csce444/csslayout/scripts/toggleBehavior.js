function toggleBackground() {
  console.log("hello world");
  if (document.getElementsByTagName("BODY")[0].style.backgroundImage != "none") {
    document.getElementsByTagName("BODY")[0].style.backgroundImage = "none";
    document.getElementsByTagName("BODY")[0].style.opacity = "1";    
  }
  else {
    document.getElementsByTagName("BODY")[0].style.backgroundImage = "url('css/webpage2.png')";
    document.getElementsByTagName("BODY")[0].style.opacity = ".7";    
  }
  
  
}
