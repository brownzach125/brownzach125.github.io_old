function ToggleWordBlock(words) {
    var textBlock = document.getElementById("theTextBlock");
    var span = document.getElementById("words");

    function addWords() {
        setTimeout(function () {
            var spanWords = span.textContent;
            var spanWordsList = spanWords.split(" ");
            var wordsList = words.split(" ");
            var index = spanWordsList.length;
            span.textContent = span.textContent + " " + wordsList[index];
            if ( index < wordsList.length){
                addWords();
            }
        }, 1000);
    }

    var index = textBlock.className.indexOf("hidden");
    if ( index >= 0) {
        textBlock.className = textBlock.className.substring(0 , index);
        addWords();
    }
    else {
        textBlock.className += "hidden";
    }
}

