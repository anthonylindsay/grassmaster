/*
 * JavaScript file
 */

var $homeScreen;
var $coverScreen;
var $fieldsScreen;
var $graphsScreen;
var $reportsScreen;
var $editFieldScreen;
var $newFieldScreen;
var $newCoverScreen;
var $settingsScreen;
var $loadSaveScreen;
var fieldData;
var saveNamesArray;

function init() {
  // Set up the data structure
  fieldData=new Array();
  var fieldDataItem =eval({"id":"0","area":"0","cover":"0","date":"01/01/11","name":"test"});
  fieldData[0]=fieldDataItem;

  saveNamesArray=new Array('save1','save2','save3','save4','save5');

  // set up the data storage
  if ((typeof localStorage.getItem('data') == undefined) || (localStorage.getItem('data') == null)) {
    localStorage.setItem('data', '');
    storeData(fieldData);
  }

  // Settings storage: there's only 2 settings. 1) do you want names or numbers and 2) the target cover.
  if ((typeof localStorage.getItem('settings') == undefined) || (localStorage.getItem('settings') == null)) {
    localStorage.setItem('settings', '0,1100');
  }

  // Set up save slots. 1 preferenceForKey per save slot
  if ((typeof localStorage.getItem('save1') == undefined) || (localStorage.getItem('save1') == null)) {
    localStorage.setItem('save1', '');
  }
  if ((typeof localStorage.getItem('save2') == undefined) || (localStorage.getItem('save2') == null)) {
    localStorage.setItem('save2', '');
  }
  if ((typeof localStorage.getItem('save3') == undefined) || (localStorage.getItem('save3') == null)) {
    localStorage.setItem('save3', '');
  }
  if ((typeof localStorage.getItem('save4') == undefined) || (localStorage.getItem('save4') == null)) {
    localStorage.setItem('save4', '');
  }
  if ((typeof localStorage.getItem('save5') == undefined) || (localStorage.getItem('save5') == null)) {
    localStorage.setItem('save5', '');
  }
  if ((typeof localStorage.getItem('saveList') == undefined) || (localStorage.getItem('saveList') == null) || (localStorage.getItem('saveList') == '')) {
    localStorage.setItem('saveList', 'save1,save2,save3,save4,save5');
  }
  // Find all the major screens and set them as variables

  $homeScreen = $("#home-screen");
  $coverScreen = $("#cover-screen");
  $fieldsScreen = $("#fields-screen");
  $graphsScreen = $("#graphs-screen");
  $reportsScreen = $("#reports-screen");
  $editFieldScreen = $("#edit-field-screen");
  $newFieldScreen = $("#new-field-screen");
  $newCoverScreen = $("#new-cover-screen");
  $settingsScreen = $("#settings-screen");
  $loadSaveScreen = $("#load-save-screen");
  $menu = $(".menu-item");

  // Make the menu work - click handlers & toggle functions
  $("#masthead").click(function(e) {
    initialise();
    $menu.hide();
    $("#info-screen").toggle();
    $("#name-setting").val(parseSettings("name"));
    $("#grass-target").val(parseSettings("target"));
  });

  $("#fields-menu-item").click(function(e) {
    initialise();
    $menu.hide();
    $fieldsScreen.toggle();
    listFields();
  });
  $("#cover-menu-item").click(function(e) {
    initialise();
    $menu.hide();
    $coverScreen.toggle();
    listCover();
  });
  $("#graphs-menu-item").click(function(e) {
    initialise();
    $menu.hide();
    $graphsScreen.toggle();
    doGraphs();
  });

  $("#reports-menu-item").click(function(e) {
    initialise();
    $menu.hide();
    $reportsScreen.toggle();
    doCalculations();
  });
  $("#settings-menu-item").click(function(e) {
    initialise();
    $menu.hide();
    $settingsScreen.toggle();
    doSettings();
  });
  $("#reset-menu-item").click(function(e) {
    initialise();
    if (confirm("do you really want to reset the application and delete all its data?")) {
      fieldData=new Array();
      fieldDataItem = eval({
        "id": "0",
        "area": "0",
        "cover": "0",
        "date": "01/01/11"
      });
      fieldData[0] = fieldDataItem;
      localStorage.setItem('data', '');
      storeData(fieldData);
      localStorage.setItem('save1', '');
      localStorage.setItem('save2', '');
      localStorage.setItem('save3', '');
      localStorage.setItem('save4', '');
      localStorage.setItem('save5', '');
      localStorage.setItem('saveList', 'save1,save2,save3,save4,save5');
      localStorage.setItem('settings', '0,1100')
    }
  });

  $("#enter-new-field-button").click(function(e) {
    $newFieldScreen.toggle();
    $fieldsScreen.toggle();
    $homeScreen.toggle();

    $("#new-field-id").html(getNextID);
    $("#new-field-form-area").val('');

    if (nameIsOn() == 1) {
      $("#field-name-option").html("name: <input type='text' id='new-field-form-name' />");
    }
    else {
      $("#field-name-option").html("");
    }
  });

  $("#enter-new-cover-button").click(function(e) {
    $newCoverScreen.toggle();
    $fieldsScreen.toggle();
    $homeScreen.toggle();
  });

  $("#new-field-save-button").click(function(e) {
    saveField();
  });

  $("#new-cover-save-button").click(function(e) {
    saveCover();
  });
  $(".cancel").click(function(e) {
		initialise();
  });

  $("#edit-field-save-button").click(function(e) {
    var i = $("#edit-field-id").html();
    var a = $("#edit-field-form-area").val();
    var n = $("#edit-field-name-option").val();
    saveFieldEdit(i,a,n);
  });

  $("#edit-field-delete-button").click(function(e) {
    var i = $("#edit-field-id").html();
    deleteField(i);
  });

  $("#cover-save-button").click(function(e) {
    var i = $("#new-cover-field-id").html();
    var a = $("#cover-form-cover").val();
    if (!isNaN(a)) {
			saveCover(i,a);
		}
    else {
			alert("Invalid Input. Numbers only please!");
    	initialise();
		}
  });

  $("#settings-save-button").click(function(e) {
    saveSettings();
    initialise();
  });

	// Load/save data
  $("#load-save-menu-item").click(function(e) {
    initialise();
    $menu.hide();
    $loadSaveScreen.toggle();
    doLoadSave();
  });

	$("#save-data-button").click(function(e) {
    saveData($("#save-slot").val());
  });

	$("#load-data-button").click(function(e){
    loadData($("#save-slot").val());
  });


  // Set up click handling for dynamic listings
  $("#fields-screen .edit-button").live("click",function(e) {
    editField($(this).attr('title'));
  });

  // Set up click handling for dynamic listings
  $("#cover-screen .edit-button").live("click",function(e) {
    editCover($(this).attr('title'));
  });

  // Close a screen
  $("h2").click(function(e) {
    initialise();
  });

  initialise();
}

// Write the fields data array to storage
function storeData(data) {
  var success=0;
  var d=JSON.stringify(data);
  try {
	  localStorage.setItem('data', d);
	}
	catch (e) {
	  alert("error writing to storage. "+e);
	}
}

// Read the fields data array from storage
function readData(){
  var d = eval(localStorage.getItem('data'));

  fieldData = d;

}

// Parse settings to see if you want field names and what the target cover is
function parseSettings(setting){
  var settingsString = localStorage.getItem('settings');
  if (setting == "name") {
		return settingsString.substring(0,1);
	}
  else {
		return settingsString.substring(2,settingsString.length);
	}
}

function initialise() {
  // Set up - hide everything but the menu
  $menu.show();
  $coverScreen.hide();
  $fieldsScreen.hide();
  $graphsScreen.hide();
  $reportsScreen.hide();
  $newFieldScreen.hide();
  $newCoverScreen.hide();
  $editFieldScreen.hide();
  $settingsScreen.hide();
  $loadSaveScreen.hide();
  $("#info-screen").hide();
  $homeScreen.show();

}

// Find the biggest ID in the data store and the return the next one (increment).
function getNextID(){
  var nextID = 0;
  // Find the largest ID and add one.
  for (var i = 0; i < fieldData.length; i++) {
    var tempID = fieldData[i].id;
    if (tempID > nextID) {
			nextID = tempID;
		}
  }
  nextID++;
  return nextID;
}

function nameIsOn(){
  return parseSettings("name");
}

function saveField(){
  readData();
  var newFieldArea=$("#new-field-form-area").val();
  var newFieldName=$("#new-field-form-name").val();
  if (!isNaN(newFieldArea)) {
    var noOfFields = fieldData.length;
    var nextID = getNextID();
    var newFieldItem = dataItem(nextID, newFieldArea, 0,newFieldName);
    fieldData[noOfFields] = newFieldItem;
    storeData(fieldData);
    initialise();
  }
  else {
    alert("Invlid input. Numbers only please!");
    initialise();
  }
}

function dataItem(id,area,cover,name){
  var n = new Date();
  var now = n.getDate()+"/"+(n.getMonth())+"/"+n.getFullYear();
  var d = eval({"id":id,"area":area,"cover":cover,"date":now,"name":name});

  return d;
}

// Fix the month on a date for display.
function fixDate(d){

  var dd = d.substring(0,d.indexOf('/')+1);
  var dm = d.substring(d.indexOf('/')+1,d.length);
  var dy = dm.substring(dm.indexOf('/'),dm.length);
  dm = dm.substring(0,dm.indexOf('/'));
  dm = parseInt(dm);
  dm++;


  var returnString=dd+dm+dy;
  return returnString;
}

// Edit a field to enter new cover
function editCover(field){
  readData();
  var thisDate;
  var thisCover;
  var thisArea;
  var thisFieldName;
  $("#new-cover-field-id").html(field);
  for (var i = 1; i < fieldData.length; i++) {
    if (fieldData[i].id == field) {
      thisFieldName=fieldData[i].name;
      thisArea = fieldData[i].area;
      thisCover = fieldData[i].cover;
      thisDate = fieldData[i].date;
      thisDate = fixDate(thisDate);
    }
  }
  if (nameIsOn() == 1) {
		$("#new-cover-field-name-option").html("name:"+thisFieldName);
	}
  $("#new-cover-field-cover").html(thisCover);
  $("#new-cover-field-area").html(thisArea);
  $("#new-cover-field-date").html(thisDate);

  storeData(fieldData);
  $("#cover-form-cover").val('');
  $("#new-cover-screen").toggle();
  $coverScreen.toggle();
  $homeScreen.toggle();
}

// Save new cover to data storage
function saveCover(id,value) {
  readData();
  for (var i=1;i<fieldData.length;i++) {
    if (fieldData[i].id == id) {
      fieldData[id].cover = value;
      fieldData[id].date = now();
    }
  }
  storeData(fieldData);
  $("#new-cover-screen").hide();
  $coverScreen.toggle();
  $homeScreen.toggle();
  listCover();
}

//****************************
// Need dynamic cover listings
//****************************

function listCover(){
  readData();
  var coverHTML='';
  $("#cover-items tbody").html(coverHTML);
  for (var i = 1; i<fieldData.length; i++){
    coverHTML += '<tr><td class="id">' + fieldData[i].id + '</td><td class="area">' + fieldData[i].area + 'ha</td><td class="cover">' + fieldData[i].cover + '</td><td class="edit-button" title="' + fieldData[i].id + '"></td></tr>';
  }
  $("#cover-items tbody").html(coverHTML);

}



// Read from persistant storage to data structure and list fields
function listFields() {
  readData();
  if (nameIsOn() == 1) {
		$("#field-listing-table-header").html("<th></th><th>field</th><th>area</th><th></th>");
	}
  else {
		$("#field-listing-table-header").html("<th>field</th><th>area</th><th></th>");
	}
  var fieldHTML='';
  $("#fields-items tbody").html(fieldHTML);
  for (var i=1;i<fieldData.length;i++) {
    fieldHTML+='<tr><td class="id">' + fieldData[i].id;
    if (nameIsOn() == 1) fieldHTML += '</td><td class="field-name">' + fieldData[i].name;
    fieldHTML += '</td><td class="area">' + fieldData[i].area + 'ha</td><td class="edit-button" title="' + fieldData[i].id + '"></td></tr>';
  }
  $("#fields-items tbody").html(fieldHTML);
  storeData(fieldData);
}



// Edit existing fields from dynamic listings
function editField(id){
  $("#edit-field-id").html(id);
  var thisFieldName;
  var thisFieldArea;
    for (var i = 1; i < fieldData.length; i++) {

      if (fieldData[i].id == id) {

        thisFieldName = fieldData[i].name;
        thisFieldArea = fieldData[i].area;
      }
    }

  if (nameIsOn() == 1) {
    $("#edit-field-name-option").val(thisFieldName);
    $("#edit-field-name-option").show();
    $("#edit-field-name-option").parent().show();
  }
  else $("#edit-field-name-option").parent().hide();
  $("#edit-field-form-area").val(thisFieldArea);
  $("#edit-field-screen").toggle();
  $fieldsScreen.toggle();
  $homeScreen.toggle();


}

function saveFieldEdit(id,value,nameValue){

  if (!isNaN(value)) {
    readData();
    for (var i = 0; i < fieldData.length; i++) {
      if (fieldData[i].id == id)
        fieldData[id].area = value;
        fieldData[id].name = nameValue;

    }
  //  alert(id+" "+fieldData[id].area+" "+fieldData[id].name);
    storeData(fieldData);
    $("#edit-field-screen").toggle();
    $fieldsScreen.toggle();
    $homeScreen.toggle();
    listFields();
  }
  else {
    alert("Invalid input. Numbers only please!");
    initialise();
  }
}

function deleteField(id){
  readData();
  var msg="are you sure you want to delete this field?";
  if (confirm(msg)){
    var tempArray = new Array();
    var j = 0;
    for(var i = 0; i<fieldData.length; i++){

      if (fieldData[i].id != id) {
        tempArray[j] = fieldData[i];
        j++;
      }
    }
    fieldData = tempArray;

  }
  storeData(fieldData);
  $("#edit-field-screen").toggle();
  $fieldsScreen.toggle();
  $homeScreen.toggle();
  listFields();
}

//returns the date today
function now(){
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth();
  var curr_year = d.getFullYear();
  var returnString=(curr_date + "/" + curr_month + "/" + curr_year);
  return returnString;
}

// perform calculations on cover and area
function doCalculations(){
  readData();
  var totalCover=0;
  var AFC=0;
  var cover_LU=0;
  var totalArea=0;
  var totalAreaAFC=0;

  for(var i = 1; i<fieldData.length; i++) {
    var s = parseFloat(fieldData[i].area);
    var c = parseFloat(fieldData[i].cover);
    var cp = s*c;
    totalCover += cp;
    totalArea += s;
    if (c > 0) {
			totalAreaAFC += s;
		}
  }
  AFC = Math.round(totalCover/totalAreaAFC);
  totalArea = Math.round(totalArea*10)/10;
  var calcs="";
  calcs="<p>total cover= " + totalCover + "</p><p>AFC= " + AFC + "</p><p>total area= " + totalArea + "</p>";
  $("#calculations").html(calcs);

  var coverHTML='';
  $("#cover-items tbody").html(coverHTML);
  for (var i = 1; i<fieldData.length; i++) {
    coverHTML+='<tr><td class="id">' + fieldData[i].id + '</td><td class="area">' + fieldData[i].area + 'ha</td><td class="cover">' + fieldData[i].cover + '</td><td class="date">' + fixDate(fieldData[i].date)+'</td><td>' + Math.round(fieldData[i].cover*fieldData[i].area) + '</td></tr>';
  }
  $("#fields-report table tbody").html(coverHTML);

}

/*****************************************
* multi dimensional sort
*****************************************/
function sortMultiDimensional(a,b) {
  // this sorts the array using the first element
  return ((a[1] > b[1]) ? -1 : ((a[1] < b[1]) ? 1 : 0));
}

function doGraphs() {
  $("#chart").html("");
  readData();
  var highestCP=0
  var graphData= new Array();
  var target=parseSettings("target");
  var increment=target/fieldData.length;


  var endpoint=0;
  for(var i=0;i<fieldData.length;i++) {

      var s = parseFloat(fieldData[i].area);
      var c = parseFloat(fieldData[i].cover);
      var cp = s * c;
      graphData[i] = new Array(i, cp, 0,0);

  }

  graphData.sort(sortMultiDimensional);
  highestCP=graphData[0][1];
  for (var j = 0; j<graphData.length; j++) {
    graphData[j][2]=Math.round(200*(graphData[j][1]/highestCP));
    graphData[j][3]=(target-(j*increment));
  }
    // here you need to get the largest CP and divide all other CPs by it, giving you fractions of the biggest one.
    // then you've got a Y axis set of coordinates.
    // then you can draw DIVs a set width and the variable height, floated left within a container.
  var graph="";

  for (var j = 0; j < graphData.length; j++) {
    if (graphData[j][0] != 0) {
      if (graphData[j][3]-graphData[j][1]>50) {
        graph += "<div class='graphBar' style='height:";
        graph += graphData[j][2] + "px;color:#ff0000;margin-top:-" + graphData[j][2] + "px'>" + graphData[j][0]+ "</div>";
      }
      else if (graphData[j][3]-graphData[j][1]<-50) {
        graph += "<div class='graphBar' style='height:";
        graph += graphData[j][2] + "px;color:#00ff00;;margin-top:-" + graphData[j][2] + "px'>" + graphData[j][0] + "</div>";
      }
      else {
        graph += "<div class='graphBar' style='height:";
    graph += graphData[j][2] + "px;color:#ffffff;margin-top:-" + graphData[j][2] + "px'>" + graphData[j][0] + "</div>";
      }
    }
  }

  endpoint=graphData.length;

  $("#graph-legend-value").html(highestCP);
  $("#chart").html(graph);
  var w = fieldData.length*39;
  $("#chart").css('width',w+'px');
}

// load up the saved values
function doSettings() {

  $("#name-setting").val(parseSettings("name"));
  $("#grass-target").val(parseSettings("target"));
}
// do Settings - save them

function saveSettings() {
  var nameOnOrOff = $("#name-setting").val();
  var targetCover = $("#grass-target").val();
  var settingsString = nameOnOrOff+","+targetCover;
  localStorage.setItem("settings", settingsString);
  initialise();
}

function doLoadSave(){
  // populate the select box with the names of the user defined save slots
  readSaveNames();
  var output = '';
  for (var i = 0; i < saveNamesArray.length; i++) {
    output+="<option value='" + (i + 1) + "'>" + saveNamesArray[i] + "</option>";
  }
  $("#save-slot").html(output);
}
function loadData(n){
  readSaveNames();
  var msg = "Do you want to load data from slot " + saveNamesArray[n-1] + "?";
  if (confirm(msg)) {
    var slot = "save" + n;
    alert("slot=" + slot);
    alert("saved data=" + localStorage.getItem(slot));
    var loadData = localStorage.getItem(slot);
    alert("data to be copied/loaded=" + loadData);
    loadData += "";
    localStorage.setItem("data", loadData);
    alert(localStorage.getItem("data"));
    alert("data loaded from " + slot);
    initialise();
    }
  }

function saveData(n){

  readSaveNames();
  var msg="Do you want to save your data to and overwrite slot "+saveNamesArray[n-1]+"?";
  if (confirm(msg)) {
    var saveName=prompt("Save As:", "");
    storeSaveName(n,saveName);
    var slot="save slot "+n;
    alert("Data saved in "+slot);
    initialise();
    }
  }

function readSaveNames() {
  var saveNames=localStorage.getItem("saveList");
  var commaCount=0;
  var currentWord="";

  for(var i=0;i<saveNamesArray.length;i++){

    commaCount=saveNames.indexOf(',',0);
    if (commaCount!=-1) {
			currentWord=saveNames.substr(0,commaCount);
		}
    else {
			currentWord=saveNames;
		}

    var s=saveNames.length;
    saveNames=saveNames.substr(commaCount+1,(s-commaCount));
    saveNamesArray[i]=currentWord;
  }


}

function storeSaveName(save,name) {
  readSaveNames();
  var position=parseInt(save);
  var name=name;
  for(var i=0; i<saveNamesArray.length; i++) {
    if(i+1==position)saveNamesArray[i]=name;
  }
  var output="";
  for(var i=0;i<saveNamesArray.length;i++) {
    output+=saveNamesArray[i];
    if(i!=4)output+=',';
  }
  localStorage.setItem('saveList', output);
}

/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
