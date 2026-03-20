
var initialID = "0000", pupName = "Joker", pupColor = "white";
var now = new Date();
var year = now.getFullYear().toString();
var month = ("0" + (now.getMonth() + 1)).slice(-2);

var pawsDayYear = "2025", pawsDayMonth = "01";
var initialHeight = "5'11", initialShoe = "44", initialFlag = "germany";
var socialLink = "linktr.ee/bonebattle", instaUsername = "bonebattlecards";

var pRubber = "0", pLeather = "0", pSneaker = "0", pJocks = "0";
var pFurry = "0", pMx = "0", pSportswear = "0", pTactical = "0";
var pOutdoor = "0", pSniffing = "0", pEdging = "0", pFisting = "0", pAbdl = "0", pToys = "0";
var pCuck = "0", pPower = "0", pChastity = "0", pBdsm = "0", pVerbal = "0", pDirty = "0";

var doc = app.activeDocument;



var alterName = doc.name.replace(/\.[^\.]+$/, "");

var teile = alterName.split("_");
var prefix ="";
if (teile.length >= 3) {
    prefix = teile[0];
    
    var nummer = parseInt(teile[1], 10);
    nummer++;
    var neueNummer = ("0000" + nummer).slice(-4);
    
}

initialID = neueNummer;





var win = new Window("dialog", "Serial, Name, Stats, Social Link");
win.orientation = "row"; // Haupt-Layout nebeneinander
win.alignChildren = ["left", "top"];
win.spacing = 15;

// ==========================================
// SPALTE 1: Identity, Stats & Socials
// ==========================================
var col1 = win.add("group");
col1.orientation = "column";
col1.alignChildren = "fill";

var namePanel = col1.add("panel", undefined, "Name / Identity");
var versionGroup = namePanel.add("group");
var cardNumberInput = versionGroup.add("edittext", undefined, initialID); cardNumberInput.characters = 4;
var yearInput = versionGroup.add("edittext", undefined, year); yearInput.characters = 4;
var monthInput = versionGroup.add("edittext", undefined, month); monthInput.characters = 2;
var pupNameInput = namePanel.add("edittext", undefined, pupName); pupNameInput.characters = 25;

var statsPanel = col1.add("panel", undefined, "Stats");
var pawsDateGroup = statsPanel.add("group");
var pawsDayYearInput = pawsDateGroup.add("edittext", undefined, pawsDayYear); pawsDayYearInput.characters = 4;
var pawsDayMonthInput = pawsDateGroup.add("edittext", undefined, pawsDayMonth); pawsDayMonthInput.characters = 2;

var heightList = ["1.98m / 6'6", "1.95m / 6'5", "1.94m / 6'4", "1.93m / 6'4", "1.92m / 6'4", "1.91m / 6'3", "1.90m / 6'3", "1.89m / 6'2", "1.88m / 6'2", "1.87m / 6'2", "1.86m / 6'1", "1.85m / 6'1", "1.84m / 6'0", "1.83m / 6'0", "1.82m / 6'0", "1.81m / 5'11", "1.80m / 5'11", "1.79m / 5'10", "1.78m / 5'10", "1.77m / 5'10", "1.76m / 5'9", "1.75m / 5'9", "1.74m / 5'9", "1.73m / 5'8", "1.72m / 5'8", "1.71m / 5'7", "1.70m / 5'7", "1.69m / 5'7", "1.68m / 5'6", "1.65m / 5'5", "1.64m / 5'5", "1.63m / 5'4", "1.62m / 5'4", "1.61m / 5'3", "1.60m / 5'3", "1.59m / 5'3", "1.56m / 5'1", "1.54m / 5'1"];
var shoeList = ["49EU / 15US", "48EU / 14US", "47.5EU / 14US", "47EU / 13.5US", "46.5EU / 13US", "46EU / 12.5US", "45.5EU / 12.5US", "45EU / 12US", "44.5EU / 11.5US", "44EU / 11US", "43.5EU / 10.5US", "43EU / 10.5US", "42.5EU / 10US", "42EU / 9.5US", "41.5EU / 9US", "41EU / 8.5US", "40.5EU / 8.5US", "40EU / 8US", "39.5EU / 7.5US", "39EU / 7US"];
var flagList = ["portugal", "wales", "russia", "argentinia", "bulgarien", "czech", "romania", "quebec", "south africa", "mexiko", "ecuador", "schweiz", "UK", "finland", "norway", "california", "NZ", "irland", "USA", "slovenia", "canada", "slovakia", "sweden", "australia", "colombia", "belgium", "spain", "scottland", "poland", "israel", "brettagne", "netherlands", "germany", "italy", "hungary", "france", "austria"];

function setDrop(parent, list, pre) {
    var d = parent.add("dropdownlist", undefined, list); d.preferredSize.width = 180;
    for (var i=0; i<list.length; i++) { if (list[i].indexOf(pre) !== -1) { d.selection = i; break; } }
    if (d.selection == null) d.selection = 0; return d;
}
var hDrop = setDrop(statsPanel, heightList, initialHeight);
var sDrop = setDrop(statsPanel, shoeList, initialShoe);

var socialPanel = col1.add("panel", undefined, "Socials / Flag");
var fDrop = setDrop(socialPanel, flagList, initialFlag);
var socialLinkInput = socialPanel.add("edittext", undefined, socialLink); socialLinkInput.characters = 20;
var instaUsernameInput = socialPanel.add("edittext", undefined, instaUsername); instaUsernameInput.characters = 20;

// ==========================================
// SPALTE 2: Farbe (Korrekt gruppiert)
// ==========================================
var colorPanel = win.add("panel", undefined, "Color");
colorPanel.orientation = "column";
colorPanel.alignChildren = "left";

var allColors = [];
var colorNames = ["blue", "purple", "green", "camo", "black", "white", "gray", "multi", "red", "orange", "yellow", "pink", "brown"];

for (var i=0; i<colorNames.length; i++) {
    var rb = colorPanel.add("radiobutton", undefined, colorNames[i]);
    allColors.push(rb);
    if (colorNames[i].toLowerCase() == pupColor.toLowerCase()) rb.value = true;
}

// ==========================================
// SPALTE 3: Gear & Kinks
// ==========================================
var col3 = win.add("group");
col3.orientation = "column";
col3.alignChildren = "fill";

function addAttr(p, lbl, pre) {
    var g = p.add("group"); g.add("statictext", undefined, lbl).preferredSize.width = 75;
    return g.add("edittext", undefined, pre);
}

var gearPanel = col3.add("panel", undefined, "Gear Levels (4x2)");
var gGrp = gearPanel.add("group"); gGrp.orientation = "row";
var gColL = gGrp.add("group"); gColL.orientation = "column";
var iRubber = addAttr(gColL, "Rubber:", pRubber), iLeather = addAttr(gColL, "Leather:", pLeather), iSneaker = addAttr(gColL, "Sneaker:", pSneaker), iJocks = addAttr(gColL, "Jocks:", pJocks);
var gColR = gGrp.add("group"); gColR.orientation = "column";
var iFurry = addAttr(gColR, "Furry:", pFurry), iMx = addAttr(gColR, "MX:", pMx), iSport = addAttr(gColR, "Sport:", pSportswear), iTact = addAttr(gColR, "Tact:", pTactical);

var kinkPanel = col3.add("panel", undefined, "Kink Levels (6x2)");
var kGrp = kinkPanel.add("group"); kGrp.orientation = "row";
var kColL = kGrp.add("group"); kColL.orientation = "column";
var iOutdoor = addAttr(kColL, "Outdoor:", pOutdoor), iSniffing = addAttr(kColL, "Sniff:", pSniffing), iEdging = addAttr(kColL, "Edging:", pEdging), iFisting = addAttr(kColL, "Fist:", pFisting), iAbdl = addAttr(kColL, "ABDL:", pAbdl), iToys = addAttr(kColL, "Toys:", pToys);
var kColR = kGrp.add("group"); kColR.orientation = "column";
var iCuck = addAttr(kColR, "Cuck:", pCuck), iPow = addAttr(kColR, "Power:", pPower), iChas = addAttr(kColR, "Chas:", pChastity), iBdsm = addAttr(kColR, "BDSM:", pBdsm), iVerb = addAttr(kColR, "Verb:", pVerbal), iDirty = addAttr(kColR, "Dirty:", pDirty);

var okBtn = col3.add("button", undefined, "OK", {name: "ok"});

// ==========================================
// EXECUTION
// ==========================================
if (win.show() == 1) {


    var saubererAnhang = pupNameInput.text.toLowerCase()
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/ß/g, "ss")
        .replace(/[^a-z0-9]/g, ""); 

    var neuerDateiname = prefix + "_" + neueNummer + "_" + saubererAnhang;

    var dupeDoc = doc.duplicate(neuerDateiname);


    var card = dupeDoc.layerSets.getByName("card");
    var top = card.layerSets.getByName("top");
    var bttm = card.layerSets.getByName("bttm");

    bttm.layerSets.getByName("ABs").visible = false;
    

    var sideFolders = ["name left", "name right"];
    
    // 1. Get the selected color from UI
    var selColor = "";
    for (var c = 0; c < allColors.length; c++) { 
        if (allColors[c].value) {
            selColor = allColors[c].text.toLowerCase(); 
            break; 
        }
    }

    for (var i = 0; i < sideFolders.length; i++) {
        // Parent folder (contains the color layers)
        var parentFolder = top.layerSets.getByName(sideFolders[i]);
        // Sub folder (contains the text layers)
        var nameTextFolder = parentFolder.layerSets.getByName("NAME");

        // A. Update Text (Inside "NAME" folder)
        nameTextFolder.artLayers.getByName("name").textItem.contents = pupNameInput.text;
        nameTextFolder.artLayers.getByName("name smaller").textItem.contents = pupNameInput.text;
        
        // Force Text Visibility
        nameTextFolder.artLayers.getByName("name").visible = true;
        nameTextFolder.artLayers.getByName("name smaller").visible = false;
        try { nameTextFolder.artLayers.getByName("namebgnd").visible = true; } catch(e){}

        // B. Toggle Colors (Inside "name left" or "name right" directly)
        var parentLayers = parentFolder.artLayers;
        for (var j = 0; j < parentLayers.length; j++) {
            var lname = parentLayers[j].name.toLowerCase();
            
            // Check if this layer name is in our list of 12 colors
            for (var k = 0; k < colorNames.length; k++) {
                if (lname == colorNames[k].toLowerCase()) { 
                    parentLayers[j].visible = (lname == selColor); 
                    break; 
                }
            }
        }
    }

    // Stats
    var dStr = pawsDayYearInput.text + "." + pawsDayMonthInput.text;
    top.layerSets.getByName("stats left").artLayers.getByName("pawsday").textItem.contents = dStr;
    top.layerSets.getByName("stats right").artLayers.getByName("pawsday").textItem.contents = dStr;

    function toggle(grp, list, sel) {
        for (var i=0; i<grp.artLayers.length; i++) {
            var l = grp.artLayers[i];
            for (var x=0; x<list.length; x++) { if (list[x] == l.name) l.visible = (l.name == sel); }
        }
    }
    toggle(top.layerSets.getByName("stats left").layerSets.getByName("body"), heightList, hDrop.selection.text);
    toggle(top.layerSets.getByName("stats right").layerSets.getByName("body"), heightList, hDrop.selection.text);
    toggle(top.layerSets.getByName("stats left").layerSets.getByName("sneaker"), shoeList, sDrop.selection.text);
    toggle(top.layerSets.getByName("stats right").layerSets.getByName("sneaker"), shoeList, sDrop.selection.text);

    // Flag
    var fl = top.layerSets.getByName("flag").artLayers;
    for (var i=0; i<fl.length; i++) { fl[i].visible = (fl[i].name == fDrop.selection.text); }

    // Version & Socials
    var vStr = "#" + cardNumberInput.text + "." + yearInput.text + monthInput.text;
    var vs = top.layerSets.getByName("VERSION + SOCIAL").layerSets;
    for (var i=0; i<vs.length; i++) {
        vs[i].artLayers.getByName("version").textItem.contents = vStr;
        var ins = vs[i].layerSets.getByName("insta"), soc = vs[i].artLayers.getByName("sociallink");
        if (instaUsernameInput.text != "") {
            ins.visible = true; soc.visible = false;
            ins.artLayers.getByName("username").textItem.contents = instaUsernameInput.text;
        } else {
            ins.visible = false; soc.visible = true;
            soc.textItem.contents = socialLinkInput.text;
        }
    }


    var totalBones = 0;

    // Gear & Kinks Mapping
    function runMap(fold, map) {
        for (var m=0; m<map.length; m++) {
            try {
                var f = fold.layerSets.getByName(map[m].f);
                var valText = map[m].i.text; 
            
                if (!isNaN(Number(valText))) {
                    totalBones += Number(valText);
                }

                for (var s=0; s<f.layerSets.length; s++) f.layerSets[s].visible = (f.layerSets[s].name == map[m].i.text);
            } catch(e){}
        }
    }
    runMap(bttm.layerSets.getByName("GEAR"), [{f:"rubber",i:iRubber},{f:"leather",i:iLeather},{f:"sneaker",i:iSneaker},{f:"jocks",i:iJocks},{f:"furry",i:iFurry},{f:"mx",i:iMx},{f:"sportswear",i:iSport},{f:"tactical",i:iTact}]);
    runMap(bttm.layerSets.getByName("KINKS"), [{f:"outdoor",i:iOutdoor},{f:"sniffing",i:iSniffing},{f:"edging",i:iEdging},{f:"fisting",i:iFisting},{f:"ABDL",i:iAbdl},{f:"toys",i:iToys},{f:"cuckolding",i:iCuck},{f:"powerplay",i:iPow},{f:"chastity",i:iChas},{f:"BDSM",i:iBdsm},{f:"verbal",i:iVerb},{f:"dirty",i:iDirty}]);


    alert("BoneBattle Process Complete!\n Bones: " + totalBones);

}