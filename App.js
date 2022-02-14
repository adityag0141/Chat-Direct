const env = require("dotenv");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"))

const userID = [];
let name = [];
let nameIndex = "";
const language = [];
let count = -1;

const io = require("socket.io")(http);
io.on("connection", function (socket) {
    var id = socket.id;
    userID.push(id);
    var newUserName = name[count];
    for (let k = 0; k < language.length; k++) {

        // Google Translate API
        const { Translate } = require('@google-cloud/translate').v2;

        const translate = new Translate({
        });


        const text = "joined the chat";
        const target = language[k];

        async function translateText() {
            let [translations] = await translate.translate(text, target);
            translations = Array.isArray(translations) ? translations : [translations];
            translations.forEach((translation, i) => {
                socket.broadcast.to(userID[k]).emit("user-joined", `${translation}`,newUserName);
            });
        }

        translateText();
    }

    //User disconnected from the chat!

    socket.on("disconnect", function(message){
        for(var i=0; i<userID.length; i++){
            if(userID[i]==socket.id){
                nameIndex = i;
            }
        }
        for (let k = 0; k < language.length; k++) {

            // Google Translate API
            const { Translate } = require('@google-cloud/translate').v2;
    
            const translate = new Translate({
            });
    
    
            const text = "left the chat";
            const target = language[k];
    
            async function translateText() {
                let [translations] = await translate.translate(text, target);
                translations = Array.isArray(translations) ? translations : [translations];
                translations.forEach((translation, i) => {
                    socket.broadcast.to(userID[k]).emit("left", `${translation}`,name[nameIndex]);
                });
            }
    
            translateText();
        }

    })


    socket.on("send", function (message, socketID) {
        for(var i=0; i<userID.length; i++){
            if(userID[i]==socketID){
                nameIndex = i;
            }
        }
        for (let k = 0; k < language.length; k++) {

            // Google Translate API
            const { Translate } = require('@google-cloud/translate').v2;

            const translate = new Translate({
            });


            const text = message;
            const target = language[k];

            async function translateText() {
                let [translations] = await translate.translate(text, target);
                translations = Array.isArray(translations) ? translations : [translations];
                translations.forEach((translation, i) => {
                    socket.broadcast.to(userID[k]).emit("received", `${translation}`,name[nameIndex]);
                });
            }

            translateText();
        }
    })
});



app.get("/", function(req, res){
    res.sendFile(__dirname + "/chatroom.html");
})

app.get("/index.html", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", function (req, res) {
    name.push(req.body.username);

    language.push(req.body.language)
    count++;
    res.redirect("/index.html")
});



const PORT = process.env.PORT || 3000;

http.listen(PORT, function () {
    console.log("Server started at port:" + PORT)
})

