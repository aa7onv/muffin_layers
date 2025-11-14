//GLOBALS
var conv = [-1,0,1,2,3];
var x1 = 3; //num of frames
var adjCount = 1;
var pickedColorGlobal = null

var read_me;

if (read_me == null){
    var read_me ="";
    }

(function(thisObj) {

    function build_UI(thisObj) {

        var myPanel = (thisObj instanceof Panel) ? (thisObj) : (new Window("palette", "muffin layers", undefined, {

            resizeable: true

        }));
        //===================== UI PANEL SIZE SETTINGS ============= \\
   
        myPanel.alignChildren = ["left", "top"];
        myPanel.margins = 5;
        myPanel.spacing = 4;
        myPanel.alignChildren = ["fill", "fill"];
        myPanel.orientation = "stack";


//===================== UI PANEL CREATE BUTTONS ============= \\
     // 1 = vertical  // 2 = horizontal
        var groupOne = myPanel.add("group",undefined, "groupOne");
        groupOne.alignChildren = ["fill", "fill"];  
        //groupOne.preferredSize.height = 25;
        groupOne.margins = 0;
        groupOne.spacing = 3;
        if (read_me == "developed by muffinmix :3"){
            var adj = groupOne.add("button",undefined,"ADJ");
            var nul= groupOne.add("button",undefined,"Null");
            var text = groupOne.add("button",undefined,"Text");
            var solid = groupOne.add("button",undefined,"Solid");
            var Mframes = groupOne.add("button",undefined,"ƒ");
            var dropDown = groupOne.add("dropdownlist",undefined,[1,2,3,4]);
            dropDown.selection = 2;
            //var text2shape = groupOne.add("button",undefined,"split"); 
            var rename = groupOne.add("button",undefined,"rename"); 

            var groupTwo = myPanel.add("group",undefined, "groupTwo");
            
            groupTwo.alignChildren = ["fill", "fill"];
            groupTwo.margins = 0;
            groupTwo.spacing = 3;
            //groupTwo.preferredSize.height = 25;
            groupTwo.maximumSize.height = 25;
            
            var adj2 = groupTwo.add("button",undefined,"ADJ");
            var nul2= groupTwo.add("button",undefined,"Null");
            var text2 = groupTwo.add("button",undefined,"Text");
            var solid2 = groupTwo.add("button",undefined,"Solid");
            var Mframes2 = groupTwo.add("button",undefined,"ƒ");
            var dropDown2 = groupTwo.add("dropdownlist",undefined,[1,2,3,4]);
            dropDown2.selection = 2;
            //var text2shape2 = groupTwo.add("button",undefined,"split"); 
            var rename2 = groupTwo.add("button",undefined,"rename"); 
               
                  //=================================== UI PANEL MAP LOGIC FUNCTIONS TO UI BUTTONS ================ \\
            dropDown.onChange = function(){
                x1 = dropDown.selection;
                }
            dropDown2.onChange = function(){
                x1 = dropDown2.selection;
                }
            
            adj.onClick = function(){

                createAdj(adjCount);
                adjCount+=1;
                }
           
            nul.onClick = function() {
                 createNull();
                }
            
            Mframes.onClick = function() {
                 if (app.project.activeItem.selectedLayers.length == 0){
                     alert("please select a layer");
                     }
                 else{
                    app.beginUndoGroup("New One Framers");
                    createOneFramerM(conv[x1]);
                    app.endUndoGroup();
                    }
                 }
            
            text.onClick = function() {
                createText();
                }

            rename.onClick = function() {
                 app.beginUndoGroup("Rename Layers");
                renameAdjustmentLayers()
               app.endUndoGroup();
                }
             rename2.onClick = function() {
                  app.beginUndoGroup("Rename Layers");
                renameAdjustmentLayers()
                app.endUndoGroup();
                }
            ///
            
             adj2.onClick = function(){        
                createAdj(adjCount);
                adjCount+=1;
                }
     
            nul2.onClick = function() {
                 createNull ();
                };
            //
            Mframes2.onClick = function() {
                 if (app.project.activeItem.selectedLayers.length == 0){
                     alert("please select a layer");
                     }
                 else{

                    app.beginUndoGroup("New One Framers");

                    createOneFramerM(conv[x1]);
                    app.endUndoGroup();

                    }
                 }
            
            text2.onClick = function() {
                createText();
                };

solid.onClick = function () {
    try {

        createSolid();

    } catch (e) {
        alert("Error in solid.onClick:\n" + e.toString() + 
              "\nLine: " + $.line + 
              "\nStack: " + $.stack);
    }
};

solid2.onClick = function () {
    try {
        //app.beginUndoGroup("New Solid Layer");
        createSolid();
        //app.endUndoGroup();
    } catch (e) {
        alert("Error in solid2.onClick:\n" + e.toString() + 
              "\nLine: " + $.line + 
              "\nStack: " + $.stack);
    }
};

    } //README closing bracket
                        //=================================== UI PANEL ================================ \\
        myPanel.onResizing = myPanel.onResize = function() {

            groupOne.orientation = (myPanel.size.width > myPanel.size.height) ? "row" : "column";

            groupTwo.orientation = (myPanel.size.width > myPanel.size.height) ? "row" : "column";

            if (myPanel.size.width > 25 && myPanel.size.width < myPanel.size.height) { //(myPanel.size.width > 250 && myPanel.size.width < myPanel.size.height

                groupTwo.visible = false;

                groupOne.visible = true;

            } else {

                groupOne.visible = false;

                groupTwo.visible = true;

            }

            myPanel.layout.resize();

        };

        if (myPanel instanceof Window) {

            myPanel.center();

            myPanel.show();

        } else {

            myPanel.layout.layout(true);

            myPanel.layout.resize();
        }

    
       //=================================== BEGIN FUNCTION LOGIC ================================ \\
function GoodBoyNinjaColorPicker(startValue){
    if(!startValue || startValue.length != 3){
      startValue = [1, 1, 1]; // default value
    }
  
    var comp = app.project.activeItem;
    if(!comp || !(comp instanceof CompItem)){
      alert("No comp is selected");
      return null;
    }
    //Store the layers which are selected
    var selectedLayers = []
    for (var i=1; i<=comp.numLayers; i++){
        if (comp.layer(i).selected) selectedLayers.push(i)
    }
  
    // add a temp null;
    var newNull = comp.layers.addNull();
    var newColorControl = newNull.property("ADBE Effect Parade").addProperty("ADBE Color Control");
    var theColorProp = newColorControl.property("ADBE Color Control-0001");
  
    // shy and turn eyeball off
    var origShyCondition = comp.hideShyLayers;
    if(origShyCondition == false) comp.hideShyLayers = true;
    newNull.shy = true;
    newNull.enabled = false;
  
    // set the value given by the function arguments
    theColorProp.setValue(startValue);
  
    // prepare to execute
    var editValueID = 2240
    theColorProp.selected = true;
    app.executeCommand(editValueID);
  
    // harvest the result
    var result = theColorProp.value;
  
    // remove the null
    if(newNull){
      newNull.remove();
    }
  
    // get shy condition back to original
    comp.hideShyLayers = origShyCondition;
  
    // restore Layer Selection
    for (var i=0; i<selectedLayers.length; i++){
      comp.layer(selectedLayers[i]).selected = true;
    }
    
    // if the user click cancel, the function will return the start value but as RGB. In that case, return null
    var startValueInRgb = [startValue[0], startValue[1], startValue[2]];
    return (result.toString() == startValueInRgb.toString()) ? null : result;
}

function minmax(array,b){ // if b = 1, find smallest num, if b = 0, find largest num
    var num = array[0];
    if (b){

        for (var i = 1; i < array.length; i++) {
          if (array[i] < num) {
            num = array[i];
          }
        }
    }
    else{

        for (var i = 1; i < array.length; i++) {
          if (array[i] > num) {
            num = array[i];
          }
        }
    }
  return num;
}

function createAdj(adjCount) {
    app.beginUndoGroup("New Adjustment Layer");
    var comp = app.project.activeItem;
    var selectedLayersArr= comp.selectedLayers;
    var numSelected = comp.selectedLayers.length;

    if (numSelected > 0) {
        
                var inPts = new Array();
                var outPts = new Array();
                var ind = new Array();
            
                //populate array on in/out pts
                for(var j = 0 ; j < numSelected; j++){
                    inPts.push(selectedLayersArr[j].inPoint);
                    outPts.push(selectedLayersArr[j].outPoint);
                    ind.push(selectedLayersArr[j].index);
                }
                    
                //if alt click
                if (ScriptUI.environment.keyboardState.altKey){

                var MIN = minmax(inPts,1);
                var MAX = minmax(outPts,0);
                var minin = minmax(ind,1);
                var firstInPoint = MIN;//del
                var lastOutPoint = MAX; //del
                
                var s = selectedLayersArr[0].name;
                if (s.substring (0, 8) == "adj for"){
                    s = selectedLayersArr[0].name.substring(9,17);
                }
                else{
                    s   = selectedLayersArr[0].name.substring(0,8);
                }
            
                  // Alt-click: Set the adjustment layer duration from the first inpoint to the last outpoint
                var adjLayer = comp.layers.addSolid([.2,.2,.2], "adj for "  + s, comp.width, comp.height, 1,1); // CREATES NEW ADJ      
                adjLayer.adjustmentLayer = true;
                adjLayer.inPoint = MIN;
                adjLayer.outPoint = MAX;
                targetlayer = comp.layer(minin+1);
                adjLayer.moveBefore(targetlayer);  
                } 

                else{
                    for(var i = 0 ; i < numSelected; i++){
                                    var s = selectedLayersArr[i].name;
                 
                        if (s.substring (0, 7) == "adj for"){
                            s = selectedLayersArr[i].name.substring(8,17);
                        }
                        else{
                            s = selectedLayersArr[i].name.substring(0,8);
                            }
                            var newSolid = comp.layers.addSolid([.2,.2,.2], "adj for " + s, comp.width, comp.height, 1, outPts[i]-inPts[i]); // CREATES NEW ADJ      
                            newSolid.adjustmentLayer = true;
                            newSolid.inPoint = inPts[i];
                            newSolid.moveBefore(selectedLayersArr[i]);
                    }
                }

    }

    // if no layer selected, build comp length
    else{ 
        var newSolid = comp.layers.addSolid([.2,.2,.2], "adj :3", comp.width, comp.height, 1, comp.workAreaDuration); // CREATES NEW ADJ 
        newSolid.adjustmentLayer = true;
        newSolid.inPoint = comp.workAreaStart;
  
    }
    app.endUndoGroup();
}

function createNull() {
    app.beginUndoGroup("New Null Layer");

    var comp = app.project.activeItem;
    var selectedLayers = comp.selectedLayers;
    var isAltDown = ScriptUI.environment.keyboardState.altKey;

    if (selectedLayers.length > 0) {
        // Step 1: Find earliest inPoint, latest outPoint, and lowest index
        var earliestIn = selectedLayers[0].inPoint;
        var latestOut = selectedLayers[0].outPoint;
        var highestIndex = selectedLayers[0].index;

        for (var i = 1; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            if (layer.inPoint < earliestIn) earliestIn = layer.inPoint;
            if (layer.outPoint > latestOut) latestOut = layer.outPoint;
            if (layer.index > highestIndex) highestIndex = layer.index;
        }

        var duration = latestOut - earliestIn;

        // Step 2: Create null with calculated duration
        var newNull = comp.layers.addNull(duration);
        newNull.inPoint = earliestIn;

        // Step 3: Move null to the top (visually) of selected layers
        newNull.moveBefore(comp.layer(highestIndex));

        // Step 4: Parent all selected layers to the new null
        for (var j = 0; j < selectedLayers.length; j++) {
            selectedLayers[j].parent = newNull;
        }

        // Step 5: Add keyframes if ALT is pressed
        if (isAltDown) {
            var inTime = newNull.inPoint;
            var outTime = newNull.outPoint;

            var positionProp = newNull.property("Transform").property("Position");
            var scaleProp = newNull.property("Transform").property("Scale");

            var currentPos = positionProp.value;
            var currentScale = scaleProp.value;

            positionProp.setValueAtTime(inTime, currentPos);
            positionProp.setValueAtTime(outTime, currentPos);

            scaleProp.setValueAtTime(inTime, currentScale);
            scaleProp.setValueAtTime(outTime, currentScale);
        }
    } else {
        // If nothing selected, use work area
        var newNull = comp.layers.addNull(comp.workAreaDuration);
        newNull.inPoint = comp.workAreaStart;

        // Add keyframes if ALT is pressed
        if (isAltDown) {
            var inTime = newNull.inPoint;
            var outTime = newNull.outPoint;

            var positionProp = newNull.property("Transform").property("Position");
            var scaleProp = newNull.property("Transform").property("Scale");

            var pos = positionProp.value;
            var scale = scaleProp.value;

            positionProp.setValueAtTime(inTime, pos);
            positionProp.setValueAtTime(outTime, pos);

            scaleProp.setValueAtTime(inTime, scale);
            scaleProp.setValueAtTime(outTime, scale);
        }
    }

    app.endUndoGroup();
}



function createSolid() {
    
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            throw new Error("No active composition found.");
        }

        var selectedLayersArr = comp.selectedLayers;
        var numSelected = selectedLayersArr.length;
        //=======================
         var color = [0, 0, 0]; //black
   
        // If ALT is held, open color picker
        if (ScriptUI.environment.keyboardState.altKey) {
            var pickedColor = GoodBoyNinjaColorPicker([1, 1, 1]);
            if (pickedColor !== null) {
                color = pickedColor;
            }
        }
        //=======================
        
        app.beginUndoGroup("New Solid Layer");

        var t1 = Math.round(color[0] * 255);
        var t2 = Math.round(color[1] * 255);
        var t3 = Math.round(color[2] * 255);
        var text = "[" + t1 + "," + t2 + "," + t3 + "]";
        var layerStr = (color.toString() !== "0,0,0" && color.toString() !== "1,1,1,1") ? "Solid " + text : "Solid Layer";

        var newSolid2;
        if (numSelected > 0) {
            var selectedLayer = selectedLayersArr[0];
                if (!selectedLayer || selectedLayer == null) {
        throw new Error("Selected layer is invalid or null.");
    }
            var duration = selectedLayer.outPoint - selectedLayer.inPoint;
            
            var newSolid2 = comp.layers.addSolid(
                color.splice (0,3),
                layerStr,
                comp.width,
                comp.height,
                1,
                duration
            );
            newSolid2.moveBefore(selectedLayer);
            newSolid2.inPoint = selectedLayer.inPoint;
        } else {
            var newSolid2 = comp.layers.addSolid(
                color.splice (0,3),
                layerStr,
                comp.width,
                comp.height,
                1,
                comp.workAreaDuration
            );
            newSolid2.inPoint = comp.workAreaStart;
        }
        app.endUndoGroup();
    } catch (e) {
    }
}


function createText() {
    app.beginUndoGroup("New Text Layer");
    var comp = app.project.activeItem;
    if (comp.selectedLayers.length > 0){
        
        var selectedLayer = comp.selectedLayers[0]
        var newText = comp.layers.addText(); // CREATES NEW TEXT
        newText.inPoint = selectedLayer.inPoint;
        newText.outPoint = selectedLayer.outPoint;

        newText.moveBefore(selectedLayer);

        }
    
    else{
        var newText = comp.layers.addText(); // CREATES NEW TEXT
        newText.inPoint = comp.workAreaStart;

        }
    
    app.endUndoGroup();
    }
    
function createOneFramerL(x) {
    app.beginUndoGroup("New One Framers");
    
    var comp = app.project.activeItem;
    var selectedLayer = comp.selectedLayers[0]
    var fps = comp.frameRate;
    
    for(var i = x; i>-1;i--){
        var newSolid = comp.layers.addSolid([.2,.2,.2], "Adjustment Layer", comp.width, comp.height, 1, 1/comp.frameRate); // CREATES NEW ADJ
        newSolid.adjustmentLayer = true;
        newSolid.moveBefore(selectedLayer);

        newSolid.inPoint = selectedLayer.inPoint + (i * (comp.frameDuration));
        }
    app.endUndoGroup();
    }
    
function createOneFramerR(x) {
    app.beginUndoGroup("New One Framers");
    
    var comp = app.project.activeItem;
    var selectedLayer = comp.selectedLayers[0];
    var fps = comp.frameRate;
    
   for(var i = 1; i<x;i++){
        var newSolid = comp.layers.addSolid([.2,.2,.2], "Adjustment Layer", comp.width, comp.height, 1, 1/comp.frameRate); // CREATES NEW ADJ
        newSolid.adjustmentLayer = true;
        newSolid.moveBefore(selectedLayer);

        newSolid.inPoint = selectedLayer.outPoint - (i * (comp.frameDuration));
        }
    app.endUndoGroup();
    }
                                                                                                                                                                                   
function createOneFramerM(x) {

    var comp = app.project.activeItem;
    var selectedLayer = comp.selectedLayers[0];
    var newSolid;

    var count = conv[x1];
    //var count = 0;
    for(var i = x; i>-1;i--){
        
        
        newSolid = comp.layers.addSolid([.2,.2,.2], "Adjustment Layer", comp.width, comp.height, 1,comp.frameDuration * .985); // CREATES NEW ADJ
        newSolid.adjustmentLayer = true;
        newSolid.moveBefore(selectedLayer);
        
        newSolid.selected = false;
        y  = comp.time + (count * (comp.frameDuration));
    
        newSolid.inPoint =  y;
       
        //count+=1;
        count-=1;

      
        }
    comp.selectedLayers = [];
    }

      // =================EVERY THING BELOW HERE I DECIDED NOT TO IMPLEMENT FOR REASONS   ================================                                                                                                                                  
function createTextMask(){
    app.beginUndoGroup("Create Mask from Text");
    var comp = app.project.activeItem;
    var createShapesID = app.findMenuCommandId("Create Shapes from Text");
    comp.openInViewer();
    var textLayer = comp.selectedLayers[0];
    var globalText = textLayer.property("Source Text").value.toString();

    app.executeCommand(createShapesID);
    
    var shapeLayer = comp.selectedLayers[0];
    for(var i = 0; i < globalText.length;i++){ // layer
        for(var j = 0; j < globalText.length;j++){  // text
             if (j != i){
                shapeLayer.property("Contents").property(globalText[j]).enabled = false; //hides property layer
                }
            else{
          
                shapeLayer.property("Contents").property(globalText[j]).enabled = true;
                
                }
           }
        var dup= shapeLayer.duplicate();
        dup.name =globalText[i] ;
        dup.moveBefore(comp.selectedLayers[0]); 
       }
      app.endUndoGroup();
   }
   
function createTextMask2(){

    var comp = app.project.activeItem;
    var createShapesID = app.findMenuCommandId("Create Masks from Text");
    comp.openInViewer();
    var textLayer = comp.selectedLayers[0];
    var globalText = textLayer.property("Source Text").value.toString();
    app.executeCommand(createShapesID);
    
    var shapeLayer = comp.selectedLayers[0];
    for(var i = 0; i < globalText.length;i++){ // layers
        for(var j = 0; j < globalText.length;j++){  // text
             if (j != i){
                shapeLayer.property("Contents").property(globalText[j]).enabled = false; //hides property layer
                }
            else{
                shapeLayer.property("Contents").property(globalText[j]).enabled = true;
                }
           }
        var dup= shapeLayer.duplicate();
        dup.name =globalText[i] ;
        dup.moveBefore(comp.selectedLayers[0]); 
       }
    comp.selectedLayers[0].remove();
    }
}

function isInArray(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return true;
        }
    }
    return false;
}

function renameAdjustmentLayers() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    if (typeof nicknames === "undefined" || nicknames == null); nicknames = {};
    if (typeof exclusions === "undefined" || exclusions == null) ; exclusions = [];

    var layers = comp.layers;
    for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];
        if (layer instanceof AVLayer && layer.adjustmentLayer) {
            var effects = layer.property("ADBE Effect Parade");
            if (effects.numProperties > 0) {
                var newName = "";
                for (var j = 1; j <= effects.numProperties; j++) {
                        var effect = effects.property(j);
                        var effectName = effect.name;
                             ////
                        if (! isInArray(effectName,exclusions)) { 
                            var nick = nicknames[effectName] || effectName;
                            newName += nick + " ";
                        }
                }
                if (newName !== "") {
                    layer.name = newName;
               }
            }
        }
    }
}


function resetTransform() {
    var comp = app.project.activeItem;
    if(comp.selectedLayers.length == 0) {
        alert("Please select at least 1 layer");
            return false;
    } else {
            var layers = comp.selectedLayers;
            for(var i = 0; i < layers.length; i++) {
                app.executeCommand(app.findMenuCommandId("Center Anchor Point in Layer Content"));
                layers[i].property("Position").setValue([app.project.activeItem.width/2, app.project.activeItem.height/2]);
                layers[i].property("Scale").setValue([100, 100]);
                layers[i].property("Opacity").setValue(100);
                //layers[i].property("Anchor Point").setValue([app.project.activeItem.width/2, app.project.activeItem.height/2]);
                layers[i].property("Rotation").setValue(0);
                
                if(layers[i].property("Audio Levels") != null) {
                        layers[i].property("Audio Levels").setValue([0, 0]);
                }
            }
        }
}


    build_UI(thisObj);

})(this);

