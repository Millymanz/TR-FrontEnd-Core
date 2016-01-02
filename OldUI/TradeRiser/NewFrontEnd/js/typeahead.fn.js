(function ($) {
    $.fn.textWidth = function(text, font) {
        if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
        $.fn.textWidth.fakeEl.html(text || this.val() || this.text()).css('font', font || this.css('font'));
        return $.fn.textWidth.fakeEl.width();
    }

    $.fn.getCursorPosition = function() {
        var input = this.get(0);
        if (!input) return; // No (input) element found
        if ('selectionStart' in input) {
            // Standard-compliant browsers
            return input.selectionStart;
        } else if (document.selection) {
            // IE
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    }

    $("input, textarea")
    .bind('focus', function(){
        $(this).addClass('focus');
    })
    .bind('blur', function(){
        $(this).removeClass('focus');
    });  
    
})(jQuery);

var getCaretPixelPos = function ($node, offsetx, offsety){
    offsetx = offsetx || 0;
    offsety = offsety || 0;

    var nodeLeft = 0,
        nodeTop = 0;
    if ($node){
        nodeLeft = $node.offsetLeft;
        nodeTop = $node.offsetTop;
    }

    var pos = {left: 0, top: 0};

    if (document.selection){
        var range = document.selection.createRange();
        pos.left = range.offsetLeft + offsetx - nodeLeft + 'px';
        pos.top = range.offsetTop + offsety - nodeTop + 'px';
    } else if (window.getSelection){
        var sel = window.getSelection();
        var range = sel.getRangeAt(0).cloneRange();
        try{
            range.setStart(range.startContainer, range.startOffset-1);
        }catch(e){}
        var rect = range.getBoundingClientRect();
        if (range.endOffset == 0 || range.toString() === ''){
            // first char of line
            if (range.startContainer == $node){
                // empty div
                if (range.endOffset == 0){
                    pos.top = '0px';
                    pos.left = '0px';
                }else{
                    // firefox need this
                    var range2 = range.cloneRange();
                    range2.setStart(range2.startContainer, 0);
                    var rect2 = range2.getBoundingClientRect();
                    pos.left = rect2.left + offsetx - nodeLeft + 'px';
                    pos.top = rect2.top + rect2.height + offsety - nodeTop + 'px';
                }
            }else{
                pos.top = range.startContainer.offsetTop+'px';
                pos.left = range.startContainer.offsetLeft+'px';
            }
        }else{
            pos.left = rect.left + rect.width + offsetx - nodeLeft + 'px';
            pos.top = rect.top + offsety - nodeTop + 'px';
        }
    }
    return pos;
};

var calculateContentHeight = function( ta, scanAmount ) {
    var origHeight = ta.style.height,
        height = ta.offsetHeight,
        scrollHeight = ta.scrollHeight,
        overflow = ta.style.overflow;
    /// only bother if the ta is bigger than content
    if ( height >= scrollHeight ) {
        /// check that our browser supports changing dimension
        /// calculations mid-way through a function call...
        ta.style.height = (height + scanAmount) + 'px';
        /// because the scrollbar can cause calculation problems
        ta.style.overflow = 'hidden';
        /// by checking that scrollHeight has updated
        if ( scrollHeight < ta.scrollHeight ) {
            /// now try and scan the ta's height downwards
            /// until scrollHeight becomes larger than height
            while (ta.offsetHeight >= ta.scrollHeight) {
                ta.style.height = (height -= scanAmount)+'px';
            }
            /// be more specific to get the exact height
            while (ta.offsetHeight < ta.scrollHeight) {
                ta.style.height = (height++)+'px';
            }
            /// reset the ta back to it's original height
            ta.style.height = origHeight;
            /// put the overflow back
            ta.style.overflow = overflow;
            return height;
        }
    }
    else {
        return scrollHeight;
    }
}

var calculateHeight = function(id) {

    id = id.replace("#", "");

    var ta = document.getElementById(id),
        style = (window.getComputedStyle) ?
            window.getComputedStyle(ta) : ta.currentStyle,
        
        // This will get the line-height only if it is set in the css,
        // otherwise it's "normal"
        taLineHeight = parseInt(style.lineHeight, 10),
        // Get the scroll height of the textarea
        taHeight = calculateContentHeight(ta, taLineHeight),
        // calculate the number of lines
        numberOfLines = Math.floor(taHeight / taLineHeight);

        return numberOfLines+1;
};

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}


Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};