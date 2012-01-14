<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Sample using the Google data JavaScript client library</title>
<link rel="stylesheet" type="text/css" href="./DojoCalendar_files/dev_docs.css">
<script type="text/javascript" src="./DojoCalendar_files/jsapi"></script>
<script type="text/javascript">
<!--
/* Copyright (c) 2007 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Loads the Google data JavaScript client library */
google.load("gdata", "2.x", {packages: ["calendar"]});

function init() {
  // init the Google data JS client library with an error handler
  google.gdata.client.init(handleGDError);
  // load the code.google.com developer calendar
  loadDeveloperCalendar();
}

/**
 * Loads the Google Developers Event Calendar
 */
function loadDeveloperCalendar() {
    loadCalendar('https://www.google.com/calendar/feeds/5d6lantuetlp2vcfinobnpqo4c%40group.calendar.google.com/public/full');
    // loadCalendar('https://www.google.com/calendar/feeds/me81n81gqt4hhmk0u6b8s6n9rg%40group.calendar.google.com/public/full') // Aikido timetable
   //  loadCalendar('https://www.google.com/calendar/feeds/alex@tomosei-aikido.de/public/full') // Aikido sminars
}


/**
 * Loads the JS source for a user to copy/paste into their site into a div
 * with the name 'jsSource'.
 */
function generateJsSource() {
  var elementToUpdate = document.getElementById('jsSourceFinal');
  var elementUpdateTemplate = document.getElementById('jsSourceTemplate');
  /* in IE */
  if (document.all) {
    elementToUpdate.innerText = 
        elementUpdateTemplate.innerText +
        "\n<script type=\"text/javascript\">" +
        "\nloadCalendar('https://www.google.com/calendar/feeds/" + 
        document.getElementById('calendarAddress').value + "/public/full');" +
        "\n</script>";
  } else {
    /* in Firefox/other */
    elementToUpdate.textContent = 
        elementUpdateTemplate.textContent +
        "\n<script type=\"text/javascript\">" +
        "\nloadCalendar('https://www.google.com/calendar/feeds/" + 
        document.getElementById('calendarAddress').value + "/public/full');" +
        "\n</script>";
  }
  document.getElementById('jsSourceFinal').style.display = 'block';
}

/**
 * Adds a leading zero to a single-digit number.  Used for displaying dates.
 * 
 * @param {int} num is the number to add a leading zero, if less than 10
 */
function padNumber(num) {
  if (num <= 9) {
    return "0" + num;
  }
  return num;
}

/**
 * Determines the full calendarUrl based upon the calendarAddress
 * argument and calls loadCalendar with the calendarUrl value.
 *
 * @param {string} calendarAddress is the email-style address for the calendar
 */ 
function loadCalendarByAddress(calendarAddress) {
  var calendarUrl = 'https://www.google.com/calendar/feeds/' +
                    calendarAddress + 
                    '/public/full';
  loadCalendar(calendarUrl);
}

/**
 * Uses Google data JS client library to retrieve a calendar feed from the specified
 * URL.  The feed is controlled by several query parameters and a callback 
 * function is called to process the feed results.
 *
 * @param {string} calendarUrl is the URL for a public calendar feed
 */  
function loadCalendar(calendarUrl) {
  var service = new 
      google.gdata.calendar.CalendarService('gdata-js-client-samples-simple');
  var query = new google.gdata.calendar.CalendarEventQuery(calendarUrl);
  query.setOrderBy('starttime');
  query.setSortOrder('ascending');
  query.setFutureEvents(true);
  query.setSingleEvents(true);
  query.setMaxResults(10);

  service.getEventsFeed(query, listEvents, handleGDError);
}

/**
 * Callback function for the Google data JS client library to call when an error
 * occurs during the retrieval of the feed.  Details available depend partly
 * on the web browser, but this shows a few basic examples. In the case of
 * a privileged environment using ClientLogin authentication, there may also
 * be an e.type attribute in some cases.
 *
 * @param {Error} e is an instance of an Error 
 */
function handleGDError(e) {
  //document.getElementById('jsSourceFinal').setAttribute('style','display:none');
  if (e instanceof Error) {
    /* alert with the error line number, file and message */
    alert('Error at line ' + e.lineNumber +
          ' in ' + e.fileName + '\n' +
          'Message: ' + e.message);
    /* if available, output HTTP error code and status text */
    if (e.cause) {
      var status = e.cause.status;
      var statusText = e.cause.statusText;
      alert('Root cause: HTTP error ' + status + ' with status text of: ' + 
            statusText);
    }
  } else {
    alert(e.toString());
  }
}

/**
 * Callback function for the Google data JS client library to call with a feed 
 * of events retrieved.
 *
 * Creates an unordered list of events in a human-readable form.  This list of
 * events is added into a div called 'events'.  The title for the calendar is
 * placed in a div called 'calendarTitle'
 *
 * @param {json} feedRoot is the root of the feed, containing all entries 
 */ 
function listEvents(feedRoot) {
  var entries = feedRoot.feed.getEntries();
  var eventDiv = document.getElementById('events');
  if (eventDiv.childNodes.length > 0) {
    eventDiv.removeChild(eventDiv.childNodes[0]);
  }	  
  /* create a new unordered list */
  var ul = document.createElement('ul');
  /* set the calendarTitle div with the name of the calendar */
  document.getElementById('calendarTitle').innerHTML = 
    "Calendar: " + feedRoot.feed.title.$t;

  /* loop through each event in the feed */
  var len = entries.length;
  for (var i = 0; i < len; i++) {
    alert('a');
    addEventEntry(entries[i], document, ul);
  }
  eventDiv.appendChild(ul);
}

/**
 * Add a list entry for the given event.
 *
 * @param entry is the entry to be added
 * @param document the document to be used as a factory
 * @param ul the list to add the item too
 */  
function addEventEntry(entry, document, ul) {
    var title = entry.getTitle().getText();
   
    var dateString = getDateString(entry.getTimes());
    
    var entryLinkHref = null;
    if (entry.getHtmlLink() != null) {
      entryLinkHref = entry.getHtmlLink().getHref();
    }
    
    var li = document.createElement('li');

    /* if we have a link to the event, create an 'a' element */
    if (entryLinkHref != null) {
      entryLink = document.createElement('a');
      entryLink.setAttribute('href', entryLinkHref);
      entryLink.appendChild(document.createTextNode(title));
      li.appendChild(entryLink);
      li.appendChild(document.createTextNode(' - ' + dateString));
    } else {
      li.appendChild(document.createTextNode(title + ' - ' + dateString));
    }       

    /* append the list item onto the unordered list */
    ul.appendChild(li);
}

function getDateString(times) {
    var startDate = null;
    var endDate = null;
    
    if (times.length > 0) {
      startDate = times[0].getStartTime().getDate();
      endDate = times[0].getEndTime().getDate();
      
      var startDay   = startDate.getDate();
      var startMonth = startDate.getMonth();
      var endDay     = endDate.getDate();
      var endMonth   = endDate.getMonth();
      
      if (startMonth != endMonth) {
         return formatDateRange(startDay, startMonth, endDay,endMonth);
      } else if (startDay != endDay) {
          return formatDateRangeInOneMonth(startDay, endDay, endMonth);
      } else {
          return formatSingleDay(startDay, startMonth);
      }
    }

    
    
    return "";

     
    

}

function formatSingleDay(day, month) {
  return formatDay(day) + formatMonth(month)
}

function formatDateRangeInOneMonth(day1, day2, month) {
  return formatDay(day1) + "-" + formatDay(day2) + formatMonth(month);
}

function formatDateRange(day1, month1, day2, month2) {
  return formatDay(day1) + formatMonth(month1) + "-" + formatDay(day2) + formatMonth(month2);
}

function formatDay(day) {
  return day + ".";
}

function formatMonth(month) {
  return padNumber(month + 1) + ".";
}

google.setOnLoadCallback(init);

//-->
</script><script src="./DojoCalendar_files/saved_resource" type="text/javascript"></script><script src="./DojoCalendar_files/core,batch,geo,opensearch,atom,app,gdata,acl,calendar.I.js" type="text/javascript"></script>
</head>
<body>
<h3 id="calendarTitle">...</h3>
<div id="events">
</div>
<hr>



</body></html>