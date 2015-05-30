//ADD NEW ELEMENTS TO HTML ONLOAD, HIDE IF BA NOT CLICKED
$(document).ready(function(){
  $("<div id='adminAppContainer'></div>").insertBefore('#nowTopBox'); //FOR GRADIENT BORDER: <div id='transition' class='gradient'></div>"
  $('#adminAppContainer').append("<div id='clock'></div>");
  $('#adminAppContainer').append("<div id='buttonDiv'></div>");
  $('#buttonDiv').append("<div id='general' class='lowlight'>General Promo</div>");
  $('#buttonDiv').append("<div id='artistid' class='lowlight'>Artist ID</div>");  
  $('#buttonDiv').append("<div id='blockshow' class='lowlight'>Blockshow</div>"); 
  $('#buttonDiv').append("<div id='psa' class='lowlight'>PSA</div>"); 
  $('#buttonDiv').append("<div id='grant' class='lowlight'>Grant</div>");
  $('#adminAppContainer').append("<div id='countdown'></div>");
  // $('#adminAppContainer').append("<div id='chatcontainer'></div>");
  $('#buttonDiv').append("<button id='submit_note'>leave note</button>")
  $('#adminAppContainer').append("<div id='ticker'></div>");
  $("<div id='transition' class='gradient'></div>").insertAfter('#adminAppContainer');
  $('#adminAppContainer').toggle();
  $('#transition').toggle();

// SEND STATUS CHECK MESSAGE on DOCUMENT END
chrome.runtime.sendMessage({"extStatus": "check"}, function(response){
  
  if(response.currentStatus === "open"){
      $('#adminAppContainer').show();
      $('#transition').show();
      $('#nowTopBox').hide();
      $('#social-links').hide();
    // console.log(response.currentStatus + " yey");
    }
  // if(response.currentStatus === "closed"){
  //   console.log(response.currentStatus + " boo");
  // }
});

/// LISTENER: TOGGLE APP
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "clicked_browser_action") {
      $('#adminAppContainer').toggle();
      $('#transition').toggle();
      $('#nowTopBox').toggle();
      $('#social-links').toggle();
      }
    })

/// LISTENER: COLORS, TIMES AND TOGGLES
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.clock){
      $('#clock').html(request.clock);
      $('#countdown').html(request.countdown);
    }
      // CHECK FOR highlight AND blink PARAMS AND MANIPULATE DOM ACCORDINGLY
    if(request.highlight !== null && request.highlight !== undefined){
      highlight(eval(request.highlight));
    }

    if(request.highlight2 !== null && request.highlight2 !== undefined){
      highlight(eval(request.highlight2));
    }

    if(request.blink !== null && request.blink !== undefined){
      (eval(request.blink)).addClass('blink_me');
    }

    if(request.blink2 !== null && request.blink2 !== undefined){
      (eval(request.blink2)).addClass('blink_me');
    }

    if(request.bgColor !== null && request.blink !== undefined){
     $('#adminAppContainer').css('background-color', request.bgColor);
  
    var gradColor = "-webkit-linear-gradient(" + request.bgColor + ",rgba(255,0,0,0))"
    $('#transition').css('background', gradColor);
    }

  })

/// Note Input
$('#submit_note').click(function(){
  alert("this doesn't work yet, holmes.");
});

/// BEGIN MESSAGE TICKER -- NEED TO IMPLEMENT OPTIONS PAGE inPUT.
var tickerInput = ["ALL DJS: remember to floss before going on the air", "FCC say: don't make cusses on the radio, you'll murder the children if you do", "The time is (time), I'm (your name), and you're listening to WRFL Lexington!", "Backsell that playlist!"];
var tickerOutput = [];

function resizeStrings(array){
  for(var i = 0; i < array.length; i++){
    if(array[i].length <= 85){
      tickerOutput.push(array[i])
    } else {
      tickerOutput.push(array[i].slice(0,85) + ". . .");
        if(array[i].slice(85).length > 85){
          tickerOutput.push(array[i].slice(85,170) + ". . .");
          tickerOutput.push(array[i].slice(170) + ". . .");
        };
    }
  }
}

var messageIndex = 0;
var showTicker = function(){
    if(messageIndex === tickerOutput.length){messageIndex = 0;}
    tickerDiv = $('#ticker');
    $(tickerDiv).fadeOut("slow");
    setTimeout(function(){$(tickerDiv).html(tickerOutput[messageIndex]); $(tickerDiv).fadeIn("slow"); messageIndex++;},750); 
    setTimeout(showTicker, 7500);
}

resizeStrings(tickerInput);
showTicker();

/// set buttons
// blockshow.attr("class", "highlight");
// blockshow.addClass('blink_me');

function lowlight(button) {
  $(button).attr("class", "lowlight");
}

function highlight(button) {
  $(button).attr("class", "highlight");
}

  var blockshow = $('#blockshow')
  var artistid = $('#artistid')
  var psa = $('#psa')
  var grant = $('#grant')
  var general = $('#general')
  var buttons = [general, blockshow, artistid, grant, psa];

  for(var i = 0; i < buttons.length; i++){
    $(buttons[i]).click(function(){
       lowlight(this);
    });
  }

//not sure if I'm using this. . . may 20th
var toggleButtonState = function () {
    swap(this.id);
};


});