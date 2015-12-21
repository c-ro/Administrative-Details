var activeTab;
var appStatus = "open";
var timeDelta;

// FETCH TAB ID for GLOBAL
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  activeTab = tabs[0].id;
});

// SET ONCLICK ACTION(S)
chrome.browserAction.onClicked.addListener(function(tab) {
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      activeTab = tabs[0].id;
    });

    chrome.tabs.sendMessage(activeTab, {"message": "clicked_browser_action"});

    if(appStatus === "closed"){
        appStatus = "open";
    } else {
        appStatus = "closed";
    }

});

// Send/Recieve open/close status

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.extStatus === "check")
      sendResponse({currentStatus: appStatus});
      console.log("sent status: " + appStatus);
  });



/// Main Clock
var params = {};

function stringify(number){
    if (number < 10){
        string = "0" + number;
    } else {
        string = number.toString();
    }
    return string;
}

var Clock = function(){
    
    this.time = function(){
        return new Date();
    };
    
    this.day = function(){
        return this.time().getDay();
    };
    
    this.ampm = function(){
        return this.time() > 12 ? "PM" : "AM";
    };
    
    this.hour = function(){
        return this.time().getHours();
    };
    
    this.min = function(){
        return stringify(this.time().getMinutes());
    };
    
    this.sec = function(){
        return stringify(this.time().getSeconds());
    };
    
};

var clock = new Clock();

function time(){
    setInterval(function(){
        return clock.hour() +":"+ clock.min() +":"+ clock.sec();
    },1000);
}

function countdown(){
    setInterval(function(){
        var nextMin = (Math.ceil(Number(clock.min()) / 15) * 15) - clock.min();
        
        var nextSec = 60 - clock.sec();
        
        if (nextSec === 60) {
            nextSec = 0;
            nextMin++;
        }
        
        return stringify(nextMin) +":"+ stringify(nextSec);
    },1000);
}

time();
countdown();
clock.ampm();

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////////     ^ ^ ^ ^   NEW CLOCK    ^ ^ ^ ^   /////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function clock(){
    var time = new Date(),
    sec = time.getSeconds(),
    min = time.getMinutes(),
    hour = time.getHours(),
    day = time.getDay(),
    amPm = hour > 12 ? "PM" : "AM";

    // var Person = function (firstName) {
//   this.firstName = firstName;
// };

// Person.prototype.sayHello = function() {
//   console.log("Hello, I'm " + this.firstName);
// };

// var person1 = new Person("Alice");
// var person2 = new Person("Bob");

// // call the Person sayHello method.
// person1.sayHello(); // logs "Hello, I'm Alice"
// person2.sayHello(); // logs "Hello, I'm Bob"
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);

    //send to params for messaging
    var time = h.toString() + ":" + m.toString(); // + ":" + s.toString();
    params.clock = time;

    var t = setTimeout(function () {
        startTime();
    }, 60000);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
}

/// rounds current time up to nearest quarter hours
function getNextDetail(time) {
    var timeToReturn = new Date(time);
    timeToReturn.setMilliseconds(Math.ceil(time.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15);
    return timeToReturn;
}
/// countdown to next quarter hour
function countdown() {
    var time = new Date();
    var upcoming = getNextDetail(time);
    var remain = (upcoming - time) / 1000;
    var minutes = Math.floor(remain / 60).toString();
    var seconds = Math.floor(remain - (minutes * 60)).toString();
    var zero = '0';
    if (seconds.length < 2) {
        seconds = zero.concat(seconds);
    } else if (minutes.length < 2) {
        minutes = zero.concat(minutes);
    }

/// load params for send message
    var ctime = minutes + ":" + seconds;
    params.countdown = ctime;
    
// recurse countdown
    var t = setTimeout(function () {
    countdown();
    buttonAlert();
    readTrafficGuide();
    }, 1000);
}

function readTrafficGuide(){
    trafficSection = 'trafficguide/' + clock.day + clock.amPm + '.json';
    trafficTime = clock.hour + ":" + clock.min;
    // READ TRAFFIC GUIDE CSVs
    $.getJSON(trafficSection, function (json) {
        var nD = getNextDetail(time),
            nextDetail = nD.getHours() + ":" + nD.getMinutes();
        if (nD.getMinutes() === 0){
            nextDetail = nextDetail + '0';
        }

        var currentTraffic = json[nextDetail];
        timeDelta = Number(nextDetail.substr(3,2)) - Number(trafficTime.substr(3,2));
            console.log("countdown: " + timeDelta);

                for (var i in currentTraffic) {
                    console.log(i + ": " + currentTraffic[i]);
                }
    });
}

// handle alerts
function buttonAlert() {
    var time = new Date(),
        sec = time.getSeconds(),
        min = time.getMinutes(),
        hour = time.getHours();
        // day = time.getDay(),
        // amPm = hour > 12 ? "PM" : "AM";
        // trafficSection = 'trafficguide/' + day + amPm + '.json',
        // trafficTime = hour.toString() + ":" + min.toString(); 

    params.highlight = null;
    params.highlight2 = null;
    params.blink = null;
    params.blink2 = null;

    // SET params.highlight & params.blick on keys that === 10/15 respectively
    ////////
    ///////
    //////
    /////
    ////
    //

    console.log("clock: " +  clock.min);

    if (min == 10 && sec < 1) {
        params.highlight = 'grant';
        params.highlight2 = 'artistid';
    } else if (min == 25 && sec < 1) {
        params.highlight = 'psa';
    } else if (min == 40 && sec < 1) {
        params.highlight = 'grant';
        params.highlight2 = 'blockshow';
    } else if (min == 55 && sec < 1) {
        params.highlight = 'general';
    }
    
    if (min == 15 && sec < 1) {
        params.blink = 'grant';
        params.blink2 = 'artistid';
    } else if (min == 30 && sec < 1) {
        params.blink = 'psa';
    } else if (min == 45 && sec < 1) {
        params.blink = 'grant';
        params.blink2 = 'blockshow';
    } else if (min === 0 && sec < 1) {
        params.blink = 'general';
    }

}

function setColor() {
    params.bgColor = null;
    var time = new Date().getMinutes();
    var element = document.getElementById('adminAppContainer');
    
    if ([4, 5, 6, 7, 19, 20, 21, 22, 34, 35, 36, 37, 49, 50, 51, 52].indexOf(time) >= 0) {
        params.bgColor = "rgb(154, 205, 50)"; // green
    } else if ([8, 9, 10, 11, 23, 24, 25, 26, 38, 39, 40, 41, 53, 54, 55, 56].indexOf(time) >= 0) {
        params.bgColor = 'rgb(255,235,122)'; // yellow
    } else if ([1, 2, 3, 16, 17, 18, 31, 32, 33, 46, 47, 48, 49].indexOf(time) >= 0) {
        params.bgColor = 'rgb(135, 206, 250)'; // blue
    } else if (timeDelta === 0) {
        params.bgColor = 'rgb(220, 20, 60)'; // red
    } else {
        params.bgColor = 'rgb(255,204,0)';
    }

    var t = setTimeout(function () {
        setColor();
    }, 1000);
}

/// SEND params object to CS
  var sendMessage = function(object){
      chrome.tabs.sendMessage(activeTab, object);
  };


////call that good good:
setInterval(function(){
    sendMessage(params);
},1000);
startTime();
countdown();
setColor();

///start app 
