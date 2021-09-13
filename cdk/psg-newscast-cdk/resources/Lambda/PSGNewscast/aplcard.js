const APLHomeCardRequestInterceptor = {
    process(handlerInput) {
        const withSimpleCard = handlerInput.responseBuilder.withSimpleCard;
        const withStandardCard = handlerInput.responseBuilder.withStandardCard;
        console.log("payload: ",handlerInput);
        console.log("payload2: ",handlerInput.context.succeed);
        function withSimpleAPLCard(cardTitle, cardContent, footContent){
            if(supportsAPL(handlerInput)){
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.0',
                    document: APLDoc,
                    datasources: {
                        templateData: {
                            "header": cardTitle,
                            "text": cardContent,
                            "footer": footContent,
                            // default background for simple card
                            "backgroundSmall": "",
                            //"backgroundLarge": "https://i.etsystatic.com/11598164/r/il/a180b4/824313786/il_1588xN.824313786_qt51.jpg",
                            "backgroundLarge": "https://w0.peakpx.com/wallpaper/26/11/HD-wallpaper-psg-french-football-club-logo-blue-fabric-background-t-shirt-emblem-paris-saint-germain-france-football.jpg",
                            "headerAttributionImage": "https://nationaldailyng.com/wp-content/uploads/2019/06/AS.png"
                        }
                    }
                })
            }
            withSimpleCard(cardTitle, cardContent);
            return handlerInput.responseBuilder;
        }
        function withStandardAPLCard(cardTitle, cardContent, smallImageUrl, largeImageUrl){
            if(supportsAPL(handlerInput)){
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.0',
                    document: APLDoc,
                    datasources: {
                        templateData: {
                            "header": cardTitle,
                            "text": cardContent,
                            "backgroundSmall": smallImageUrl,
                            "backgroundLarge": largeImageUrl
                        }
                    }
                })
            }
            withStandardCard(cardTitle, cardContent, smallImageUrl, largeImageUrl);
            return handlerInput.responseBuilder;
        }
        handlerInput.responseBuilder.withSimpleCard = (...args) => withSimpleAPLCard(...args);
        handlerInput.responseBuilder.withStandardCard = (...args) => withStandardAPLCard(...args);
    }
}

function supportsAPL(handlerInput){
    const {supportedInterfaces} = handlerInput.requestEnvelope.context.System.device;
    return supportedInterfaces['Alexa.Presentation.APL'];
}

function deviceType(handlerInput){
    if(supportsAPL(handlerInput)){
        const {Viewport} = handlerInput.requestEnvelope.context;
        const resolution = Viewport.pixelWidth + 'x' + Viewport.pixelHeight;
        switch(resolution){
            case "480x480": return "EchoSpot";
            case "960x480": return "EchoShow5";
            case "1024x600": return "EchoShow";
            case "1200x800": return "FireHD8";
            case "1280x800": return "EchoShow2";
            case "1920x1080": return "FireTV";
            case "1920x1200": return "FireHD10";
            default: return "unknown";
        }
    } else {
        return "screenless";
    }
}

const APLDoc = 
{
    "type": "APL",
    "version": "1.7",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "theme": "dark",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.4.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "item": [
            {
                "type": "AlexaHeadline",
                "id": "PlantHeadline",
                "primaryText": "${payload.templateData.text}",
                "headerBackButton": false,
                "headerAttributionImage": "${payload.templateData.headerAttributionImage}",
                "headerAttributionPrimacy": true,
                "footerHintText": "${payload.templateData.footer}",
                "backgroundImageSource": "${viewport.shape == 'round' || !payload.templateData.backgroundLarge ? payload.templateData.backgroundSmall : payload.templateData.backgroundLarge}",
                "backgroundColorOverlay": true,
                "speech": "${payload.headlineTemplateData.properties.welcomeSpeech}"
            }
        ]
    },
    "onMount": [
        {
            "type": "SpeakItem",
            "componentId": "PlantHeadline"
        }
    ]
}

module.exports = {
    APLHomeCardRequestInterceptor
}