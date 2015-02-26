(function($, input, textarea, divArea, hidden, textWidthInput){

    // Durty hack for IE. If hide HIDDEN_INPUT -> position of .tt-dropdown-menu not set as needed
    if ($.browser.msie) {
        $("#hidden_typehead, #hidden_height_line, .tt-hint, .twitter-typeahead").offset(
            {left: -1000, top: -1000}
        );
        $("#hidden_typehead, #hidden_height_line, .tt-hint, .twitter-typeahead").show();
     }

    var activeContainer;

    var getLastLineWidth = function(container, text){
        var containerWidth = $(container).width();
        var words = text.split(" ");
        var startSlice = 0;
        var widthLine = 0;

        for (var s=0; s<=words.length; s++){
            $(textWidthInput).val(words.slice(startSlice, s).join(" ")+" ");
            if ($(textWidthInput).textWidth() > containerWidth){
                // widthLine = getLastLineWidth(container, words.slice(s).join(" "))
                startSlice = s-1;

            }
            $(textWidthInput).val(words.slice(startSlice, s).join(" ")+" ");

            widthLine = $(textWidthInput).textWidth();

            // console.log(words.slice(startSlice, s).join(" ")+" ");
        }

        return widthLine;
     }

    var getLastLineWidthFirefox = function(container, text){
        var containerWidth = $(container).width();
        var words = text.split(" ");
        var startSlice = 0;
        var widthLine = 0;

        for (var s=0; s<=words.length; s++){
            $(divArea).text((words.slice(startSlice, s).join(" ")+" ").replace(/\s/g, "\u00a0"))
            if ($(divArea).outerWidth() > containerWidth){
                startSlice = s-1;
            }
            $(divArea).text((words.slice(startSlice, s).join(" ")+" ").replace(/\s/g, "\u00a0"))
            widthLine = $(divArea).outerWidth();
            // console.log(words.slice(startSlice, s).join(" ")+" ", widthLine);
        }

        $(divArea).empty();

        return widthLine;
     }     

    var calculateHeightFirefox = function(container){

        var lines = $(container).val().split(/\r|\r\n|\n/);
        var containerWidth = $(container).width();
        var count = 0;

        var divDim = "#divLineLenght";
        // console.log(lines)

        for (var i = 0; i < lines.length; i++){

            $(divDim).text(lines[i].replace(/\s/g, "\u00a0"))
            var width = $(divDim).outerWidth();
            count += Math.ceil(width/containerWidth);
            $(divDim).empty();
            // console.log(count);
        }
        return count;
     }

    var setPositionWebkit = function(container){

        $(".tt-dropdown-menu").offset({
            top: -100,
            left: -100
        })

        var posCaret = $(container).getCaretPosition();

        var thisPos = $(container).offset();

        if ($(container).prop("tagName") === "TEXTAREA"){
            var heigthLines = $(container).css("line-height").replace('px', '') * calculateHeight(container);
            heigthLines = Math.min($(container).height(), heigthLines)
        }
        else {
            var heigthLines = parseInt($(container).css("line-height").replace('px', ''));
        }

        var margins = {
            top: parseInt($(".tt-dropdown-menu").css("marginTop").replace('px', '')) +
                 parseInt($(".tt-dropdown-menu").css("paddingTop").replace('px', '')),
            left: parseInt($(".tt-dropdown-menu").css("marginLeft").replace('px', '')) + 
                  parseInt($(".tt-dropdown-menu").css("paddingLeft").replace('px', ''))
        }

        var lastLineWidth = getLastLineWidth(container, $(container).val().split(/\r|\r\n|\n/).pop());

        var heigthLine = parseInt($(container).css("line-height").replace('px', ''));
        
        var left = thisPos.left + lastLineWidth + margins.left;
        var top = thisPos.top + heigthLines + margins.top;

        if (activeContainer === input) { // Input
            $(textWidthInput).val($(container).val());
            var len = $(textWidthInput).textWidth();

            if (len >= $(container).width()){
                left = $(container).width();
            }
        }

        $(".tt-dropdown-menu").offset({
            top: top,
            left: left
        })

     }

    var setPositionMozilla = function(container){

        var thisPos = $(container).offset();

        var heigthLines = $(container).css("line-height").replace('px', '') * calculateHeightFirefox(container);
        heigthLines = Math.min($(container).height(), heigthLines)

        // var margins = {
        //     top: parseInt($(".tt-dropdown-menu").css("marginTop").replace('px', '')) +
        //          parseInt($(".tt-dropdown-menu").css("paddingTop").replace('px', '')),
        //     left: parseInt($(".tt-dropdown-menu").css("marginLeft").replace('px', '')) + 
        //           parseInt($(".tt-dropdown-menu").css("paddingLeft").replace('px', ''))
        // }

        var lastLineWidth = getLastLineWidthFirefox(container, $(container).val().split(/\r|\r\n|\n/).pop());

        var left = thisPos.left + lastLineWidth // + margins.left;
        var top = thisPos.top + heigthLines // + margins.top;

        if (activeContainer === input) { // Input

            var positionPixels = $(container).getCaretPosition(); // Position of cursor in pixels

            var left = $(container).offset().left + positionPixels.left;
            var top = $(container).offset().top + $(container).height();

            $(textWidthInput).val($(container).val());
            var len = $(textWidthInput).textWidth();

            if (len >= $(container).width()){
                left = $(container).width();
            }
         }

        $(".tt-dropdown-menu").offset({
            top: top,
            left: left
        })

     }    

    var setPositionIE = function(container){

        $(".tt-dropdown-menu").offset({
            top: -100,
            left: -100
        })

        var positionPixels = $(container).getCaretPosition(); // Position of cursor in pixels

        var left = $(container).offset().left + positionPixels.left// - $(hidden).offset().left;
        var top = $(container).offset().top + positionPixels.top// - $(hidden).offset().top

        if (activeContainer === input) { // Input
            $(textWidthInput).val($(container).val());
            var len = $(textWidthInput).textWidth();

            if (len >= $(container).width()){
                left = $(container).width();
            }
        }

        $(".tt-dropdown-menu").offset({
            left: left,
            top: top            
        });
        $(".tt-dropdown-menu").show();
     }

    var hideAutocomplite = function(){
        $(".tt-dropdown-menu").css({
            display: "none"
        })        
     }

    var showAutocomplite = function(){
        $(".tt-dropdown-menu").css({
            display: "block"
        })        
     }    

    var inputChange = function(container){

        var positionSymbol = $(container).getCursorPosition(); // Position of cursor in symbols
        var allText = $(container).val()
        
        // Cursor in the end of text and last character is letter
        if (allText.length && positionSymbol == allText.length && allText.split("").pop().match(/\w/)){ 

            var suggest = allText.split(/\s|\r|\r\n|\n/).pop(); // Last word

            $(hidden).typeahead("setQuery", suggest); // Set suggest into hidden input
            var e = jQuery.Event("keydown");
            $(hidden).trigger(e); // Fire keydown event to open autocomplite menu

            if (suggest.length && $(".tt-suggestion").length){ // If qutocomplite exist -> shoe it and move it
                
                showAutocomplite();

                // console.log($.browser)

                if ($.browser.msie) {
                    setPositionIE(container);
                }

                else if ($.browser.webkit) {
                    setPositionWebkit(container);            
                }

                else if ($.browser.mozilla) {
                    setPositionMozilla(container);            
                }
            }
        }  
        else {
            hideAutocomplite();
        }

        $(input).val(allText);
        $(textarea).val(allText);

     }

    var keyUp = function(e, container){

        var arrEvt = [38, 40, 27, 37, 39]
        if (!~arrEvt.indexOf(e.keyCode)){
            // console.log(e.keyCode)
            // console.log(arrEvt.indexOf(e.keyCode))
                if ($.browser.msie){
                inputChange(activeContainer);
            }
        }  

        switch (e.keyCode){

            case 8: // Backspace
                if (!$(activeContainer).val() || $(activeContainer).val().split("").pop().match(/\s/)){
                    $(hidden).val("");
                }
                return;
        }
     }

    var keyDown = function(e, container){

        var evt = jQuery.Event("keydown");

        // console.log(e.keyCode)

        switch (e.keyCode){

            case 38: // Down
                evt.which = 38;
                $(hidden).trigger(evt);
                // Fix bug on open menu need 2 down press
                if (!$(".tt-is-under-cursor").length){
                    $(hidden).trigger(evt);
                }
                return false;

            case 40: // Up
                evt.which = 40;
                $(hidden).trigger(evt);
                // Fix bug on open menu need 2 down press
                if (!$(".tt-is-under-cursor").length){
                    $(hidden).trigger(evt);
                }
                return false;

            case 13: // Enter
                if ($(".tt-dropdown-menu").is(':visible')){
                    e.preventDefault();
                }
                evt.which = 13;
                $(hidden).trigger(evt);
                // console.log($(hidden).val())
                setText($(hidden).val())
                $(hidden).val("");
                return false;

            case 27: // Esc
                evt.which = 27;
                hideAutocomplite();
                return false;

            case 37: // Left
                hideAutocomplite();
                return false;           

            case 39: // Right
                hideAutocomplite();
                return false;
        }
     }

    var setText = function(textAdd){

        if (!textAdd){ return }

        var allText = $(textarea).val();

        var splitters = [
            allText.lastIndexOf(" "),
            allText.lastIndexOf("\n"),
            allText.lastIndexOf("\r"),
            allText.lastIndexOf("\r\n")
        ]
        var lastSplitter = splitters.max();

        var start = allText.substring(0, lastSplitter+1);

        $(hidden).val("")

        $(input).val(start + textAdd);
        $(textarea).val(start + textAdd);
     }

    var activeContainer;

// HIDDEN INPUT
    $(hidden)
    .typeahead({
        name: 'datum',
        prefetch: 'datum1Extended.json',
        template: [
            '<p class="autocomplite_lang {{addclass}}">{{language}}</p>',
            '<img class="autocomplite_img {{addclass}}" src="{{#image}}{{image}}{{/image}}{{^image}}data/blank.gif{{/image}}"></img>',
            '<p class="autocomplite_name {{addclass}}">{{name}}</p>',
            '<p class="autocomplite_desc {{addclass}}">{{description}}</p>',
        ].join(""),
        engine: Hogan
     })
    .bind("typeahead:selected", function(){ setText($(hidden).val()) })
    .bind("focus", function(){ $(hidden).trigger("blur") })

// INPUT
    $(input)
    .bind("focus", function(){
        activeContainer = input;
    })
    .bind("input", function(){
        inputChange(input);
    })
    .keydown(function(e){
        keyDown(e, input)
    })
    .keyup(function(e){
        keyUp(e, input);
    })      

// TEXTAREA
    $(textarea)
    .bind("focus", function(){
        activeContainer = textarea;
    })    
    .bind("input", function(){
        inputChange(textarea);
    })
    .keydown(function(e){
        keyDown(e, textarea);
    })
    .keyup(function(e){
        keyUp(e, textarea);
    })  

})(window.jQuery, '#testIndex', '#textArea', "#divTextArea", "#hidden_typehead", "#hidden_height_line");