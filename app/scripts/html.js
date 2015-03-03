var htmlFredChart = '<div class="section" id="section2" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">2</div><span><span>Specify the size:</span><ul><li id="2default" class="optionText activeText">Default</li><span>•</span><li id="2custom" class="optionText">Custom</li></ul></span></div><div id="sizeDefault"><label for="sizeLG"><input type="radio" id="sizeLG" name="widgetSize"><div class="radioCircle"></div><span class="optionText"><span>Large </span><span class="optionDetail">(600 x 338 pixels)</span></span></input></label><label for="sizeMD"><input type="radio" id="sizeMD" name="widgetSize"><div class="radioCircle"></div><span class="optionText"><span>Medium </span><span class="optionDetail">(272 x 193 pixels)</span></span></input></label><label for="sizeSM"><input type="radio" id="sizeSM" name="widgetSize"><div class="radioCircle"></div><span class="optionText"><span>Small </span><span class="optionDetail">(167 x 96 pixels)</span></span></input></label></div><div id="sizeCustom"><div style="display:inline-block; margin-left:25px; margin-bottom:10px; min-width: 1040px"><label><span class="optionTextNoToggle">Width</span><!-- <span class="optionDetail">(100 - 1024 pixels)</span> --><div class="sliderPreTrack"></div><div class="rangeSlider" style="width:880px; display:inline-block" min="150" max="1024" activated="false"></div><div class="sliderPostTrack"></div></label></div><div style="height:5px; width:1px"></div><div style="display:inline-block; margin-left:25px; margin-bottom:10px; min-width: 1040px"><label><span class="optionTextNoToggle">Height</span><!-- <span class="optionDetail">(50 - 768 pixels)</span> --><div class="sliderPreTrack"></div><div class="rangeSlider" style="width:880px; display:inline-block" min="95" max="768" activated="false"></div><div class="sliderPostTrack"></div></label></div></div><div style="width:5px; height:10px"></div></div><div class="section" id="section3" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">3</div><span>Configure the chart</span></div><div class="dropDownMenuContainer" style="width:425px"><div class="optionTitle">Chart feed</div><div class="dropDownMenu"><div class="dropDownMenuTitleContents" style="padding: 10px;"><span class="dropDownMenuTitle" default="Select the data feed">Select the data feed</span><div class="dropDownArrow" style="float:right"></div></div></div><div class="dropDownContents" type="word"><div class="dropDownOption" value="UNRATE">US unemployment rate</div><div class="dropDownOption" value="GDPC1">US real GDP</div><div class="dropDownOption" value="CPIAUCSL">US inflation</div><div class="dropDownOption" value="IC4WSA">US initial jobless claims, 4-week moving average</div><div class="dropDownOption" value="SPCS20RSA">S&P Case-Shiller home price index</div><div class="dropDownOption" style="text-align:right" value="custom">. . . user defined</div></div></div><div class="dropDownMenuContainer" style="width:216px"><div class="optionTitle">Chart type</div><div class="dropDownMenu"><div class="dropDownMenuTitleContents" style="padding: 10px;"><span class="dropDownMenuTitle" default="Select the chart type">Select the chart type</span><div class="dropDownArrow" style="float:right"></div></div></div><div class="dropDownContents" type="word"><div class="dropDownOption">line</div><div class="dropDownOption">area</div><div class="dropDownOption">column</div><div class="dropDownOption" style="text-align:right" value="custom">. . . user defined</div></div></div><div class="dropDownMenuContainer" style="width:260px"><div class="optionTitle">Time period</div><div class="dropDownMenu"><div class="dropDownMenuTitleContents" style="padding: 10px;"><span class="dropDownMenuTitle" default="Select the time period">Select the time period</span><div class="dropDownArrow" style="float:right"></div></div></div><div class="dropDownContents" type="dateRange"><div class="dropDownOption" value="50y">All available</div><!-- <div class="dropDownOption" value="1d">1 day</div><div class="dropDownOption" value="2d">2 days</div><div class="dropDownOption" value="3d">3 days</div><div class="dropDownOption" value="5d">5 days</div><div class="dropDownOption" value="10d">10 days</div><div class="dropDownOption" value="1m">1 month</div><div class="dropDownOption" value="3m">3 months</div><div class="dropDownOption" value="3m">6 months</div><div class="dropDownOption" value="9m">9 months</div>--><div class="dropDownOption" value="1y">Year to date</div><div class="dropDownOption" value="1y">1 year</div><div class="dropDownOption" value="2y">2 years</div><div class="dropDownOption" value="3y">3 years</div><div class="dropDownOption" value="5y">5 years</div><div class="dropDownOption" value="10y">10 years</div><div class="dropDownOption" value="20y">20 years</div><div class="dropDownOption" value="30y">30 years</div><div class="dropDownOption" value="50y">50 years</div><div class="dropDownOption" style="text-align:right" value="custom">. . . user defined</div></div></div></div><div class="section" id="section4" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">4</div><span>Enter the labels and units</span></div><div class="inputContainer"><div class="optionTitle">Chart title</div><input type="text" class="untouched" default="Enter the title" value="Enter the title"></div><div class="inputContainer"><div class="optionTitle">Chart subtitle</div><input type="text" class="untouched optional" default="Enter the subtitle (optional)" value="Enter the subtitle (optional)"></div><div class="inputContainer"><div class="optionTitle">Chart updated</div><input type="text" class="untouched optional" default="Enter updated date (optional)" value="Enter updated date (optional)"></div><div class="dropDownMenuContainer" style="width:226px; clear:both"><div class="optionTitle">Prefix units</div><div class="dropDownMenu"><div class="dropDownMenuTitleContents" style="padding: 10px;"><span class="dropDownMenuTitle" default="Select the units">Select the units</span><div class="dropDownArrow" style="float:right"></div></div></div><div class="dropDownContents" type="word"><div class="dropDownOption">(none)</div><div class="dropDownOption">$</div><div class="dropDownOption">£</div><div class="dropDownOption">€</div><div class="dropDownOption" style="text-align:right" value="custom">. . . user defined</div></div></div><div class="dropDownMenuContainer" style="width:226px"><div class="optionTitle">Suffix units</div><div class="dropDownMenu"><div class="dropDownMenuTitleContents" style="padding: 10px;"><span class="dropDownMenuTitle" default="Select the units">Select the units</span><div class="dropDownArrow" style="float:right"></div></div></div><div class="dropDownContents" type="word"><div class="dropDownOption">(none)</div><div class="dropDownOption">m</div><div class="dropDownOption">bn</div><div class="dropDownOption">tn</div><div class="dropDownOption">%</div><div class="dropDownOption">per cent</div><div class="dropDownOption" style="text-align:right" value="custom">. . . user defined</div></div></div></div><div class="section" id="section5" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">5</div><span>Is a custom source required?</span><ul><li id="5default" class="optionText">No</li><span>•</span><li id="5custom" class="optionText">Yes</li></ul></div><div class="inputContainer" style="display:none"><div class="optionTitle">Source text</div><input type="text" class="untouched" default="Enter the source" value="Enter the source"></div><!--<div class="inputContainer disabled"><div class="optionTitle">Source url</div><input type="text" class="untouched optional" value="Enter the source url (optional)"></div>--></div><div class="section" id="section6" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">6</div><span>Generate chart</span></div><button class="generateButton" style="display:none">Generate</button></div>';
var htmlCustomChart = '<div class="section" id="section2" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">2</div><span><span>Specify the size:</span><ul><li id="2default" class="optionText activeText">Default</li><span>•</span><li id="2custom" class="optionText">Custom</li></ul></span></div><div id="sizeDefault"><label for="sizeLG"><input type="radio" id="sizeLG" name="widgetSize"><div class="radioCircle"></div><span class="optionText"><span>Large </span><span class="optionDetail">(600 x 338 pixels)</span></span></input></label><label for="sizeMD"><input type="radio" id="sizeMD" name="widgetSize"><div class="radioCircle"></div><span class="optionText"><span>Medium </span><span class="optionDetail">(272 x 193 pixels)</span></span></input></label><label for="sizeSM"><input type="radio" id="sizeSM" name="widgetSize"><div class="radioCircle"></div><span class="optionText"><span>Small </span><span class="optionDetail">(167 x 96 pixels)</span></span></input></label></div><div id="sizeCustom"><div style="display:inline-block; margin-left:25px; margin-bottom:10px; min-width: 1040px"><label><span class="optionTextNoToggle">Width</span><!-- <span class="optionDetail">(100 - 1024 pixels)</span> --><div class="sliderPreTrack"></div><div class="rangeSlider" style="width:880px; display:inline-block" min="150" max="1024" activated="false"></div><div class="sliderPostTrack"></div></label></div><div style="height:5px; width:1px"></div><div style="display:inline-block; margin-left:25px; margin-bottom:10px; min-width: 1040px"><label><span class="optionTextNoToggle">Height</span><!-- <span class="optionDetail">(50 - 768 pixels)</span> --><div class="sliderPreTrack"></div><div class="rangeSlider" style="width:880px; display:inline-block" min="95" max="768" activated="false"></div><div class="sliderPostTrack"></div></label></div></div><div style="width:5px; height:10px"></div></div><div class="section" id="section3" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">3</div><span>Enter the labels and units</span></div><div class="inputContainer"><div class="optionTitle">Chart title</div><input type="text" class="untouched" default="Enter the title" value="Enter the title"></div><div class="inputContainer"><div class="optionTitle">Chart subtitle</div><input type="text" class="untouched optional" default="Enter the subtitle (optional)" value="Enter the subtitle (optional)"></div><div class="inputContainer"><div class="optionTitle">Chart updated</div><input type="text" class="untouched optional" default="Enter updated date (optional)" value="Enter updated date (optional)"></div><div class="dropDownMenuContainer" style="width:226px; clear:both"><div class="optionTitle">Prefix units</div><div class="dropDownMenu"><div class="dropDownMenuTitleContents" style="padding: 10px;"><span class="dropDownMenuTitle" default="Select the units">Select the units</span><div class="dropDownArrow" style="float:right"></div></div></div><div class="dropDownContents" type="word"><div class="dropDownOption">(none)</div><div class="dropDownOption">$</div><div class="dropDownOption">£</div><div class="dropDownOption">€</div><div class="dropDownOption" style="text-align:right" value="custom">. . . user defined</div></div></div><div class="dropDownMenuContainer" style="width:226px"><div class="optionTitle">Suffix units</div><div class="dropDownMenu"><div class="dropDownMenuTitleContents" style="padding: 10px;"><span class="dropDownMenuTitle" default="Select the units">Select the units</span><div class="dropDownArrow" style="float:right"></div></div></div><div class="dropDownContents" type="word"><div class="dropDownOption">(none)</div><div class="dropDownOption">m</div><div class="dropDownOption">bn</div><div class="dropDownOption">tn</div><div class="dropDownOption">%</div><div class="dropDownOption">per cent</div><div class="dropDownOption" style="text-align:right" value="custom">. . . user defined</div></div></div></div><div class="section" id="section4" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">4</div><span>Where is the data</span></div><div id="userDateLocation" style="margin-bottom:10px"><label for="onComp"><input type="radio" id="onComp" name="dataLocation"><div class="radioCircle"></div><span class="optionText"><span>On my computer </span><span class="optionDetail">(.xls, .csv or .tsv)</span></span></input></label><label for="onDocs"><input type="radio" id="onDocs" name="dataLocation"><div class="radioCircle"></div><span class="optionText"><span>Google drive </span><span class="optionDetail">(Bertha spreadsheet only)</span></span></input></label><label for="onPaste"><input type="radio" id="onPaste" name="dataLocation"><div class="radioCircle"></div><span class="optionText"><span>I wish to manually enter it</span></span></input></label></div><div class="fileInputHolder" style="display:none"><input id="fileUploader" class="fileUpload" style="visibility:hidden" type="file" name="pic" accept=".txt, .tsv, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"><div class="fileUploadCoverup">Choose file</div><div class="fileUploadText"></div><div id="fileUploadWarning" style="clear:both; font-size: 16px; font-weight:bold; color:#c36256; margin-right: 10px; margin-left:25px; margin-bottom: 10px; display: none;"><span class="errorEntryText"></span></div></div><div class="berthaInputHolder" style="margin-left:25px; display:none"><div class="optionTitle" style="display:inline-block">Enter the spreadsheet url</div><input id="berthaRetrieveInput" class="userText" type="text" style="width:450px; margin-left:5px"><button class="generic retrieve" style="margin-left:5px">Retrieve</button><i class="retrieveAnim fa fa-cog" style ="font-size:26px; margin-left:2px; position:relative; top:4px; color:rgba(0,0,0,0.25); visibility:hidden"></i><div class="cautionTitle" style="display:none; font-size:16px; margin-bottom:10px"></div></div></div><div class="section" id="section5" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">5</div><span>Enter the data</span><div class="optionDetail">See an example <span title="Reminder: make a popup example when a user clicks this" id="dataExamples" class="accentColor">here</span></div><!--<div class="optionDetail">X values can be either <b>dates</b>, <b>categories</b> or <b>numbers</b>. Y values must be <b>numbers</b>.</div>--></div><div style="display:inline-block; margin-left: 25px;"><div style="display:inline-block"><div class="optionTitle">X values</div><textarea id="inputDates" style="margin-right:5px; text-align:right"></textarea></div><div style="display:inline-block"><div class="optionTitle">Y values</div><textarea id="inputValues"></textarea></div><div class="dropDownMenuContainer" style="width:216px"><div class="optionTitle">Chart type</div><div class="dropDownMenu"><div class="dropDownMenuTitleContents" style="padding: 10px;"><span class="dropDownMenuTitle" default="Select the chart type">Select the chart type</span><div class="dropDownArrow" style="float:right"></div></div></div><div class="dropDownContents" type="word"><div class="dropDownOption">line</div><div class="dropDownOption">area</div><div class="dropDownOption">column</div><div class="dropDownOption" style="text-align:right" value="custom">. . . user defined</div></div></div><div id="dataEntryWarning" style="font-size: 16px; font-weight:bold; color:#c36256; margin-right: 10px; margin-bottom: 10px; display: none;"><span class="errorEntryText">Letters are not permitted</span></div></div></div><div class="section" id="section6" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">6</div><span>Additional settings<span class="expandContract expand"><i class="fa fa-plus-square"></i></span><span class="expandContract contract noDisplay"><i class="fa fa-minus-square"></i></span></span><div class="option disableInactive noDisplay"><span>Make chart polar?</span><ul><li id="6ddefault" class="optionText activeText">No</li><span>•</span><li id="6dcustom" class="optionText">Yes</li></ul></div><div class="option noDisplay"><span>Invert the y-axis?</span><ul><li id="6adefault" class="optionText activeText">No</li><span>•</span><li id="6acustom" class="optionText">Yes</li></ul></div><div class="option noDisplay"><span>Hide the x-axis legend?</span><ul><li id="6bdefault" class="optionText activeText">No</li><span>•</span><li id="6bcustom" class="optionText">Yes</li></ul></div><div class="option noDisplay"><span>Is a custom source required?</span><ul><li id="6default" class="optionText activeText">No</li><span>•</span><li id="6custom" class="optionText">Yes</li><span>•</span><li id="6custom2" class="optionText">Hide source</li></ul></div><div class="option optional noDisplay"><span>Put source in upper right-hand corner?</span><ul><li id="6cdefault" class="optionText activeText">No</li><span>•</span><li id="6ccustom" class="optionText">Yes</li></ul></div></div><div class="inputContainer" style="display:none"><div class="optionTitle">Source text</div><input type="text" class="untouched" default="Enter the source" value="Enter the source"></div><!--<div class="inputContainer disabled"><div class="optionTitle">Source url</div><input type="text" class="untouched optional" value="Enter the source url (optional)"></div>--></div><div class="section" id="section7" style="display:none"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">7</div><span>Generate chart</span></div><button class="generateButton" style="display:none">Generate</button></div>';