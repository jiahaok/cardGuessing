'use strict';

const socket = io(); //todo: fill in url

let ready = true;

let cards = [];

socket.on("auth", (from, message)=>{
    console.log(message+" from "+from);
    localStorage.setItem('auth', message.key);
});
socket.on("credit", (from, message)=>{
    console.log(message+" from "+from);
    if(typeof message.credit === "number"){
        gsetcredit(message.credit);
    }
    else{
        throw new TypeError("Invalid event from server");
    }
});
socket.on("choice", (from, message)=>{
    console.log(message+" from "+from);
    for(let i = 0;i<4;i++){
        if(i === message.CardWinner+1){
            cards[i].debugg_text = "win";
            cards[i].back = false;
            cards[i].lose = false;
            cards[i].win = true;
        }
        else{
            cards[i].debugg_text = "lose";
            cards[i].back = false;
            cards[i].lose = true;
            cards[i].win = false;
        }
    }
    if(message.isWinner){
        setOverlayText("Winner!");
    }
    else{
        setOverlayText("Better Luck Next Time");
    }
    ready = true;
});

let overlay = new Vue({
    el:"#overlay",
    data:{
        active: false,
        message:"test",
    },
    methods:{
        disable_overlay: ()=>{
            if(ready === true) {
                for (let i = 0; i < 4; i++) {
                    cards[i].debug_text = "back";
                    cards[i].back = true;
                    cards[i].lose = false;
                    cards[i].win = false;
                }
                setOverlay(false);
            }
        },
    },
});

cards[0] = new Vue({
    el:"#card1",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
        debug:false,
    },
    methods:{
        card_click: card_click_constructor(1),
    },
});

cards[1] = new Vue({
    el:"#card2",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
        debug:false,
    },
    methods:{
        card_click: card_click_constructor(2),
    },
});

cards[2] = new Vue({
    el:"#card3",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
        debug:false,
    },
    methods:{
        card_click: card_click_constructor(3),
    },
});

cards[3] = new Vue({
    el:"#card4",
    data:{
        debug_text:"down",
        back:true,
        win: false,
        lose:false,
        debug:false,
    },
    methods:{
        card_click: card_click_constructor(4),
    },
});

let credit = new Vue({
    el:"#credit",
    data:{
        credit:0,
    },
});

function card_click_constructor(cardNumber){
    return function(){
        console.log(cardNumber+" clicked");
        if(ready === true){
            ready = false;
            setOverlay(true);

        }
    }
}

// set or get how much credit is left, display only, unsecured
// @arg credit, number, amount of credit to display
function gsetcredit(credit){
    if(credit == undefined){
        return credit.credit;
    }
    credit.credit = credit;
}

// set overlay status
// @arg status, boolean,
function setOverlay(status){
    if(typeof status == "boolean"){
        overlay.active = status;
    }
    else{
        throw new Error("Overlay status not a boolean");
    }
}

function setOverlayText(text){
    if(typeof text == "Text"){
        overlay.message = text;
    }
    else{
        throw new Error("OverlayText not words");
    }
}

function setDebug(debug){
    if(typeof debug === "boolean"){
        for(let i=0;i<4;i++){
            cards[i].debug = debug;
        }
    }
    else{
        throw new TypeError("Debug need to be boolean value");
    }
}

function sendBet(bet,amount){
    if(typeof bet === "number" && typeof amount === "number"){
        socket.emit('choice', {bet:bet,amount:amount});
    }
    else{
        throw new TypeError("sendBet arguments must be number");
    }
}

function getCredit(){
    socket.emit('credit');
}