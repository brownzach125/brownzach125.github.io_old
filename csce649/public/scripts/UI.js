'use strict';
function getAllSliders() {
    var sliders = [];
    var htmlSliders = document.getElementsByClassName('slider');
    for (var i = 0; i < htmlSliders.length; i++) {
        var id = htmlSliders[i].id;
        var s = htmlSliders[i];
        var variableName = id.substring(0, id.indexOf("Slider"));
        var value = document.getElementById(variableName + "Value");
        var min = s.min;
        var max = s.max;
        var step = s.step;
        var valuestart;
        sliders.push(new SliderControl({
            slider: s,
            value: value,
            max: max,
            min: min,
            step: step,
            valuestart: valuestart,
            variableName: variableName
        }));
    }
    return sliders;
}
var SliderControl = (function () {
    function SliderControl(param) {
        this.callback = null;
        this.value = param.value;
        this.slider = param.slider;
        this.max = param.max;
        this.min = param.min;
        this.step = param.step;
        this.variableName = param.variableName;
        var that = this;
        that.slider.addEventListener('input', function () {
            that.onChangeSlider();
        });
        that.value.addEventListener('input', function () {
            that.onChangeValue();
        });
        if (this.max) {
            this.slider.max = this.max;
            this.value.max = this.max;
        }
        if (this.min) {
            this.slider.min = this.min;
            this.value.min = this.min;
        }
        if (this.step) {
            this.slider.step = this.step;
            this.value.step = this.step;
        }
        if (param.valuestart) {
            this.slider.value = param.valuestart;
        }
        this.value.value = this.slider.value;
    }
    SliderControl.prototype.setCallback = function (callback) {
        this.callback = callback;
    };
    SliderControl.prototype.onChangeSlider = function () {
        var value = this.slider.value;
        this.value.value = value; //('value', value);
        if (this.callback) {
            this.callback(value, this.variableName);
        }
    };
    SliderControl.prototype.onChangeValue = function () {
        var value = this.value.value;
        this.slider.value = value; //('value', value);
        if (this.callback) {
            this.callback(value, this.variableName);
        }
    };
    return SliderControl;
})();
//# sourceMappingURL=UI.js.map