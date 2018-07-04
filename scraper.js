const request = require('request');
const cheerio = require('cheerio');
const Parser = require("google-search-parser2");
const parser = new Parser(request);

// exports.run = (db, uutisKanava, Discord) => {
    let url = 'http://www.ampparit.com/p%C3%A4%C3%A4uutiset';
    let data;

    // HAE VIIMEISIN OTSIKKO TIETOKANNASTA
    // KUN LÖYTYY JATKA VASTA SITTEN
    // NÄIN ESTETÄÄN TURHAA RULLAAMISTA YMS
    // 
    // haeTietokannasta
    //     .then( request... )

    request(url, function (error, response, html) {
        console.log("Haku alkaa.");
        let uutiset = [];
        let promises = [];

        if (!error) {


            let $ = cheerio.load(html);
            const content = $('.items-list-header').parent().children();
            const articles = content.filter(el => content[el].name === 'article');
            articles.find('a').each((i, el) => {
                if(i > 10) return;
                if($(el).hasClass('news-item-headline')){
                    let otsikko = $(el).text();
                    let linkki = $(el).attr('href');
                    console.log(otsikko);
                    
                    // Toimii, mutta turhaa käyttää debug vaiheessa
                    //kuvaHaku(otsikko).then(result => console.log(result));
                    let kuva = "http://static.tvtropes.org/pmwiki/pub/images/rsz_slow_4191_2781.gif"
                }
            });
        }
    })

    function postNewsOnDiscord(otsikko, linkki, kuva) {
        const embed = new Discord.RichEmbed()
        .setTitle(otsikko)
        .setColor("AQUA")
        .setImage(kuva)
        .setURL(linkki)
        .setTimestamp()
    
        uutisKanava.send({ embed }).catch(console.error);
    }

    function kuvaHaku(otsikko) {
        return new Promise(function (resolve, reject) {
            parser.parseImageUrls(otsikko, urls => {
                if (urls.length !== 0) {
                    resolve(urls[0].url);
                } else {
                    reject(err)
                }
            });
        })
    }
// }