function ToggleWordBlock(words , hide) {
    var textBlock = document.getElementById("theTextBlock");
    var span = document.getElementById("words");
    span.textContent = words;

    function toggleHidden() {
        var index = textBlock.className.indexOf("hidden");
        if ( index >= 0 && !hide) {
            textBlock.className = textBlock.className.substring(0 , index);
        }
        else if( index < 0) {
            textBlock.className += "hidden";
        }
    }


    toggleHidden();
    setTimeout( toggleHidden , 4000);

}

/*



function ToggleWordBlock(words , hide) {
    var textBlock = document.getElementById("theTextBlock");
    var span = document.getElementById("words");
    span.textContent = "";

    var count =0;
    function addWords() {
        setTimeout(function () {
            var spanWords = span.textContent;

            var index = count;
            span.textContent = span.textContent + words[count];
            count++;
            if ( index < words.length - 1){
                addWords();
            }
        }, 50);
    }

    var index = textBlock.className.indexOf("hidden");
    if ( index >= 0 && !hide) {
        textBlock.className = textBlock.className.substring(0 , index);
        setTimeout( function() {
            addWords();
        } , 1000)
    }
    else if( index < 0) {
        textBlock.className += "hidden";
    }
}

function setBlockText(words) {
    var textBlock = document.getElementById("theTextBlock");
    var span = document.getElementById("words");
    span.textContent = "";

    var count =0;
    function addWords() {
        setTimeout(function () {
            var spanWords = span.textContent;

            var index = count;
            span.textContent = span.textContent + words[count];
            count++;
            if ( index < words.length - 1){
                addWords();
            }

        }, 50);
    }

    addWords();
}
*/