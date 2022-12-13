//
// New Title: Light Alarm
// adapted from Soso's Rainbow
//

// Global var
const w = helpers.canvas.width;
const h = helpers.canvas.height;
const rectWidth = w / 200;
let offset = 2;
const speed = 0.5;

// Setup
function setup() {
    createCanvas(w, h);
}

// Draw loop
function draw() {
    // Set the color mode to HSB to perform hue-specific calculations
    colorMode(HSB);
    let mood = generateMood();
    offset = makeGradient(w, h, rectWidth, offset, mood);
    // Reset the color mode to RGB to send data to the lights (required)
    colorMode(RGB);
}

// Supporting functions

/*
      generateMood: determines the mood according to time
    returns float of mood
    -1 means to display the default rainbow
    0 means calm: no event really
    1 means really hectic: you should really go
    values between 0 and 1 represent how chaotic it is
    the transition between 0 and -1 is accommodated via dimming the lights
*/
generateMood = function(){
    let d = calculateDay();
    let ho = hour();
    let mi = minute() + second()/60;
    if (d < 2 || ho >= 22){ //-1 for day or after 22pm
      return -1;
    }
    if (ho == 6 && mi >= 55){ //transition from -1 to 0 at 7 am
      return (mi-60)/5;
    }
    if (ho == 7 && mi < 50){ //keep mood at 0 at times until 7:50 to prevent abrupt change
        return 0;
    }
    if (ho <= 6){ //before 6am generic mood -1
            return -1;    
    }
    if (ho == 21 && mi >= 55){ //transition from 0 to -1 at 21.55
      return (55-mi)/5;
    }
    if (ho == 21 && mi > 7.5){ //prevent 9:30pm alarm
      return 0;
    }
    if (mi >= 22.5 && mi <= 37.5 && (ho != 21 && ho != 7)){ //mini alarm
            return abs(0.5 - (30-mi)/15);
    }
    if (mi >= 52.5 && ho != 21){ //big alarm
            return (mi-52.5)/7.5;
    }
    if (mi <= 7.5){ //big chaos
            return (7.5-mi)/7.5;
    }
    return 0;
}
/*
      calculateDay: p5 has no days (of week) function
    returns a number from 0 to 6
    0 = Saturday, 1 = Sunday and so on
*/
calculateDay = function(d){
    let dt = new Date();
    let day = dt.getDay();
    return (day+1)%7;
}

makeGradient = function(w, h, rectWidth, offs, mood) {
    if(offs > 22680){
      offs = offs % 22680;
        offset = offs;
    }
    if(mood <= -0.5){
        //simply makes a normal rainbow
      for (let x = 0; x < w; x += rectWidth) {
          let hue = x / w * 360;
            noStroke();
            fill(floor(abs(hue-offs)) % 360, 100, -100-200*mood);
            rect(x, 0, rectWidth, h);
      }
      return offs + speed;
    }
    if (mood<0) {
      for (let x = 0; x < w; x += rectWidth) {
            let hue = 270*(1-mood);
          let bri = x / w * 25;
            noStroke();
          fill(floor(abs(hue-30*Math.sin(0.1979*((x/rectWidth)+offs)))) % 360, 100, 200*mood+100);
            rect(x, 0, rectWidth, h);
      }
      return offs + (1+mood)*speed;
    }
    //set speed appropriate to mood
    for (let x = 0; x < w; x += rectWidth) {
      let hue = 270*(1-mood);
        let bri = x / w * 25;
        noStroke();
        fill(floor(abs(hue-30*Math.sin(0.1979*((x/rectWidth)+offs)))) % 360, 100, 100);
        rect(x, 0, rectWidth, h);
    }
    return offs + (1+mood)*speed;
}
