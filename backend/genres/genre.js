const yaml = require('js-yaml');
const fs   = require('fs');
const readline = require('readline');
const YAML = require('yaml');

let generate = async function() {
    let mainGenres = {
        "african": [],
        "blues": [],
        "country": ["singer-songwriter", "americana"],
        "classical": ["string", "quartet", "orchestr", "symphon", "band"],
        "comedy": [],
        "disco": [],
        "electronic": ["electro", "dub", "drum and bass", "eurodance", "hardcore", "edm", "trance", "techno"],
        "easy listening": ["chill", "groove", "light music", "elevator", "background", "lounge"],
        "folk": [],
        "funk": [],
        "hip hop": ["r&b", "hop"],
        "house": ["garage"],
        "jazz": ["swing"],
        "metal": ["emo", "grunge", "scream", "gothic"],
        "pop": [],
        "punk": ["ska"],
        "rap": [],
        "reggae": ["ragga", "dancehall"],
        "rock": ["psych"],
        "soul": [],
        "schlager": [],
        "indie": []
    };
    let genres = {};
    for (let name in mainGenres) {
        genres[name] = [];
    }
    let notFoundString = "";

    const fileStream = fs.createReadStream('./backend/genres-raw.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        let added = false;
        for (let genreName in genres) {

            let synonyms = mainGenres[genreName];
            let synIncludes = false;
            for (let syn of synonyms) {
                if (line.includes(syn)) {
                    synIncludes = true;
                }
            }

            if (synIncludes || line.includes(genreName)) {
                added = true;
                if (line !== genreName) {
                    genres[genreName].push(line);
                }
                break;
            }
        }
        if (!added) {
            notFoundString += line + "\n";
        }
    }

    // write to files
    let yamltext = YAML.stringify(genres);
    fs.writeFile("./backend/genres.yml", yamltext, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    fs.writeFile("./backend/notFoundGenres.txt", notFoundString, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
};

function getMain(genre) {
    const o = yaml.safeLoad(fs.readFileSync('./backend/genres.yml', 'utf8'));
    return searchRecursive(o, genre);
}

function searchRecursive(object, string) {
    for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (prop === string) {
                return prop;
            }
            for (let item of object[prop]) {
                if (typeof item === "object") {
                    let found = searchRecursive(item, string);
                    if (found) return found;
                } else if (item === string) {
                    return prop;
                }
            }
        }
    }
}

module.exports = {
    generate,
    getMain
};