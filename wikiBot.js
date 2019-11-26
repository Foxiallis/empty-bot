// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');

var yesArray = ["t", "T", "tak", "Tak", "y", "Y", "yes", "Yes"]
var noArray = ["n", "N", "nie", "Nie", "no", "No"]

class WikiBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            console.log(context.activity.text)
            var searchQuery = context.activity.text
            searchQuery.trim();
            const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
            await fetch(endpoint)
                .then(response => response.json())
                .then(data => {
                    const results = data.query.search;
                    results.forEach(result => {
                        const url = encodeURI(`https://en.wikipedia.org/wiki/${result.title}`);
                        console.log(context.sendActivity(`${result.title}`))
                    });
                })
                .catch(() => console.log('An error occurred'));
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Cześć!');
                    await context.sendActivity('Co chcesz wyszukać?');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.WikiBot = WikiBot;
