var base ="https://developers.zomato.com/api/v2.1/";
var apikey = "bd0694624e4a9df3fd6a90ce7addc33a";
let latitude="",longitude="",jsonObject1="",jsonObject2="",cityId="",count=-1,j=0;
var restaurentList = new Array();
var search = document.querySelector(".searchbox");
search.addEventListener("keypress",restaurentsOnlocation)

var prevButton=document.querySelector(".pr");
prevButton.addEventListener("click",displayPrevResult)

var nextButton=document.querySelector(".ne");
nextButton.addEventListener("click",displayNextResult)

var text1 = document.querySelector(".wait");
var resultText1=document.querySelector(".re");
var resultText2=document.querySelector(".restaurants-info");
var newText=document.querySelector(".Text-Text");
prevButton.disabled=true;
nextButton.disabled=true;
currentlocation()

function currentlocation(){
    search.disabled = true;
    if(navigator.geolocation){
        
        navigator.geolocation.getCurrentPosition(setPosition);
    }
}

function setPosition(position){
    latitude = (position.coords.latitude).toFixed(2);
    longitude = (position.coords.longitude).toFixed(2);
    currentLocation(longitude,latitude);
}

function currentLocation(longitude,latitude)
{
var apiLocId=`${base}cities?&lat=${latitude}&lon=${longitude}&apikey=${apikey}`;
var xhReq = new XMLHttpRequest();
xhReq.open("GET", `${apiLocId}`, false);
xhReq.send(null);
jsonObject1 = JSON.parse(xhReq.responseText);
cityId = jsonObject1["location_suggestions"][0]["id"];
search.disabled = false;
}

function restaurentsOnlocation(evt){
    if (evt.keyCode == 13){
        
        newText.setAttribute("style","backdrop-filter: blur(10px);border:1px rgba(255, 255, 255, 0.4) solid;background-color:hsla(0,0%,100%,0.1);");
        
        console.log(search.value);
    j=-1;
    var item = search.value;
    var apiRestau=`${base}search?entity_id=${cityId}&entity_type=city&q=${item}&apikey=${apikey}`;
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", `${apiRestau}`, false);
    xhReq.send();
    jsonObject2 = JSON.parse(xhReq.responseText);
    loadResults(jsonObject2);
    }
}
function loadResults(){
    clearList();
    count--;
    nextButton.disabled=true;
    count = jsonObject2["restaurants"]["length"];
    for(var i=0;i<count;i++){
        var list=new Array(); 
        list.push(jsonObject2["restaurants"][i]["restaurant"]["user_rating"]["aggregate_rating"]);
        list.push(jsonObject2["restaurants"][i]["restaurant"]["name"]);
        list.push(jsonObject2["restaurants"][i]["restaurant"]["order_url"]);
        list.push(jsonObject2["restaurants"][i]["restaurant"]["average_cost_for_two"]);
        restaurentList.push(list);
    }
    restaurentList.sort();
    restaurentList.reverse();
    if(count==0){
        resultText2.innerText="Oops!!No such cuisines is available near you."
        resultText1.innerText="";
        
    }
    else{
    displayNextResult();
    }
}

function clearList(){
    while (count>0) {
        restaurentList.pop();
        count--;
      }
}

 function displayNextResult(){
     j++;
     if(j==count-1){ 
        nextButton.disabled=true;
        nextButton.style.cursor="not-allowed";

     }
     else{       
        nextButton.disabled=false;
        nextButton.style.cursor="pointer";
     }
     if(j>0){
         prevButton.disabled=false;
         prevButton.style.cursor="pointer";

     }
     else{
         prevButton.disabled=true;
         prevButton.style.cursor="not-allowed";

     }
     resultText1.innerText=`${restaurentList[j][1]}`;
     if(`${restaurentList[j][2]}`!='undefined'){
     resultText1.href=`${restaurentList[j][2]}`;}
     resultText2.innerHTML=`Rating: ${restaurentList[j][0]},     Average cost for two: ${restaurentList[j][3]}`;
 }

 function displayPrevResult(){
    j--;   
    if(j==count-1){ 
        nextButton.disabled=true;
        nextButton.style.cursor="not-allowed";

     }
     else{       
        nextButton.disabled=false;
        nextButton.style.cursor="pointer";
     }
     if(j>0){
         prevButton.disabled=false;
         prevButton.style.cursor="pointer";

     }
     else{
         prevButton.disabled=true;
         prevButton.style.cursor="not-allowed";

     }
    resultText1.innerText=`${restaurentList[j][1]}`;
    resultText1.href=`${restaurentList[j][2]}`;
    resultText2.innerHTML=`Rating: ${restaurentList[j][0]},     Average cost for two: ${restaurentList[j][3]}`
}
