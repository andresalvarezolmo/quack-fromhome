$(document).ready(function () 
{
    console.log("Jquery working");
    $("#answer").keypress(function (e) 
    {
        //enter as submit button
        if (e.which == 13) 
        {
            checkAnswer();
            console.log("Enter pressed");
        }
    });
});


//This will count the total points of each player
var pointCounter = 0;
//Each question points
var roundPoints = 0;
//This will count the total questions the user has anwered
var answeredQuestions = 0;
//
var selectedQuestion = 0;
var selectedCountry = 0;
//Petition URL
const petition1 = 'https://corona.lmao.ninja/v2/countries/';
const petition2 = '?yesterday&strict&query';
const questions = [
    //last day cases/deaths/
    //total cases/active cases/deaths/recovered/tests/population
    {
        enunciation: 'How many total cases of Covid-19 have been reported in ',
        property: 'cases',
        resultState: 'Total cases of Covid-19 in '  
    },
    {
        enunciation: 'How many total deaths by Covid-19 have been reported in ',
        property: 'deaths',
        resultState: 'Total deaths by Covid-19 reported in '
    },
    {
        enunciation: 'How many people have recovered from Covid-19 in ',
        property: 'recovered',
        resultState: 'Total people recovered from Covid-19 in '    
    },
    {
        enunciation: 'How many actives cases of Covid-19 are there in ',
        property: 'active',
        resultState: 'Total active cases of Covid-19 in '    
    },
    {
        enunciation: 'How many critical cases of Covid-19 are active in ',
        property: 'critical',
        resultState: 'Total critical cases of Covid-19 in '    
    },
    {
        enunciation: 'How many PCR tests have been done in ',
        property: 'tests',
        resultState: 'Total PCR tests done in '    
    },
    {
        enunciation: 'How many cases of Covid-19 per one million have been reported in ',
        property: 'casesPerOneMillion',
        resultState: 'Cases of Covid-19 per one million in '    
    },
    {
        enunciation: 'How many deaths of Covid-19 per one million have been reported in ',
        property: 'deathsPerOneMillion',
        resultState: 'Deaths of Covid-19 per on million in '    
    },
    {
        enunciation: 'What is the total population of ',
        property: 'population',
        resultState: 'Total population in '
    }
];

var questionCounterDiv = document.getElementById('questionCounterDiv');
async function generateQuestion(){
    $("#eachQuestion").css('display','block');
    $("#questionDiv").css('display','block');
    $("#questionButton").css('display','none');
    var question = document.getElementById('question');
    //Choose a random question by generating a random number
    selectedQuestion = Math.round(Math.random()*questions.length);
    selectedCountry = Math.round(Math.random()*countries[0].length);
    // console.log('This is the random question', selectedQuestion);
    // console.log('This is the random country',selectedCountry);
    // console.log('This is the random Country:', countries[0][selectedCountry-1].Country);
    // console.log('This is the question selected:', questions[selectedQuestion-1].enunciation);
    var finalQuestion = questions[selectedQuestion-1].enunciation + countries[0][selectedCountry-1].Country + '?';
    question.innerHTML = finalQuestion;
    $("#question").append(
        '<div class="text-center">'
        +'<img src="https://www.countryflags.io/' + countries[0][selectedCountry-1].ISO2 + '/flat/64.png">'
        +'</div>'
        );
}  

async function checkAnswer(){

    if(answeredQuestions==8){
        endGame();
        return;
    }
    var userAnswer = document.getElementById('answer').value;
    var intAnswer = parseInt(userAnswer);
    if(Number.isInteger(intAnswer) && intAnswer>=0){
        $("#wrongInput").css('display','none');
        console.log('Right');

        // get request
        await $.ajax({
            type: "GET",
            url: petition1+countries[0][selectedCountry-1].Country+petition2,
            beforeSend:function()
            {
                console.log("Loading...");
            },
            error: function(e)
            {
                console.log("Error happened", e);
            },
            success: (response) => {
                console.log('This is the response', response);
                // console.log(response[questions[0].property]);
                var result = response[questions[selectedQuestion-1].property];
                // console.log('Result:', result);
                document.getElementById('result').innerHTML= questions[selectedQuestion-1].resultState + countries[0][selectedCountry-1].Country + ':\n'+ response[questions[selectedQuestion-1].property];
                //Calculate results
                var coefficient = Math.abs((intAnswer-result)/result);
                console.log('Coefficient:', coefficient)
                var roundPointsDiv = document.getElementById('roundPointsDiv');
                var totalPointsDiv = document.getElementById('totalPointsDiv');
                var inputAnswer = document.getElementById('inputAnswer');

                //If you miss by a lot
                if(coefficient>=1){
                    console.log("You got 0 points, your answer was really imprecise :(");
                    // roundPointsDiv.innerHTML = 'Last round points: '+ roundPoints;
                    // totalPointsDiv.innerHTML = 'Total points: ' + pointCounter;
                }
                else{
                    roundPoints = Math.round(((1 - coefficient)*100));
                    pointCounter = Math.round(pointCounter + roundPoints);
                    // console.log('pointCounter',pointCounter);
                    // console.log('roundPoints', roundPoints);
                    // roundPointsDiv.innerHTML = 'Last round points: '+ roundPoints;
                    // totalPointsDiv.innerHTML = 'Total points: ' + pointCounter;
                    if(coefficient<=0.1){
                        console.log('You got all points, your accuracy was perfect');
                    }
                    else if(coefficient<=0.3){
                        console.log('You got a lot of points, your accuracy was very good');
                    }
                    else if(coefficient<=0.6){
                        console.log('You got some points, your accuracy was average');
                    }
                    else if(coefficient<=0.8){
                        console.log('You got a few points, your accuracy was below average');
                    }
                    else{
                        console.log('You got very few points, your results was imprecise');
                    }
                }
            }
        });
        document.getElementById('answer').value = '';
        inputAnswer.innerHTML = 'Your answer was: ' + intAnswer;
        roundPointsDiv.innerHTML = 'Last round points: '+ roundPoints;
        totalPointsDiv.innerHTML = 'Total points: ' + pointCounter;
        
        $("#eachQuestion").css('display','none');
        $("#questionButton").css('display','inline');

        answeredQuestions++;
    }
    else{
        $("#wrongInput").css('display','block');
        console.log("Wrong");
    }
}

function endGame(){
    // calculate results
    // show final screen
    $("#questionDiv").css('display','none');
    $("#roundPointsDiv").css('display','none');
    $("#totalPointsDiv").css('display','none');
    $("#results").css('display','block');
    var totalPoints = document.getElementById('totalPoints');
    totalPoints.innerHTML = 'You got: ' + pointCounter + ' points'
}

const countries = [
    [
        {
            "Country": "Western Sahara",
            "Slug": "western-sahara",
            "ISO2": "EH"
        },
        {
            "Country": "Georgia",
            "Slug": "georgia",
            "ISO2": "GE"
        },
        {
            "Country": "Iran, Islamic Republic of",
            "Slug": "iran",
            "ISO2": "IR"
        },
        {
            "Country": "Latvia",
            "Slug": "latvia",
            "ISO2": "LV"
        },
        {
            "Country": "United States of America",
            "Slug": "united-states",
            "ISO2": "US"
        },
        {
            "Country": "Oman",
            "Slug": "oman",
            "ISO2": "OM"
        },
        {
            "Country": "Dominican Republic",
            "Slug": "dominican-republic",
            "ISO2": "DO"
        },
        {
            "Country": "Egypt",
            "Slug": "egypt",
            "ISO2": "EG"
        },
        {
            "Country": "Lesotho",
            "Slug": "lesotho",
            "ISO2": "LS"
        },
        {
            "Country": "Sweden",
            "Slug": "sweden",
            "ISO2": "SE"
        },
        {
            "Country": "Rwanda",
            "Slug": "rwanda",
            "ISO2": "RW"
        },
        {
            "Country": "Azerbaijan",
            "Slug": "azerbaijan",
            "ISO2": "AZ"
        },
        {
            "Country": "Bulgaria",
            "Slug": "bulgaria",
            "ISO2": "BG"
        },
        {
            "Country": "Cameroon",
            "Slug": "cameroon",
            "ISO2": "CM"
        },
        {
            "Country": "Djibouti",
            "Slug": "djibouti",
            "ISO2": "DJ"
        },
        {
            "Country": "Estonia",
            "Slug": "estonia",
            "ISO2": "EE"
        },
        {
            "Country": "Grenada",
            "Slug": "grenada",
            "ISO2": "GD"
        },
        {
            "Country": "Aruba",
            "Slug": "aruba",
            "ISO2": "AW"
        },
        {
            "Country": "Central African Republic",
            "Slug": "central-african-republic",
            "ISO2": "CF"
        },
        {
            "Country": "Comoros",
            "Slug": "comoros",
            "ISO2": "KM"
        },
        {
            "Country": "Congo (Kinshasa)",
            "Slug": "congo-kinshasa",
            "ISO2": "CD"
        },
        {
            "Country": "Libya",
            "Slug": "libya",
            "ISO2": "LY"
        },
    
        {
            "Country": "Bolivia",
            "Slug": "bolivia",
            "ISO2": "BO"
        },
        {
            "Country": "Czech Republic",
            "Slug": "czech-republic",
            "ISO2": "CZ"
        },
        {
            "Country": "Slovenia",
            "Slug": "slovenia",
            "ISO2": "SI"
        },
        {
            "Country": "Russian Federation",
            "Slug": "russia",
            "ISO2": "RU"
        },
        {
            "Country": "Austria",
            "Slug": "austria",
            "ISO2": "AT"
        },
        {
            "Country": "Cape Verde",
            "Slug": "cape-verde",
            "ISO2": "CV"
        },
        {
            "Country": "Macao, SAR China",
            "Slug": "macao-sar-china",
            "ISO2": "MO"
        },
        {
            "Country": "Maldives",
            "Slug": "maldives",
            "ISO2": "MV"
        },
        {
            "Country": "Peru",
            "Slug": "peru",
            "ISO2": "PE"
        },
        {
            "Country": "Andorra",
            "Slug": "andorra",
            "ISO2": "AD"
        },
        {
            "Country": "Costa Rica",
            "Slug": "costa-rica",
            "ISO2": "CR"
        },
        {
            "Country": "Antigua and Barbuda",
            "Slug": "antigua-and-barbuda",
            "ISO2": "AG"
        },
        {
            "Country": "Moldova",
            "Slug": "moldova",
            "ISO2": "MD"
        },
        {
            "Country": "Turks and Caicos Islands",
            "Slug": "turks-and-caicos-islands",
            "ISO2": "TC"
        },
        {
            "Country": "United Arab Emirates",
            "Slug": "united-arab-emirates",
            "ISO2": "AE"
        },
        {
            "Country": "Algeria",
            "Slug": "algeria",
            "ISO2": "DZ"
        },
        {
            "Country": "Brunei Darussalam",
            "Slug": "brunei",
            "ISO2": "BN"
        },
        {
            "Country": "Jersey",
            "Slug": "jersey",
            "ISO2": "JE"
        },
        {
            "Country": "Niger",
            "Slug": "niger",
            "ISO2": "NE"
        },
        {
            "Country": "Kiribati",
            "Slug": "kiribati",
            "ISO2": "KI"
        },
        {
            "Country": "Chad",
            "Slug": "chad",
            "ISO2": "TD"
        },
        {
            "Country": "Cuba",
            "Slug": "cuba",
            "ISO2": "CU"
        },
        {
            "Country": "Monaco",
            "Slug": "monaco",
            "ISO2": "MC"
        },
        {
            "Country": "Bhutan",
            "Slug": "bhutan",
            "ISO2": "BT"
        },
        {
            "Country": "China",
            "Slug": "china",
            "ISO2": "CN"
        },
        {
            "Country": "Ethiopia",
            "Slug": "ethiopia",
            "ISO2": "ET"
        },
        {
            "Country": "French Guiana",
            "Slug": "french-guiana",
            "ISO2": "GF"
        },
        {
            "Country": "Holy See (Vatican City State)",
            "Slug": "holy-see-vatican-city-state",
            "ISO2": "VA"
        },
        {
            "Country": "Liberia",
            "Slug": "liberia",
            "ISO2": "LR"
        },
        {
            "Country": "Malta",
            "Slug": "malta",
            "ISO2": "MT"
        },
        {
            "Country": "Uganda",
            "Slug": "uganda",
            "ISO2": "UG"
        },
        {
            "Country": "Jordan",
            "Slug": "jordan",
            "ISO2": "JO"
        },
        {
            "Country": "Montenegro",
            "Slug": "montenegro",
            "ISO2": "ME"
        },
        {
            "Country": "Timor-Leste",
            "Slug": "timor-leste",
            "ISO2": "TL"
        },
        {
            "Country": "Belgium",
            "Slug": "belgium",
            "ISO2": "BE"
        },
        {
            "Country": "Isle of Man",
            "Slug": "isle-of-man",
            "ISO2": "IM"
        },
        {
            "Country": "Bangladesh",
            "Slug": "bangladesh",
            "ISO2": "BD"
        },
        {
            "Country": "New Zealand",
            "Slug": "new-zealand",
            "ISO2": "NZ"
        },
        {
            "Country": "Eritrea",
            "Slug": "eritrea",
            "ISO2": "ER"
        },
        {
            "Country": "Faroe Islands",
            "Slug": "faroe-islands",
            "ISO2": "FO"
        },
        {
            "Country": "Fiji",
            "Slug": "fiji",
            "ISO2": "FJ"
        },
        {
            "Country": "Nauru",
            "Slug": "nauru",
            "ISO2": "NR"
        },
        {
            "Country": "Barbados",
            "Slug": "barbados",
            "ISO2": "BB"
        },
        {
            "Country": "Nepal",
            "Slug": "nepal",
            "ISO2": "NP"
        },
        {
            "Country": "Madagascar",
            "Slug": "madagascar",
            "ISO2": "MG"
        },
        {
            "Country": "Mauritius",
            "Slug": "mauritius",
            "ISO2": "MU"
        },
        {
            "Country": "New Caledonia",
            "Slug": "new-caledonia",
            "ISO2": "NC"
        },
        {
            "Country": "Australia",
            "Slug": "australia",
            "ISO2": "AU"
        },
        {
            "Country": "Guinea",
            "Slug": "guinea",
            "ISO2": "GN"
        },
        {
            "Country": "Montserrat",
            "Slug": "montserrat",
            "ISO2": "MS"
        },
        {
            "Country": "Portugal",
            "Slug": "portugal",
            "ISO2": "PT"
        },
        {
            "Country": "Thailand",
            "Slug": "thailand",
            "ISO2": "TH"
        },
        {
            "Country": "Belarus",
            "Slug": "belarus",
            "ISO2": "BY"
        },
        {
            "Country": "Colombia",
            "Slug": "colombia",
            "ISO2": "CO"
        },
        {
            "Country": "Kyrgyzstan",
            "Slug": "kyrgyzstan",
            "ISO2": "KG"
        },
        {
            "Country": "Poland",
            "Slug": "poland",
            "ISO2": "PL"
        },
        {
            "Country": "Serbia",
            "Slug": "serbia",
            "ISO2": "RS"
        },
        {
            "Country": "Ukraine",
            "Slug": "ukraine",
            "ISO2": "UA"
        },
        {
            "Country": "Zambia",
            "Slug": "zambia",
            "ISO2": "ZM"
        },
        {
            "Country": "Italy",
            "Slug": "italy",
            "ISO2": "IT"
        },
        {
            "Country": "Romania",
            "Slug": "romania",
            "ISO2": "RO"
        },
        {
            "Country": "Uruguay",
            "Slug": "uruguay",
            "ISO2": "UY"
        },
        {
            "Country": "Yemen",
            "Slug": "yemen",
            "ISO2": "YE"
        },
        {
            "Country": "Spain",
            "Slug": "spain",
            "ISO2": "ES"
        },
        {
            "Country": "Pakistan",
            "Slug": "pakistan",
            "ISO2": "PK"
        },
        {
            "Country": "United Kingdom",
            "Slug": "united-kingdom",
            "ISO2": "GB"
        },
        {
            "Country": "Luxembourg",
            "Slug": "luxembourg",
            "ISO2": "LU"
        },
        {
            "Country": "Viet Nam",
            "Slug": "vietnam",
            "ISO2": "VN"
        },
        {
            "Country": "Afghanistan",
            "Slug": "afghanistan",
            "ISO2": "AF"
        },
        {
            "Country": "Guyana",
            "Slug": "guyana",
            "ISO2": "GY"
        },
        {
            "Country": "Papua New Guinea",
            "Slug": "papua-new-guinea",
            "ISO2": "PG"
        },
        {
            "Country": "Switzerland",
            "Slug": "switzerland",
            "ISO2": "CH"
        },
        {
            "Country": "Martinique",
            "Slug": "martinique",
            "ISO2": "MQ"
        },
        {
            "Country": "Palau",
            "Slug": "palau",
            "ISO2": "PW"
        },
        {
            "Country": "Israel",
            "Slug": "israel",
            "ISO2": "IL"
        },
        {
            "Country": "Slovakia",
            "Slug": "slovakia",
            "ISO2": "SK"
        },
        {
            "Country": "Tajikistan",
            "Slug": "tajikistan",
            "ISO2": "TJ"
        },
        {
            "Country": "Iceland",
            "Slug": "iceland",
            "ISO2": "IS"
        },
        {
            "Country": "Namibia",
            "Slug": "namibia",
            "ISO2": "NA"
        },
        {
            "Country": "Norway",
            "Slug": "norway",
            "ISO2": "NO"
        },
        {
            "Country": "Seychelles",
            "Slug": "seychelles",
            "ISO2": "SC"
        },
        {
            "Country": "South Sudan",
            "Slug": "south-sudan",
            "ISO2": "SS"
        },
        {
            "Country": "Sudan",
            "Slug": "sudan",
            "ISO2": "SD"
        },
        {
            "Country": "Armenia",
            "Slug": "armenia",
            "ISO2": "AM"
        },
        {
            "Country": "Chile",
            "Slug": "chile",
            "ISO2": "CL"
        },
        {
            "Country": "Croatia",
            "Slug": "croatia",
            "ISO2": "HR"
        },
        {
            "Country": "Jamaica",
            "Slug": "jamaica",
            "ISO2": "JM"
        },
        {
            "Country": "Senegal",
            "Slug": "senegal",
            "ISO2": "SN"
        },
        {
            "Country": "Kuwait",
            "Slug": "kuwait",
            "ISO2": "KW"
        },
        {
            "Country": "Myanmar",
            "Slug": "myanmar",
            "ISO2": "MM"
        },
        {
            "Country": "Puerto Rico",
            "Slug": "puerto-rico",
            "ISO2": "PR"
        },
        {
            "Country": "Argentina",
            "Slug": "argentina",
            "ISO2": "AR"
        },
        {
            "Country": "Brazil",
            "Slug": "brazil",
            "ISO2": "BR"
        },
        {
            "Country": "Turkey",
            "Slug": "turkey",
            "ISO2": "TR"
        },
        {
            "Country": "Ireland",
            "Slug": "ireland",
            "ISO2": "IE"
        },
        {
            "Country": "Trinidad and Tobago",
            "Slug": "trinidad-and-tobago",
            "ISO2": "TT"
        },
        {
            "Country": "Denmark",
            "Slug": "denmark",
            "ISO2": "DK"
        },
        {
            "Country": "Vanuatu",
            "Slug": "vanuatu",
            "ISO2": "VU"
        },
        {
            "Country": "Burkina Faso",
            "Slug": "burkina-faso",
            "ISO2": "BF"
        },
        {
            "Country": "Gabon",
            "Slug": "gabon",
            "ISO2": "GA"
        },
        {
            "Country": "Gambia",
            "Slug": "gambia",
            "ISO2": "GM"
        },
        {
            "Country": "Sierra Leone",
            "Slug": "sierra-leone",
            "ISO2": "SL"
        },
        {
            "Country": "El Salvador",
            "Slug": "el-salvador",
            "ISO2": "SV"
        },
        {
            "Country": "Suriname",
            "Slug": "suriname",
            "ISO2": "SR"
        },
        {
            "Country": "Greece",
            "Slug": "greece",
            "ISO2": "GR"
        },
        {
            "Country": "Lithuania",
            "Slug": "lithuania",
            "ISO2": "LT"
        },
        {
            "Country": "Malaysia",
            "Slug": "malaysia",
            "ISO2": "MY"
        },
        {
            "Country": "Mayotte",
            "Slug": "mayotte",
            "ISO2": "YT"
        },
        {
            "Country": "Turkmenistan",
            "Slug": "turkmenistan",
            "ISO2": "TM"
        },
        {
            "Country": "Honduras",
            "Slug": "honduras",
            "ISO2": "HN"
        },
        {
            "Country": "Kazakhstan",
            "Slug": "kazakhstan",
            "ISO2": "KZ"
        },
        {
            "Country": "Paraguay",
            "Slug": "paraguay",
            "ISO2": "PY"
        },
        {
            "Country": "Bosnia and Herzegovina",
            "Slug": "bosnia-and-herzegovina",
            "ISO2": "BA"
        },
        {
            "Country": "Cyprus",
            "Slug": "cyprus",
            "ISO2": "CY"
        },
        {
            "Country": "Macedonia, Republic of",
            "Slug": "macedonia",
            "ISO2": "MK"
        },
        {
            "Country": "South Africa",
            "Slug": "south-africa",
            "ISO2": "ZA"
        },
        {
            "Country": "Sri Lanka",
            "Slug": "sri-lanka",
            "ISO2": "LK"
        },
        {
            "Country": "Finland",
            "Slug": "finland",
            "ISO2": "FI"
        },
        {
            "Country": "Malawi",
            "Slug": "malawi",
            "ISO2": "MW"
        },
        {
            "Country": "Korea (South)",
            "Slug": "korea-south",
            "ISO2": "KR"
        },
        {
            "Country": "Liechtenstein",
            "Slug": "liechtenstein",
            "ISO2": "LI"
        },
        {
            "Country": "Belize",
            "Slug": "belize",
            "ISO2": "BZ"
        },
        {
            "Country": "Côte d'Ivoire",
            "Slug": "cote-divoire",
            "ISO2": "CI"
        },
        {
            "Country": "Indonesia",
            "Slug": "indonesia",
            "ISO2": "ID"
        },
        {
            "Country": "Somalia",
            "Slug": "somalia",
            "ISO2": "SO"
        },
        {
            "Country": "Tunisia",
            "Slug": "tunisia",
            "ISO2": "TN"
        },
        {
            "Country": "Iraq",
            "Slug": "iraq",
            "ISO2": "IQ"
        },
        {
            "Country": "Kenya",
            "Slug": "kenya",
            "ISO2": "KE"
        },

        {
            "Country": "Mali",
            "Slug": "mali",
            "ISO2": "ML"
        },
        {
            "Country": "Mexico",
            "Slug": "mexico",
            "ISO2": "MX"
        },
        {
            "Country": "Guam",
            "Slug": "guam",
            "ISO2": "GU"
        },
        {
            "Country": "Singapore",
            "Slug": "singapore",
            "ISO2": "SG"
        },
        {
            "Country": "Uzbekistan",
            "Slug": "uzbekistan",
            "ISO2": "UZ"
        },
        {
            "Country": "Equatorial Guinea",
            "Slug": "equatorial-guinea",
            "ISO2": "GQ"
        },
        {
            "Country": "France",
            "Slug": "france",
            "ISO2": "FR"
        },
        {
            "Country": "Morocco",
            "Slug": "morocco",
            "ISO2": "MA"
        },
        {
            "Country": "Panama",
            "Slug": "panama",
            "ISO2": "PA"
        },
        {
            "Country": "Burundi",
            "Slug": "burundi",
            "ISO2": "BI"
        },
        {
            "Country": "Ecuador",
            "Slug": "ecuador",
            "ISO2": "EC"
        },
        {
            "Country": "Lebanon",
            "Slug": "lebanon",
            "ISO2": "LB"
        },
        {
            "Country": "Mauritania",
            "Slug": "mauritania",
            "ISO2": "MR"
        },
        {
            "Country": "Netherlands",
            "Slug": "netherlands",
            "ISO2": "NL"
        },
        {
            "Country": "Taiwan, Republic of China",
            "Slug": "taiwan",
            "ISO2": "TW"
        },
        {
            "Country": "Angola",
            "Slug": "angola",
            "ISO2": "AO"
        },
        {
            "Country": "Nicaragua",
            "Slug": "nicaragua",
            "ISO2": "NI"
        },
        {
            "Country": "Philippines",
            "Slug": "philippines",
            "ISO2": "PH"
        },
        {
            "Country": "Tanzania, United Republic of",
            "Slug": "tanzania",
            "ISO2": "TZ"
        },
        {
            "Country": "Botswana",
            "Slug": "botswana",
            "ISO2": "BW"
        },
        {
            "Country": "Congo (Brazzaville)",
            "Slug": "congo-brazzaville",
            "ISO2": "CG"
        },
        {
            "Country": "Dominica",
            "Slug": "dominica",
            "ISO2": "DM"
        },
        {
            "Country": "Saudi Arabia",
            "Slug": "saudi-arabia",
            "ISO2": "SA"
        },
        {
            "Country": "Benin",
            "Slug": "benin",
            "ISO2": "BJ"
        },
        {
            "Country": "Mozambique",
            "Slug": "mozambique",
            "ISO2": "MZ"
        },
        {
            "Country": "Togo",
            "Slug": "togo",
            "ISO2": "TG"
        },
        {
            "Country": "Zimbabwe",
            "Slug": "zimbabwe",
            "ISO2": "ZW"
        },
        {
            "Country": "Canada",
            "Slug": "canada",
            "ISO2": "CA"
        },
        {
            "Country": "Ghana",
            "Slug": "ghana",
            "ISO2": "GH"
        },
        {
            "Country": "Guinea-Bissau",
            "Slug": "guinea-bissau",
            "ISO2": "GW"
        },
        {
            "Country": "Mongolia",
            "Slug": "mongolia",
            "ISO2": "MN"
        },
        {
            "Country": "San Marino",
            "Slug": "san-marino",
            "ISO2": "SM"
        },
        {
            "Country": "Albania",
            "Slug": "albania",
            "ISO2": "AL"
        },
        {
            "Country": "Anguilla",
            "Slug": "anguilla",
            "ISO2": "AI"
        },
        {
            "Country": "Bahamas",
            "Slug": "bahamas",
            "ISO2": "BS"
        },
        {
            "Country": "Hong Kong, SAR China",
            "Slug": "hong-kong-sar-china",
            "ISO2": "HK"
        },
        {
            "Country": "India",
            "Slug": "india",
            "ISO2": "IN"
        },
        {
            "Country": "Japan",
            "Slug": "japan",
            "ISO2": "JP"
        },
        {
            "Country": "Nigeria",
            "Slug": "nigeria",
            "ISO2": "NG"
        },
        {
            "Country": "Hungary",
            "Slug": "hungary",
            "ISO2": "HU"
        },
        {
            "Country": "Qatar",
            "Slug": "qatar",
            "ISO2": "QA"
        },
        {
            "Country": "Swaziland",
            "Slug": "swaziland",
            "ISO2": "SZ"
        },
        {
            "Country": "Cambodia",
            "Slug": "cambodia",
            "ISO2": "KH"
        },
        {
            "Country": "Germany",
            "Slug": "germany",
            "ISO2": "DE"
        },
        {
            "Country": "Guatemala",
            "Slug": "guatemala",
            "ISO2": "GT"
        },
        {
            "Country": "Haiti",
            "Slug": "haiti",
            "ISO2": "HT"
        }
    ]
]
