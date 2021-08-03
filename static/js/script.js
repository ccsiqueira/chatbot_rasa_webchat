
$(document).ready(function() {
    //drop down menu for close, restart conversation & clear the chats.
    //$('.dropdown-trigger').dropdown();

    //enable this if u have configured the bot to start the conversation. 
    // showBotTyping();
    // $("#userInput").prop('disabled', true);

    //global variables
    action_name = "ok wings";
    var d = new Date();
    var n = String(d.getTime());
    user_id = "freddy.yonata@wingscorp.com|8209";
    
    //user_id = "william.limas@wingscorp.com"
    //url_link="https://apichat.wingscorp.com"
    url_link="http://localhost"
    //if you want the bot to start the conversation
    //action_trigger();
    //restartConversationInitial()
    //send("/restart")  
})

//===========================uploader ============================================

var dropRegion = document.getElementById("drop-region"),
	// where images are previewed
	imagePreviewRegion = document.getElementById("image-preview");

// open file selector when clicked on the drop region
var fakeInput = document.createElement("input");
fakeInput.type = "file";
fakeInput.accept = "image/*";
fakeInput.multiple = true;
/*
dropRegion.addEventListener('click', function() {
	fakeInput.click();
});
*/

fakeInput.addEventListener("change", function() {
	var files = fakeInput.files;
	handleFiles(files);
});

dropRegion.addEventListener('dragenter', preventDefault, false)
dropRegion.addEventListener('dragleave', preventDefault, false)
dropRegion.addEventListener('dragover', preventDefault, false)
dropRegion.addEventListener('drop', preventDefault, false)
dropRegion.addEventListener('drop', handleDrop, false);

//===============================================================================
function preventDefault(e) {
	e.preventDefault();
  	e.stopPropagation();
}



function handleDrop(e) {
	var dt = e.dataTransfer,
		files = dt.files;

	handleFiles(files)		
}




function handleFiles(files) {
	for (var i = 0, len = files.length; i < len; i++) {
		if (validateImage(files[i]))
			previewAnduploadImage(files[i]);
	}
}

function validateImage(image) {
	// check the type
	var validTypes = ['image/jpeg', 'image/png', 'image/gif'];
	if (validTypes.indexOf( image.type ) === -1) {
		alert("Invalid File Type");
		return false;
	}

	// check the size
	var maxSizeInBytes = 10e6; // 10MB
	if (image.size > maxSizeInBytes) {
		alert("File too large");
		return false;
	}

	return true;

}

function previewAnduploadImage(image) {
	// container
	var imgView = document.createElement("div");
	imgView.className = "image-view";
	imagePreviewRegion.appendChild(imgView);

	// previewing image
	var img = document.createElement("img");
	imgView.appendChild(img);

	// progress overlay
	var overlay = document.createElement("div");
	overlay.className = "overlay";
	imgView.appendChild(overlay);


	// read the image...
	var reader = new FileReader();
	reader.onload = function(e) {
		img.src = e.target.result;
	}
    //alert(image)
	reader.readAsDataURL(image);
	// create FormData
	var formData = new FormData();
	
    formData.append('image', image);

	// upload the image
	var uploadLocation = 'image-saver.php';
	$.ajax({
        url: uploadLocation,
        data: formData,
        processData: false,
        contentType: false,
		cache: false, 
        type: 'POST',
        success: function(data){
          alert("Success Upload");
        }
    });
    $(".chatbot.usrInput").val("image uploaded|"+image.name);
    //setUserResponse("image uploaded|"+image.name);
    //send(value);

	//rasa send
	// rasa send
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// ========================== restart conversation ========================
function restartConversation() {
    //$("#userInput").prop('disabled', true);
    
    if (typeof chatChart !== 'undefined') { chatChart.destroy(); }

    $(".chatbot.chart-container").remove();
    if (typeof modalChart !== 'undefined') { modalChart.destroy(); }
    $(".chatbot.chats").html("");
    $(".chatbot.usrInput").val("");
    send("/stop");
    send("/restart");
    //sleep(2000).then(() => {
    send("ok wings")
    // Do something after the sleep!
    //});
}

function restartConversationInitial() {
    //$("#userInput").prop('disabled', true);
    
    if (typeof chatChart !== 'undefined') { chatChart.destroy(); }

    $(".chatbot.chart-container").remove();
    if (typeof modalChart !== 'undefined') { modalChart.destroy(); }
    $(".chatbot.chats").html("");
    $(".chatbot.usrInput").val("");
    
    send("/restart");
    setTimeout(function() {
        send("ok wings")
    },1000)
   
}

// ========================== let the bot start the conversation ========================
function action_trigger() {
    url_nya = url_link+":5005/conversations/${user_id}/execute"
    // send an event to the bot, so that bot can start the conversation by greeting the user
    $.ajax({
        url: url_nya,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ "name": action_name }),
        success: function(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

            if (botResponse.hasOwnProperty("messages")) {
                setBotResponse(botResponse.messages);
            }
            $("#userInput").prop('disabled', false);
        },
        error: function(xhr, textStatus, errorThrown) {

            // if there is no response from rasa server
            setBotResponse("");
            console.log("Error from bot end: ", textStatus);
            $("#userInput").prop('disabled', false);
        }
    });
}

//=====================================	user enter or sends the message =====================
$(".chatbot.usrInput").on("keyup keypress", function(e) {
    var keyCode = e.keyCode || e.which;

    var text = $(".chatbot.usrInput").val();
    if (keyCode === 13) {

        if (text == "" || $.trim(text) == "") {
            e.preventDefault();
            return false;
        } else {
            //destroy the existing chart, if yu are not using charts, then comment the below lines
            //$('.chatbot.collapsible').remove();
            //if (typeof chatChart !== 'undefined') { chatChart.destroy(); }

            //$(".chatbot.chart-container").remove();
            //if (typeof modalChart !== 'undefined') { modalChart.destroy(); }

            //$("#paginated_cards").remove();
            $(".chatbot.suggestions").remove();
            $(".chatbot.quickReplies").remove();
            $(".chatbot.usrInput").blur();
            setUserResponse(text);
            send(text);
            e.preventDefault();
            return false;
        }
    }
});

$("#sendButton").on("click", function(e) {
    var text = $(".chatbot.usrInput").val();
    if (text == "" || $.trim(text) == "") {
        alert("testx")
        e.preventDefault();
        return false;
    } else {
        //destroy the existing chart

        //chatChart.destroy();
        //$(".chatbot.chart-container").remove();
        //if (typeof modalChart !== 'undefined') { modalChart.destroy(); }

        $(".chatbot.suggestions").remove();
        //$("#paginated_cards").remove();
        $(".chatbot.quickReplies").remove();
        $(".chatbot.usrInput").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
    }
})

//==================================== Set user response =====================================
function setUserResponse(message) {
    var UserResponse = '<img class="chatbot userAvatar" src=' + "./static/img/userAvatar.jpg" + '><p class="chatbot userMsg">' + message + ' </p><div class="clearfix"></div>';
    $(UserResponse).appendTo(".chatbot.chats").show("slow");
    $(".chatbot.usrInput").val("");
    scrollToBottomOfResults();
    showBotTyping();
    $(".chatbot.suggestions").remove();
}

//=========== Scroll to the bottom of the chats after new message has been added to chat ======
function scrollToBottomOfResults() {

    var terminalResultsDiv = document.getElementById("chats");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

//============== send the user message to rasa server =============================================
function send(message) {
    url_nya = url_link+":5005/webhooks/rest/webhook"
    //sleep(2000).then(() => {
    $.ajax({
        url: url_nya,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ message: message, sender: user_id }),
        success: function(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

            // if user wants to restart the chat and clear the existing chat contents
            if (message.toLowerCase() == '/restart') {
                $("#userInput").prop('disabled', false);

                //if you want the bot to start the conversation after restart
                // action_trigger();
                return;
            }
            setBotResponse(botResponse);

        },
        error: function(xhr, textStatus, errorThrown) {

            if (message.toLowerCase() == '/restart') {
                // $("#userInput").prop('disabled', false);

                //if you want the bot to start the conversation after the restart action.
                // action_trigger();
                // return;
            }

            // if there is no response from rasa server
            setBotResponse("");
            console.log("Error from bot end: ", textStatus);
        }
    });
    // Do something after the sleep!
    //});
}

//=================== set bot response in the chats ===========================================
function setBotResponse(response) {
    //display bot response after 500 milliseconds
    setTimeout(function() {
        hideBotTyping();
        if (response.length < 1) {
            //if there is no response from Rasa, send  fallback message to the user
            var fallbackMsg = "Server mengalami kendala, tolong restart halaman";

            var BotResponse = '<img class="chatbot botAvatar" src="./static/img/sara_avatar.png"/><p class="chatbot botMsg">' + fallbackMsg + '</p><div class="chatbot clearfix"></div>';

            $(BotResponse).appendTo(".chatbot.chats").hide().fadeIn(1000);
            scrollToBottomOfResults();
        } else {

            //if we get response from Rasa
            for (i = 0; i < response.length; i++) {

                //check if the response contains "text"
                if (response[i].hasOwnProperty("text")) {
                    var BotResponse = '<img class="chatbot botAvatar" src="./static/img/sara_avatar.png"/><p class="chatbot botMsg"><span style="white-space: pre-line">' + response[i].text + '</span></p><div class="chatbot clearfix"></div>';
                    $(BotResponse).appendTo(".chatbot.chats").hide().fadeIn(1000);
                }

                //check if the response contains "images"
                if (response[i].hasOwnProperty("image")) {
                    imagesrc = response[i].image;
                    var BotResponse = '<div class="chatbot singleCardImage"><span class="chatbot modal-trigger imageexpand" id="expand" title="image expand" data-toggle="modal" data-target="#imageModal"><i class="chatbot fa fa-external-link" aria-hidden="true"></i></span>' + '<img class="chatbot imgcard" src="' + response[i].image+'">' + '</div><div class="chatbot clearfix"></div>';
                    $(BotResponse).appendTo(".chatbot.chats").hide().fadeIn(1000);
                }


                //check if the response contains "buttons" 
                if (response[i].hasOwnProperty("buttons")) {
                    addSuggestion(response[i].buttons);
                }

                //check if the response contains "attachment" 
                if (response[i].hasOwnProperty("attachment")) {

                    //check if the attachment type is "video"
                    if (response[i].attachment.type == "video") {
                        video_url = response[i].attachment.payload.src;

                        var BotResponse = '<div class="chatbot video-container"> <iframe src="' + video_url + '" frameborder="0" allowfullscreen></iframe> </div>'
                        $(BotResponse).appendTo(".chatbot.chats").hide().fadeIn(1000);
                    }

                }
                //check if the response contains "custom" message  
                if (response[i].hasOwnProperty("custom")) {

                    //check if the custom payload type is "quickReplies"
                    if (response[i].custom.payload == "quickReplies") {
                        quickRepliesData = response[i].custom.data;
                        showQuickReplies(quickRepliesData);
                        return;
                    }

                    //check if the custom payload type is "pdf_attachment"
                    if (response[i].custom.payload == "pdf_attachment") {

                        renderPdfAttachment(response[i]);
                        return;
                    }

                    //check if the custom payload type is "dropDown"
                    if (response[i].custom.payload == "dropDown") {
                        dropDownData = response[i].custom.data;
                        renderDropDwon(dropDownData);
                        return;
                    }

                    //check if the custom payload type is "location"
                    if (response[i].custom.payload == "location") {
                        $("#userInput").prop('disabled', true);
                        getLocation();
                        scrollToBottomOfResults();
                        return;
                    }

                    //check if the custom payload type is "cardsCarousel"
                    if (response[i].custom.payload == "cardsCarousel") {
                        restaurantsData = (response[i].custom.data)
                        showCardsCarousel(restaurantsData);
                        return;
                    }

                    //check if the custom payload type is "chart"
                    if (response[i].custom.payload == "chart") {

                        // sample format of the charts data:
                        // var chartData = { "title": "Leaves", "labels": ["Sick Leave", "Casual Leave", "Earned Leave", "Flexi Leave"], "backgroundColor": ["#36a2eb", "#ffcd56", "#ff6384", "#009688", "#c45850"], "chartsData": [5, 10, 22, 3], "chartType": "pie", "displayLegend": "true" }

                        //store the below parameters as global variable, 
                        // so that it can be used while displaying the charts in modal.
                        chartData = (response[i].custom.data)
                        title = chartData.title;
                        labels = chartData.labels;
                        backgroundColor = chartData.backgroundColor;
                        chartsData = chartData.chartsData;
                        chartType = chartData.chartType;
                        displayLegend = chartData.displayLegend;

                        // pass the above variable to createChart function
                        createChart(title, labels, backgroundColor, chartsData, chartType, displayLegend)
                        return;
                    }

                    //check of the custom payload type is "collapsible"
                    if (response[i].custom.payload == "collapsible") {
                        data = (response[i].custom.data);
                        //pass the data variable to createCollapsible function
                        createCollapsible(data);
                    }
                }
            }
            scrollToBottomOfResults();
        }
    }, 10);
}

//====================================== Toggle chatbot =======================================
function rightclick(event) {
    var rightclick;
    var e = window.event;
    if (e.which) rightclick = (e.which == 3);
    else if (e.button) rightclick = (e.button == 2);
    
    if (event.ctrlKey) {
        width_current =$('#profile_div')[0].style.width
        
        if(width_current == '5%'){
            $('#profile_div').css('width', '10%');
        }
        else{
            $('#profile_div').css('width', '5%');
        }
    }
    else {
        restartConversationInitial()
        $("#profile_div").toggle();
        $(".chatbot.widget").toggle();
    }
    

    
   

}
/*
$("#profile_div").click(function() {
    var e = window.event;
    if (e.which) rightclick = (e.which == 3);
    else if (e.button) rightclick = (e.button == 2);
    alert(rightclick); // true or false, you can trap right click here by if comparison
    if(rightclick == false){
        restartConversationInitial()
        $("#profile_div").toggle();
        $(".chatbot.widget").toggle();
    }
    else{
        alert("you pressed right click")

    }

    
});

*/





//====================================== Render Pdf attachment =======================================
function renderPdfAttachment(data) {
    pdf_url = data.custom.url;
    pdf_title = data.custom.title;
    pdf_attachment =
        '<div class="chatbot pdf_attachment">' +
        '<div class="chatbot row">' +
        '<div class="chatbot col s3 pdf_icon"><i class="chatbot fa fa-file-pdf-o" aria-hidden="true"></i></div>' +
        '<div class="chatbot col s9 pdf_link">' +
        '<a href="' + pdf_url + '" target="_blank">' + pdf_title + ' </a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $(".chatbot.chats").append(pdf_attachment);
    scrollToBottomOfResults();

}



//====================================== DropDown ==================================================
//render the dropdown messageand handle user selection
function renderDropDwon(data) {
    var options = "";
    for (i = 0; i < data.length; i++) {
        options += '<option value="' + data[i].value + '">' + data[i].label + '</option>'
    }
    var select = '<div class="chatbot dropDownMsg"><select class="chatbot browser-default dropDownSelect"> <option value="" disabled selected>Choose your option</option>' + options + '</select></div>'
    $(".chats").append(select);
    scrollToBottomOfResults();

    //add event handler if user selects a option.
    $("select").change(function() {
        var value = ""
        var label = ""
        $("select option:selected").each(function() {
            label += $(this).text();
            value += $(this).val();
        });

        setUserResponse(label);
        send(value);
        $(".chatbot.dropDownMsg").remove();
    });
}

//====================================== Suggestions ===========================================

function addSuggestion(textToAdd) {
    setTimeout(function() {
        var suggestions = textToAdd;
        var suggLength = textToAdd.length;
        $(' <div class="chatbot singleCard"> <div class="chatbot suggestions"><div class="chatbot menuChatbot"></div></div></diV>').appendTo(".chatbot.chats").hide().fadeIn(1000);
        // Loop through suggestions
        for (i = 0; i < suggLength; i++) {
            $('<div class="chatbot menuChips" data-payload=\'' + (suggestions[i].payload) + '\'>' + suggestions[i].title + "</div>").appendTo(".chatbot.menuChatbot");
        }
        scrollToBottomOfResults();
    }, 1000);
}

// on click of suggestions, get the value and send to rasa
$(document).on("click", ".chatbot.menuChatbot .menuChips", function() {
    var text = this.innerText;
    var payload = this.getAttribute('data-payload');
    console.log("payload: ", this.getAttribute('data-payload'))
    setUserResponse(text);
    send(payload);

    //delete the suggestions once user click on it
    $(".chatbot.suggestions").remove();

});

//====================================== functions for drop-down menu of the bot  =========================================

//restart function to restart the conversation.
$("#restart").click(function() {
    restartConversationInitial()
});

//clear function to clear the chat contents of the widget.
$("#clear").click(function() {
    $(".chatbot.chats").fadeOut("normal", function() {
        $(".chatbot.chats").html("");
        $(".chatbot.chats").fadeIn();
    });
    restartConversationInitial()
});

//close function to close the widget.
$("#close").click(function() {
    $("#profile_div").toggle();
    $(".chatbot.widget").toggle();
    $(".chatbot.chats").html("");

    restartConversationInitial()
   
   
});

//====================================== Cards Carousel =========================================

function showCardsCarousel(cardsToAdd) {
    var cards = createCardsCarousel(cardsToAdd);

    $(cards).appendTo(".chatbot.chats").show();


    if (cardsToAdd.length <= 2) {
        $(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(3000);
    } else {
        for (var i = 0; i < cardsToAdd.length; i++) {
            $(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(3000);
        }
        $(".cards .arrow.prev").fadeIn("10");
        $(".cards .arrow.next").fadeIn("10");
    }


    scrollToBottomOfResults();

    const card = document.querySelector("#paginated_cards");
    const card_scroller = card.querySelector(".cards_scroller");
    var card_item_size = 225;

    card.querySelector(".arrow.next").addEventListener("click", scrollToNextPage);
    card.querySelector(".arrow.prev").addEventListener("click", scrollToPrevPage);


    // For paginated scrolling, simply scroll the card one item in the given
    // direction and let css scroll snaping handle the specific alignment.
    function scrollToNextPage() {
        card_scroller.scrollBy(card_item_size, 0);
    }

    function scrollToPrevPage() {
        card_scroller.scrollBy(-card_item_size, 0);
    }

}

function createCardsCarousel(cardsData) {

    var cards = "";

    for (i = 0; i < cardsData.length; i++) {
        title = cardsData[i].name;
        ratings = Math.round((cardsData[i].ratings / 5) * 100) + "%";
        data = cardsData[i];
        item = '<div class="chatbot carousel_cards in-left">' + '<img class="chatbot cardBackgroundImage" src="' + cardsData[i].image + '"><div class="chatbot cardFooter">' + '<span class="chatbot cardTitle" title="' + title + '">' + title + "</span> " + '<div class="chatbot cardDescription">' + '<div class="chatbot stars-outer">' + '<div class="chatbot stars-inner" style="width:' + ratings + '" ></div>' + "</div>" + "</div>" + "</div>" + "</div>";

        cards += item;
    }

    var cardContents = '<div id="paginated_cards" class="chatbot cards"> <div class="chatbot cards_scroller">' + cards + '  <span class="chatbot arrow prev fa fa-chevron-circle-left "></span> <span class="chatbot arrow next fa fa-chevron-circle-right" ></span> </div> </div>';

    return cardContents;
}

//====================================== Quick Replies ==================================================

function showQuickReplies(quickRepliesData) {
    var chips = ""
    for (i = 0; i < quickRepliesData.length; i++) {
        var chip = '<div class="chatbot chip" data-payload=\'' + (quickRepliesData[i].payload) + '\'>' + quickRepliesData[i].title + '</div>'
        chips += (chip)
    }

    var quickReplies = '<div class="chatbot quickReplies">' + chips + '</div><div class="chatbot clearfix"></div>'
    $(quickReplies).appendTo(".chatbot.chats").fadeIn(1000);
    scrollToBottomOfResults();
    const slider = document.querySelector('.quickReplies');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });

}

// on click of quickreplies, get the value and send to rasa
$(document).on("click", ".chatbot.quickReplies .chip", function() {
    var text = this.innerText;
    var payload = this.getAttribute('data-payload');
    console.log("chip payload: ", this.getAttribute('data-payload'))
    setUserResponse(text);
    send(payload);

    //delete the quickreplies
    $(".chatbot.quickReplies").remove();

});

//====================================== Get User Location ==================================================
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getUserPosition, handleLocationAccessError);
    } else {
        response = "Geolocation is not supported by this browser.";
    }
}

function getUserPosition(position) {
    response = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
    console.log("location: ", response);

    //here you add the intent which you want to trigger 
    response = '/inform{"latitude":' + position.coords.latitude + ',"longitude":' + position.coords.longitude + '}';
    $("#userInput").prop('disabled', false);
    send(response);
    showBotTyping();
}

function handleLocationAccessError(error) {

    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.")
            break;
    }

    response = '/inform{"user_location":"deny"}';
    send(response);
    showBotTyping();
    $(".chatbot.usrInput").val("");
    $("#userInput").prop('disabled', false);


}

//======================================bot typing animation ======================================
function showBotTyping() {

    var botTyping = '<img class="chatbot botAvatar" id="botAvatar" src="./static/img/sara_avatar.png"/><div class="chatbot botTyping">' + '<div class="chatbot bounce1"></div>' + '<div class="chatbot bounce2"></div>' + '<div class="chatbot bounce3"></div>' + '</div>'
    $(botTyping).appendTo(".chatbot.chats");
    $('.botTyping').show();
    scrollToBottomOfResults();
}

function hideBotTyping() {
    $('#botAvatar').remove();
    $('.botTyping').remove();
}

//====================================== Collapsible =========================================

// function to create collapsible,
// for more info refer:https://materializecss.com/collapsible.html
function createCollapsible(data) {
    //sample data format:
    //var data=[{"title":"abc","description":"xyz"},{"title":"pqr","description":"jkl"}]
    list = "";
    for (i = 0; i < data.length; i++) {
        item = '<li>' +
            '<div class="chatbot collapsible-header">' + data[i].title + '</div>' +
            '<div class="chatbot collapsible-body"><span>' + data[i].description + '</span></div>' +
            '</li>'
        list += item;
    }
    var contents = '<ul class="chatbot collapsible">' + list + '</uL>';
    $(contents).appendTo(".chatbot.chats");

    // initialize the collapsible
    $('.collapsible').collapsible();
    scrollToBottomOfResults();
}


//====================================== creating Charts ======================================

//function to create the charts & render it to the canvas
function createChart(title, labels, backgroundColor, chartsData, chartType, displayLegend) {

    //create the ".chart-container" div that will render the charts in canvas as required by charts.js,
    // for more info. refer: https://www.chartjs.org/docs/latest/getting-started/usage.html
    var html = '<div class="chatbot chart-container"> <span class="chatbot modal-trigger expand" id="expand" title="expand" data-toggle="modal" data-target="#exampleModal"><i class="chatbot fa fa-external-link" aria-hidden="true"></i></span> <canvas id="chat-chart" ></canvas> </div> <div class="chatbot clearfix"></div>'
    $(html).appendTo('.chats');

    //create the context that will draw the charts over the canvas in the ".chart-container" div
    var ctx = $('#chat-chart');

    // Once you have the element or context, instantiate the chart-type by passing the configuration,
    //for more info. refer: https://www.chartjs.org/docs/latest/configuration/
    var data = {
        labels: labels,
        datasets: [{
            label: title,
            backgroundColor: backgroundColor,
            data: chartsData,
            fill: false
        }]
    };
    var options = {
        title: {
            display: true,
            text: title
        },
        layout: {
            padding: {
                left: 5,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        legend: {
            display: displayLegend,
            position: "right",
            labels: {
                boxWidth: 5,
                fontSize: 10
            }
        }
    }

    //draw the chart by passing the configuration
    chatChart = new Chart(ctx, {
        type: chartType,
        data: data,
        options: options
    });

    scrollToBottomOfResults();
}

// on click of expand button, get the chart data from gloabl variable & render it to modal
$(document).on("click", ".chatbot.expand", function() {

    //the parameters are declared gloabally while we get the charts data from rasa.
    createChartinModal(title, labels, backgroundColor, chartsData, chartType, displayLegend)
});

$(document).on("click", ".chatbot.imageexpand", function() {

    //the parameters are declared gloabally while we get the charts data from rasa.
    createImageinModal(imagesrc)
});
function createImageinModal(imagesrc){
    $("#my_image").attr("src",imagesrc);
    
}


//function to render the charts in the modal
function createChartinModal(title, labels, backgroundColor, chartsData, chartType, displayLegend) {
    //if you want to display the charts in modal, make sure you have configured the modal in index.html
    //create the context that will draw the charts over the canvas in the "#modal-chart" div of the modal
    var ctx = $('.chatbot.modal-chart');
    //alert(title)
    //alert(labels)


    // Once you have the element or context, instantiate the chart-type by passing the configuration,
    //for more info. refer: https://www.chartjs.org/docs/latest/configuration/
    var data = {
        labels: labels,
        datasets: [{
            label: title,
            backgroundColor: backgroundColor,
            data: chartsData,
            fill: false
        }]
    };
    var options = {
        title: {
            display: true,
            text: title
        },
        layout: {
            padding: {
                left: 5,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        legend: {
            display: displayLegend,
            position: "right"
        },

    }

    modalChart = new Chart(ctx, {
        type: chartType,
        data: data,
        options: options
    });

}
