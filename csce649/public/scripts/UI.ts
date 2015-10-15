'use strict'

class SliderControl {
    value;
    slider;
    max;
    min;
    step;
    public callback: (value: number ) => void = null;
    constructor(param) {
        this.value  = param.value;
        this.slider = param.slider;
        this.max    = param.max;
        this.min    = param.min;
        this.step   = param.step;

        var that = this;
        that.slider.addEventListener('input' , function(){
            that.onChangeSlider();
        });
        that.value.addEventListener('input' , function(){
            that.onChangeValue();
        });

        if ( this.max ) {
            this.slider.max = this.max;
            this.value.max = this.max;
        }
        if (this.min ) {
            this.slider.min = this.min;
            this.value.min = this.min;
        }
        if ( this.step) {
            this.slider.step = this.step;
            this.value.step = this.step;
        }
        if ( param.valuestart){
            this.slider.value = param.valuestart;
        }
        this.value.value = this.slider.value;
    }
    setCallback( callback: (value: number ) => void ) {
        this.callback = callback;
    }
    onChangeSlider() {
        var value = this.slider.value;
        this.value.value = value; //('value', value);
        if ( this.callback ) {
            this.callback(value);
        }
    }
    onChangeValue() {
        var value = this.value.value;
        this.slider.value = value; //('value', value);
        if ( this.callback ) {
            this.callback(value);
        }
    }
}