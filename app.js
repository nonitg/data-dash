// IB Geography IA Survey Dashboard

// Main data storage
let surveyData = [];
let filteredData = [];
let currentPage = 1;
const rowsPerPage = 10;
let mainChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load the CSV data
    loadData();
    
    // Set up event listeners
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('chartType').addEventListener('change', updateChart);
    document.getElementById('xAxisSelect').addEventListener('change', updateChart);
    document.getElementById('yAxisSelect').addEventListener('change', updateChart);
    document.getElementById('groupBySelect').addEventListener('change', updateChart);
    document.getElementById('calculateCorrelation').addEventListener('click', calculateCorrelation);
    document.getElementById('btnExportCSV').addEventListener('click', exportFilteredDataToCSV);
});

// Load and parse the CSV data
async function loadData() {
    try {
        // Display loading message
        document.getElementById('datasetInfo').innerHTML = '<div class="alert alert-info">Loading data...</div>';
        
        // Load CSV content directly as a string (pre-embedded in this file)
        const csvText = `Id,What is your age?,What is your gender?,What best describes your relationship status?,"On a scale of 1-15, 1 being not religious at all, and 15 being very religious, please identify how religious you are:",What is your highest level of education?,What is your gross annual household income?,What country/culture do you most identify with? (ex. Canada/Canadian),"On a scale of 1-15, 1 being not at all and 15 being completely, how important is having children to you?",10) What is your ideal number of children?,How many biological children do you have?,How many biological siblings do you have?,"On a scale of 1-15 (1 being no influence, 15 being very influential) how much influence do you have over family planning decisions?",Rank the factors that most influence your decision to have biological children and rank them from 1- 8 (1 being most influential and 8 being least influential):,Standardized_Religion
69,19-24,Female,In a relationship,4,Bachelor,"$50,000 � $74,999",English/Uk,1,Zero,Zero,Four,4,Income;Employment Status;Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Health;Time/Help Availability;Religion;,Christian
100,35-39,Female,Married,1,Bachelor,"$50,000 � $74,999",Chinese,1,Two,Zero,One,1,Personal Choice;Personal Health;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Religion;Significant Other�s Opinion;,
247,0-18,Female,Single,12,No High School Diploma,"$250,000 � $299,999",India/Hindu,1,Zero,Zero,One,12,Personal Choice;Personal Health;Income;Relationship Status (or lack thereof);Time/Help Availability;Religion;Employment Status;Significant Other�s Opinion,Hindu
4,0-18,Female,Single,2,No High School Diploma,"Under $50,000",Canadian,1,Zero,Zero,One,14,Personal Health;Personal Choice;Income;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Religion;Significant Other�s Opinion;,Christian
147,0-18,Male,Single,1,High School Diploma,"$50,000 � $74,999",Canadian ,1,Zero,Zero,One,2,Significant Other�s Opinion;Income;Personal Health;Relationship Status (or lack thereof);Time/Help Availability;Personal Choice;Employment Status;Religion,Atheist
275,0-18,Female,Single,2,No High School Diploma,"$50,000 � $74,999",Korea/Korean,1,Zero,Zero,One,3,Personal Choice;Time/Help Availability;Income;Personal Health;Significant Other�s Opinion;Relationship Status (or lack thereof);Employment Status;Religion,
18,25-29,Female,Common-law,1,Bachelor,"$150,000 � $199,999",canada,1,Zero,Zero,One,5,Personal Choice;Significant Other�s Opinion;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Religion;,Agnostic
45,0-18,Male,In a relationship,9,High School Diploma,"Under $50,000",Filipino/Canadian,1,One,Zero,One,5,Personal Health;Employment Status;Time/Help Availability;Personal Choice;Income;Religion;Relationship Status (or lack thereof);Significant Other�s Opinion;,Catholic
132,25-29,Female,Single,1,High School Diploma,"$50,000 � $74,999",Canada/Canadian,1,Zero,Zero,One,5,Personal Choice;Personal Health;Income;Significant Other�s Opinion;Time/Help Availability;Employment Status;Relationship Status (or lack thereof);Religion,Atheist
9,0-18,Female,Single,2,No High School Diploma,"Under $50,000",Korean/Canadian,1,Zero,Zero,One,6,Personal Choice;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Religion;Income;Significant Other�s Opinion;,Catholic
6,0-18,Female,Single,3,High School Diploma,"$100,000 � $149,999",,1,Zero,Zero,One,9,Income;Personal Choice;Personal Health;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Significant Other�s Opinion;Religion;,
70,50-54,Female,Single,5,High School Diploma,"$75,000 � $99,999",Canada,1,Two,Zero,Three,1,Relationship Status (or lack thereof);Personal Choice;Income;Employment Status;Religion;Time/Help Availability;Personal Health;Significant Other�s Opinion;,Sikh
54,25-29,Female,In a relationship,1,Bachelor,"$50,000 � $74,999",Canadian,1,Zero,Zero,Three,15,Personal Choice;Income;Time/Help Availability;Employment Status;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Health;Religion;,Christian
90,19-24,Non binary,In a relationship,4,High School Diploma,"Under $50,000",Canada/ indigenous ,1,Zero,Zero,Three,15,Personal Choice;Employment Status;Time/Help Availability;Personal Health;Income;Significant Other�s Opinion;Relationship Status (or lack thereof);Religion;,Other (specify: Indigenous)
113,19-24,Transition sex,Divorced,15,High School Diploma,"$75,000 � $99,999",Israel,1,Six,Zero,Three,15,Religion;Income;Relationship Status (or lack thereof);Employment Status;Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion,Muslim/Islam
112,0-18,Male,Single,1,No High School Diploma,,Canada/Canadian,1,One,Zero,Two,1,Income;Religion;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Personal Health;Personal Choice;Significant Other�s Opinion,
138,50-54,Male,Common-law,2,High School Diploma,"$150,000 � $199,999",canada,1,Zero,Zero,Two,5,Personal Choice;Significant Other�s Opinion;Time/Help Availability;Personal Health;Income;Relationship Status (or lack thereof);Employment Status;Religion,Agnostic
232,35-39,Male,Married,10,Bachelor,"$50,000 � $74,999",American,1,Zero,Zero,Two,7,Personal Choice;Significant Other�s Opinion;Time/Help Availability;Personal Health;Employment Status;Religion;Income;Relationship Status (or lack thereof),Catholic
204,35-39,Female,Married,1,High School Diploma,"$150,000 � $199,999",Canada,1,Zero,Zero,Two,8,Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Choice;Personal Health;Time/Help Availability;Income;Employment Status;Religion,Agnostic
36,19-24,Male,Single,1,High School Diploma,"Under $50,000",Ukraine/Ukrainian ,1,Zero,Zero,Zero,8,Income;Significant Other�s Opinion;Employment Status;Relationship Status (or lack thereof);Personal Choice;Personal Health;Time/Help Availability;Religion;,Atheist
304,25-29,Female,Single,1,Bachelor,"Under $50,000",Korean,1,Two,Zero,One,10,Personal Choice;Personal Health;Time/Help Availability;Relationship Status (or lack thereof);Income;Employment Status;Religion;Significant Other�s Opinion,Agnostic
321,35-39,Female,Single,1,Bachelor,"$75,000 � $99,999",Canadian ,1,Zero,Zero,Five,6,Personal Choice;Religion;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion,
260,70+,Male,Married,10,Trades: Journeyman,"Under $50,000",Canada,10,Four,Three,Four,7,Personal Choice;Income;Religion;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Significant Other�s Opinion;Personal Health,Christian
187,45-49,Male,Common-law,1,Trades: Red Seal,"$150,000 � $199,999",Canadian,10,Two,Zero,One,10,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Time/Help Availability;Employment Status;Income;Personal Health;Religion,Agnostic
34,25-29,Female,In a relationship,2,Master,"$75,000 � $99,999",Canadian,10,Two,Zero,One,12,Personal Choice;Significant Other�s Opinion;Income;Relationship Status (or lack thereof);Employment Status;Personal Health;Time/Help Availability;Religion;,Christian
173,30-34,Female,In a relationship,5,Bachelor,"$150,000 � $199,999",Canadian,10,Two,Zero,One,13,Personal Choice;Relationship Status (or lack thereof);Personal Health;Significant Other�s Opinion;Income;Time/Help Availability;Employment Status;Religion,
195,30-34,Female,Common-law,2,Bachelor,"$50,000 � $74,999",Uk,10,Two,Zero,One,13,Personal Choice;Income;Employment Status;Personal Health;Relationship Status (or lack thereof);Time/Help Availability;Significant Other�s Opinion;Religion,Spiritual
60,55-59,Female,Single,15,High School Diploma,"$150,000 � $199,999",Canada Canadian ,10,Two,Two,One,15,Personal Choice;Personal Health;Relationship Status (or lack thereof);Significant Other�s Opinion;Time/Help Availability;Income;Employment Status;Religion;,Christian
1,0-18,Male,Single,10,No High School Diploma,,Latin,10,Two,Zero,One,2,Personal Health;Employment Status;Income;Religion;Time/Help Availability;Relationship Status (or lack thereof);Personal Choice;Significant Other�s Opinion;,Catholic
48,0-18,Male,In a relationship,1,No High School Diploma,"$150,000 � $199,999",Canadian ,10,One,Zero,One,3,Personal Choice;Religion;Income;Personal Health;Relationship Status (or lack thereof);Employment Status;Significant Other�s Opinion;Time/Help Availability;,
91,0-18,Female,Single,8,No High School Diploma,"$50,000 � $74,999",canadian,10,Two,Zero,One,5,Income;Religion;Employment Status;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion;,Catholic
129,0-18,Female,Single,1,High School Diploma,"$75,000 � $99,999",Canadian,10,Two,Zero,One,6,Personal Choice;Employment Status;Income;Personal Health;Time/Help Availability;Significant Other�s Opinion;Relationship Status (or lack thereof);Religion,Atheist
136,0-18,Male,Single,7,No High School Diploma,"$100,000 � $149,999",Vietnamese,10,Two,Zero,One,7,Income;Relationship Status (or lack thereof);Employment Status;Personal Health;Personal Choice;Religion;Time/Help Availability;Significant Other�s Opinion,Christian
158,35-39,Male,Married,2,Master,"$150,000 � $199,999",SriLanka,10,Two,One,One,7,Significant Other�s Opinion;Personal Choice;Income;Relationship Status (or lack thereof);Time/Help Availability;Employment Status;Personal Health;Religion,Buddhist
273,0-18,Male,Single,10,No High School Diploma,"Under $50,000",Indian,10,Two,Zero,Three,10,Employment Status;Personal Choice;Relationship Status (or lack thereof);Religion;Income;Personal Health;Time/Help Availability;Significant Other�s Opinion,Catholic
118,65-69,Female,Single,3,High School Diploma,"Under $50,000",Canada/Canadian,10,One,Zero,Three,15,Personal Choice;Relationship Status (or lack thereof);Personal Health;Income;Employment Status;Time/Help Availability;Religion;Significant Other�s Opinion,Christian
211,35-39,Male,Married,1,Master,"$75,000 � $99,999",Canadian,10,Two,One,Three,7,Personal Choice;Income;Relationship Status (or lack thereof);Time/Help Availability;Significant Other�s Opinion;Employment Status;Personal Health;Religion,None
192,25-29,Female,Divorced,11,Trades: Red Seal,"$250,000 � $299,999",Chinese ,10,Four,Three,Three,9,Income;Religion;Time/Help Availability;Personal Health;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Choice;Employment Status,
67,30-34,Male,In a relationship,2,Trades: Red Seal,"$75,000 � $99,999",Canadian,10,Two,Zero,Two,12,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Health;Time/Help Availability;Income;Employment Status;Religion;,Atheist
175,45-49,Male,In a relationship,1,High School Diploma,"Under $50,000",Canada,10,Four,Three,Two,12,Personal Choice;Employment Status;Significant Other�s Opinion;Income;Relationship Status (or lack thereof);Personal Health;Time/Help Availability;Religion,
142,30-34,Female,In a relationship,9,Master,"$50,000 � $74,999",Canada/Canadian,10,One,Zero,Two,15,Significant Other�s Opinion;Personal Health;Personal Choice;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Religion,Christian
196,50-54,Female,Single,2,Bachelor,"$75,000 � $99,999",Canada,10,Two,Two,Two,15,Personal Choice;Personal Health;Significant Other�s Opinion;Relationship Status (or lack thereof);Employment Status;Income;Time/Help Availability;Religion,Catholic
108,0-18,Male,In a relationship,1,High School Diploma,"$200,000 � $249,999",Canadian/dutch,10,Two,Zero,Two,3,Income;Employment Status;Significant Other�s Opinion;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Personal Choice;Religion,
240,0-18,Female,Single,8,No High School Diploma,,Korean,10,Two,Zero,Two,8,Relationship Status (or lack thereof);Income;Personal Health;Employment Status;Time/Help Availability;Personal Choice;Religion;Significant Other�s Opinion,Christian
162,19-24,Male,Single,15,High School Diploma,"Under $50,000",India,10,Two,Zero,Zero,15,Religion;Relationship Status (or lack thereof);Income;Personal Health;Personal Choice;Time/Help Availability;Employment Status;Significant Other�s Opinion,Hindu
226,40-44,Female,Married,5,Master,"$200,000 � $249,999",chinese ,10,Two,Three,Zero,15,Time/Help Availability;Relationship Status (or lack thereof);Personal Choice;Personal Health;Employment Status;Income;Religion;Significant Other�s Opinion,Christian
283,40-44,Female,Married,12,Bachelor,"$100,000 � $149,999",,10,Seven or more,Four,Two,10,Income;Religion;Personal Health;Time/Help Availability;Significant Other�s Opinion;Personal Choice;Employment Status;Relationship Status (or lack thereof),Christian
291,50-54,Female,Married,1,High School Diploma,,Canada,10,Two,Two,Three,15,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Health;Time/Help Availability;Employment Status;Income;Religion,
299,30-34,Male,In a relationship,7,Bachelor,"$75,000 � $99,999",Canada,10,Three,Zero,One,8,Personal Health;Personal Choice;Income;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Significant Other�s Opinion;Religion,Spiritual
318,55-59,Male,Married,7,High School Diploma,"$150,000 � $199,999",Canadian,10,Four,Four,Four,10,Relationship Status (or lack thereof);Personal Choice;Personal Health;Significant Other�s Opinion;Religion;Income;Time/Help Availability;Employment Status,Sikh
319,45-49,Male,Married,10,Bachelor,"$50,000 � $74,999",Korea,10,One,Two,Two,8,Income;Relationship Status (or lack thereof);Employment Status;Personal Choice;Significant Other�s Opinion;Time/Help Availability;Personal Health;Religion,Catholic
324,50-54,Female,Married,5,Bachelor,"$75,000 � $99,999","South Korea, Korean",10,Two,One,Three,1,Personal Choice;Relationship Status (or lack thereof);Income;Employment Status;Personal Health;Time/Help Availability;Religion;Significant Other�s Opinion,Christian
119,25-29,Male,Single,3,No High School Diploma,"$50,000 � $74,999",Canadian,11,Two,Zero,Four,12,Significant Other�s Opinion;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Choice;Personal Health;Religion,Agnostic
256,19-24,Female,Married,11,Bachelor,"$100,000 � $149,999",Canadian American ,11,Three,Zero,One,14,Personal Choice;Significant Other�s Opinion;Religion;Personal Health;Relationship Status (or lack thereof);Time/Help Availability;Income;Employment Status,Christian
72,0-18,Male,Single,13,No High School Diploma,"Under $50,000",Korea/Korean,11,Two,Zero,Three,6,Religion;Personal Choice;Relationship Status (or lack thereof);Significant Other�s Opinion;Income;Personal Health;Time/Help Availability;Employment Status;,Christian
116,0-18,Female,Single,3,No High School Diploma,"Under $50,000",Chinese Canadian,11,Two,Zero,Two,10,Income;Personal Choice;Significant Other�s Opinion;Employment Status;Personal Health;Relationship Status (or lack thereof);Time/Help Availability;Religion,Atheist
25,30-34,Male,Married,2,Trades: Journeyman,"$250,000 � $299,999",Canada,11,Three,One,Two,11,Income;Personal Choice;Personal Health;Time/Help Availability;Significant Other�s Opinion;Employment Status;Relationship Status (or lack thereof);Religion;,Catholic
194,0-18,Male,In a relationship,4,No High School Diploma,"$250,000 � $299,999",Ukrainian,11,Two,Zero,Two,7,Income;Significant Other�s Opinion;Time/Help Availability;Personal Choice;Personal Health;Employment Status;Religion;Relationship Status (or lack thereof),Atheist
282,35-39,Male,Married,9,Bachelor,"$75,000 � $99,999",Canada,11,Two,One,Three,12,Significant Other�s Opinion;Income;Personal Health;Religion;Time/Help Availability;Employment Status;Personal Choice;Relationship Status (or lack thereof),Catholic
35,25-29,Male,In a relationship,1,PhD,"$200,000 � $249,999",Canada,12,Two,Zero,One,10,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Income;Employment Status;Personal Health;Time/Help Availability;Religion;,Atheist
237,50-54,Male,Married,9,Bachelor,"Under $50,000",usa,12,Two,Two,One,12,Personal Choice;Income;Personal Health;Time/Help Availability;Relationship Status (or lack thereof);Religion;Significant Other�s Opinion;Employment Status,
3,0-18,Female,Single,7,No High School Diploma,,Hong Kong/ Chinese,12,Two,Zero,One,13,Personal Health;Relationship Status (or lack thereof);Personal Choice;Income;Employment Status;Significant Other�s Opinion;Time/Help Availability;Religion;,Christian
241,30-34,Female,Married,9,Master,"$150,000 � $199,999",Sri Lanka ,12,Two,One,One,14,Personal Choice;Income;Relationship Status (or lack thereof);Employment Status;Time/Help Availability;Personal Health;Religion;Significant Other�s Opinion,Buddhist
89,45-49,Female,Married,10,Bachelor,"$50,000 � $74,999",Canadian,12,One,One,One,15,Relationship Status (or lack thereof);Personal Choice;Significant Other�s Opinion;Personal Health;Employment Status;Income;Religion;Time/Help Availability;,Christian
170,35-39,Female,Single,10,Bachelor,"$75,000 � $99,999",Canadian,12,Three,Zero,One,15,Relationship Status (or lack thereof);Personal Choice;Significant Other�s Opinion;Income;Personal Health;Religion;Employment Status;Time/Help Availability,Christian
178,25-29,Male,Married,5,PhD,"$200,000 � $249,999",Albanian ,12,Three,Two,One,15,Personal Health;Employment Status;Income;Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Religion;Time/Help Availability,Christian
223,30-34,Female,Divorced,7,Bachelor,"$100,000 � $149,999",Canada,12,Two,Zero,One,15,Relationship Status (or lack thereof);Personal Choice;Significant Other�s Opinion;Personal Health;Time/Help Availability;Employment Status;Income;Religion,Sikh
120,0-18,Female,Single,4,No High School Diploma,,canada/vietnam culture,12,Three,Zero,One,4,Personal Choice;Time/Help Availability;Income;Personal Health;Employment Status;Religion;Relationship Status (or lack thereof);Significant Other�s Opinion,Atheist
251,0-18,Female,Single,1,No High School Diploma,"Under $50,000",Canada/ Canadian,12,Two,Zero,One,5,Income;Personal Choice;Personal Health;Time/Help Availability;Employment Status;Significant Other�s Opinion;Relationship Status (or lack thereof);Religion,Atheist
123,70+,Male,Single,1,PhD,"Above $300,000",Canada,12,Two,Zero,One,6,Personal Choice;Time/Help Availability;Significant Other�s Opinion;Relationship Status (or lack thereof);Income;Personal Health;Employment Status;Religion,Atheist
200,0-18,Male,Single,8,No High School Diploma,"$50,000 � $74,999",Korean ,12,Two,Zero,One,6,Income;Religion;Employment Status;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion,Christian
272,19-24,Male,Single,1,High School Diploma,"$100,000 � $149,999",Brazil/Brazilian,12,Two,Zero,One,8,Relationship Status (or lack thereof);Significant Other�s Opinion;Income;Employment Status;Personal Health;Time/Help Availability;Personal Choice;Religion,Atheist
62,35-39,Female,Married,13,Bachelor,"$150,000 � $199,999",Canada,12,Five,Five,Seven or more,15,Relationship Status (or lack thereof);Personal Choice;Significant Other�s Opinion;Income;Personal Health;Time/Help Availability;Employment Status;Religion;,Christian
50,55-59,Female,Married,10,Master,,Canadian,12,Three,One,Three,12,Personal Health;Relationship Status (or lack thereof);Religion;Income;Employment Status;Personal Choice;Significant Other�s Opinion;Time/Help Availability;,Christian
77,19-24,Female,Single,2,High School Diploma,"$75,000 � $99,999",Canadian,12,Two,Zero,Three,12,Personal Health;Income;Time/Help Availability;Employment Status;Significant Other�s Opinion;Personal Choice;Religion;Relationship Status (or lack thereof);,Christian
134,35-39,Female,Married,3,Bachelor,"$50,000 � $74,999",Hong Kong,12,Two,Two,Three,14,Personal Health;Personal Choice;Relationship Status (or lack thereof);Employment Status;Income;Time/Help Availability;Significant Other�s Opinion;Religion,Agnostic
56,19-24,Male,Single,12,Bachelor,"$100,000 � $149,999",Canada,12,Three,Zero,Three,7,Significant Other�s Opinion;Relationship Status (or lack thereof);Income;Employment Status;Personal Choice;Time/Help Availability;Religion;Personal Health;,Christian
160,30-34,Female,Married,10,Bachelor,"$100,000 � $149,999",Canadian,12,Two,One,Two,13,Relationship Status (or lack thereof);Income;Employment Status;Time/Help Availability;Personal Health;Significant Other�s Opinion;Personal Choice;Religion,Christian
30,40-44,Male,Married,1,High School Diploma,"$200,000 � $249,999",Canada,12,Two,Two,Two,15,Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Income;Employment Status;Religion;,Catholic
201,35-39,Male,Married,5,Trades: Red Seal,"$100,000 � $149,999",canadian,12,Two,Zero,Two,3,Personal Health;Income;Employment Status;Time/Help Availability;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Choice;Religion,Christian
109,50-54,Female,Separated,10,Master,"Under $50,000",Korean,12,Three,Two,Two,7,Religion;Relationship Status (or lack thereof);Time/Help Availability;Personal Choice;Personal Health;Employment Status;Income;Significant Other�s Opinion,Christian
179,55-59,Male,Separated,7,Trades: Apprentice,"$100,000 � $149,999",Canada,12,Three,Two,Zero,1,Relationship Status (or lack thereof);Personal Health;Income;Employment Status;Religion;Time/Help Availability;Personal Choice;Significant Other�s Opinion,Christian
190,45-49,Female,Married,10,High School Diploma,,,12,Two,One,Zero,10,Personal Health;Income;Time/Help Availability;Relationship Status (or lack thereof);Religion;Personal Choice;Employment Status;Significant Other�s Opinion,Christian
186,25-29,Male,Single,1,Bachelor,"Under $50,000",Korea/Korean,12,Three,Zero,Zero,12,Relationship Status (or lack thereof);Income;Employment Status;Personal Health;Personal Choice;Significant Other�s Opinion;Time/Help Availability;Religion,Atheist
302,25-29,Male,Single,12,High School Diploma,"$100,000 � $149,999",Serbian/Canadian,12,Two,Zero,Two,10,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Employment Status;Religion;Income,Christian
309,45-49,Female,Married,14,Bachelor,"$75,000 � $99,999",Philippines ,12,Three,Three,Three,15,Personal Choice;Personal Health;Significant Other�s Opinion;Religion;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability,Catholic
325,40-44,Female,Married,1,High School Diploma,"$100,000 � $149,999",Canadian,12,One,One,Two,10,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Health;Income;Employment Status;Time/Help Availability;Religion,Atheist
78,25-29,Female,Single,10,Master,"Under $50,000",Indian,13,Three,Zero,One,11,Personal Health;Religion;Time/Help Availability;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Choice;Income;Employment Status;,Muslim/Islam
137,0-18,Female,In a relationship,3,No High School Diploma,"$50,000 � $74,999",Canadian,13,Two,Zero,One,13,Income;Employment Status;Relationship Status (or lack thereof);Religion;Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion,Muslim/Islam
32,25-29,Female,Single,9,High School Diploma,"$100,000 � $149,999",Canada ,13,Four,Zero,One,15,Personal Choice;Income;Employment Status;Time/Help Availability;Personal Health;Significant Other�s Opinion;Relationship Status (or lack thereof);Religion;,Sikh
47,0-18,Male,Single,11,No High School Diploma,"$250,000 � $299,999",Canadian,13,Two,Zero,Two,10,Income;Religion;Employment Status;Relationship Status (or lack thereof);Significant Other�s Opinion;Personal Choice;Time/Help Availability;Personal Health;,Christian
245,0-18,Male,In a relationship,7,No High School Diploma,"$50,000 � $74,999",Canadian,13,Two,Zero,Two,11,Significant Other�s Opinion;Time/Help Availability;Personal Choice;Income;Employment Status;Personal Health;Relationship Status (or lack thereof);Religion,Christian
212,35-39,Female,Married,1,High School Diploma,"$150,000 � $199,999",Canadian ,13,Two,Two,Two,13,Personal Health;Religion;Employment Status;Relationship Status (or lack thereof);Personal Choice;Significant Other�s Opinion;Income;Time/Help Availability,Atheist
265,0-18,Male,Single,10,No High School Diploma,,Korea,13,Two,Zero,Two,7,Relationship Status (or lack thereof);Income;Employment Status;Religion;Significant Other�s Opinion;Personal Health;Time/Help Availability;Personal Choice,Christian
172,45-49,Male,Married,5,Master,"$150,000 � $199,999",Canada,13,Three,Three,Zero,12,Personal Choice;Significant Other�s Opinion;Income;Relationship Status (or lack thereof);Personal Health;Employment Status;Time/Help Availability;Religion,
269,70+,Female,Married,12,High School Diploma,,South Korean ,14,Two,Two,Five,,,Christian
110,19-24,Female,In a relationship,6,High School Diploma,"$150,000 � $199,999",Costa Rican (Hispanic/latin),14,Six,Zero,Four,3,Personal Choice;Personal Health;Relationship Status (or lack thereof);Income;Significant Other�s Opinion;Time/Help Availability;Employment Status;Religion,Spiritual
155,40-44,Male,Married,13,Trades: Journeyman,"$250,000 � $299,999",Canada,14,Three,Three,One,12,Personal Choice;Significant Other�s Opinion;Religion;Income;Relationship Status (or lack thereof);Employment Status;Personal Health;Time/Help Availability,Christian
92,35-39,Male,Married,14,Master,"$100,000 � $149,999",Canada,14,Seven or more,Zero,One,14,Income;Employment Status;Religion;Relationship Status (or lack thereof);Personal Choice;Significant Other�s Opinion;Personal Health;Time/Help Availability;,Hindu
96,50-54,Female,Married,12,Bachelor,"$100,000 � $149,999",Korean,14,Three,Two,One,15,Personal Health;Significant Other�s Opinion;Relationship Status (or lack thereof);Income;Religion;Employment Status;Time/Help Availability;Personal Choice;,Christian
61,19-24,Female,Single,10,High School Diploma,"$75,000 � $99,999",Canadian,14,Two,Zero,Two,14,Significant Other�s Opinion;Religion;Employment Status;Income;Time/Help Availability;Personal Health;Personal Choice;Relationship Status (or lack thereof);,Christian
115,45-49,Female,In a relationship,1,Bachelor,"$100,000 � $149,999",Canada,14,Three,Three,Two,15,Personal Choice;Relationship Status (or lack thereof);Personal Health;Employment Status;Income;Time/Help Availability;Significant Other�s Opinion;Religion,Agnostic
58,19-24,Female,Separated,8,High School Diploma,"Under $50,000",Canada,14,Two,Four,Zero,11,Income;Personal Choice;Time/Help Availability;Employment Status;Relationship Status (or lack thereof);Significant Other�s Opinion;Religion;Personal Health;,Christian
86,40-44,Male,Married,13,Bachelor,"$75,000 � $99,999",Philippines,15,Two,One,Five,15,Personal Choice;Relationship Status (or lack thereof);Employment Status;Significant Other�s Opinion;Personal Health;Time/Help Availability;Religion;Income;,Catholic
131,50-54,Female,Separated,1,Bachelor,"Under $50,000",Canada/Canadian,15,Two,Two,Five,15,Personal Choice;Significant Other�s Opinion;Personal Health;Time/Help Availability;Income;Employment Status;Relationship Status (or lack thereof);Religion,None
29,35-39,Female,Single,1,High School Diploma,"$50,000 � $74,999",Canadian/british,15,Two,One,Four,15,Relationship Status (or lack thereof);Personal Choice;Personal Health;Time/Help Availability;Significant Other�s Opinion;Employment Status;Income;Religion;,Atheist
55,60-64,Female,Married,15,Master,"$100,000 � $149,999",Canada,15,Two,Two,Four,15,Employment Status;Income;Religion;Relationship Status (or lack thereof);Personal Health;Personal Choice;Time/Help Availability;Significant Other�s Opinion;,Catholic
152,25-29,Female,Single,5,High School Diploma,"$75,000 � $99,999",Canada,15,Three,Three,Four,15,Employment Status;Income;Time/Help Availability;Personal Choice;Personal Health;Religion;Relationship Status (or lack thereof);Significant Other�s Opinion,Christian
227,65-69,Female,Married,13,Master,,Canada,15,Three,Zero,Four,15,Personal Health;Relationship Status (or lack thereof);Significant Other�s Opinion;Personal Choice;Employment Status;Religion;Income;Time/Help Availability,Christian
249,70+,Female,Widow,1,Bachelor,"$75,000 � $99,999",Canada,15,Three,Three,Four,15,,
63,50-54,Male,In a relationship,1,High School Diploma,"$100,000 � $149,999",Canadian,15,One,One,One,1,Income;Religion;Employment Status;Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion;,Atheist
43,0-18,Male,Single,15,No High School Diploma,,,15,Two,Zero,One,10,Religion;Income;Employment Status;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion;,
103,35-39,Female,Separated,10,Bachelor,"$50,000 � $74,999",Canadian,15,Three,Three,One,10,Income;Employment Status;Time/Help Availability;Personal Choice;Personal Health;Relationship Status (or lack thereof);Religion;Significant Other�s Opinion,Christian
122,0-18,Female,In a relationship,1,No High School Diploma,"Under $50,000",Canadian,15,Two,Zero,One,10,Personal Choice;Significant Other�s Opinion;Personal Health;Employment Status;Income;Time/Help Availability;Relationship Status (or lack thereof);Religion,
165,30-34,Female,Married,8,High School Diploma,"$100,000 � $149,999",Canada/ Indian ,15,Two,One,One,10,Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Employment Status;Significant Other�s Opinion;Religion;Income,Muslim/Islam
183,19-24,Male,In a relationship,2,High School Diploma,"Under $50,000",Canadian ,15,Two,Zero,One,10,Income;Personal Choice;Relationship Status (or lack thereof);Personal Health;Religion;Employment Status;Time/Help Availability;Significant Other�s Opinion,Jewish
188,45-49,Female,Married,1,High School Diploma,"$200,000 � $249,999",Canada,15,Two,Three,One,10,Personal Choice;Significant Other�s Opinion;Personal Health;Income;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Religion,Atheist
193,19-24,Male,In a relationship,10,High School Diploma,"Under $50,000",ukraine,15,Two,Zero,One,10,Personal Choice;Income;Religion;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion,
219,35-39,Female,Married,10,Bachelor,"$50,000 � $74,999",Canadian,15,Three,Three,One,10,Relationship Status (or lack thereof);Personal Health;Time/Help Availability;Personal Choice;Significant Other�s Opinion;Income;Religion;Employment Status,Christian
20,40-44,Male,Married,1,Bachelor,"$200,000 � $249,999",Canadian ,15,One,One,One,11,Income;Religion;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion;Employment Status;Personal Choice;,
64,45-49,Male,Married,8,High School Diploma,"$75,000 � $99,999",Canadian ,15,Two,Two,One,12,Time/Help Availability;Income;Personal Health;Religion;Personal Choice;Employment Status;Relationship Status (or lack thereof);Significant Other�s Opinion;,
205,30-34,Female,Married,9,Bachelor,"Above $300,000",Bosnian/Canadian,15,Two,Two,One,12,Personal Health;Personal Choice;Significant Other�s Opinion;Time/Help Availability;Employment Status;Income;Religion;Relationship Status (or lack thereof),Muslim/Islam
12,60-64,Female,Single,3,PhD,"$150,000 � $199,999",canadian,15,Two,Two,One,13,Personal Health;Personal Choice;Income;Time/Help Availability;Employment Status;Relationship Status (or lack thereof);Significant Other�s Opinion;Religion;,Atheist
27,19-24,Male,Single,15,Bachelor,"Under $50,000",India,15,Two,Zero,One,13,Personal Choice;Personal Health;Relationship Status (or lack thereof);Religion;Significant Other�s Opinion;Employment Status;Income;Time/Help Availability;,Sikh
87,35-39,Female,Married,3,High School Diploma,"$100,000 � $149,999",Canadian,15,Two,Two,One,13,Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion;Income;Employment Status;Religion;,Christian
128,30-34,Female,Married,3,Bachelor,"$150,000 � $199,999",Canada,15,Two,One,One,13,Relationship Status (or lack thereof);Personal Health;Personal Choice;Significant Other�s Opinion;Income;Employment Status;Religion;Time/Help Availability,Buddhist
198,30-34,Female,Married,10,Master,"$50,000 � $74,999",Sri Lanka,15,Three,One,One,13,Personal Choice;Income;Employment Status;Religion;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion,Buddhist
230,45-49,Male,Married,14,PhD,"$200,000 � $249,999",Korea/Korean,15,Three,Three,One,14,Personal Choice;Employment Status;Personal Health;Time/Help Availability;Significant Other�s Opinion;Religion;Income;Relationship Status (or lack thereof),Catholic
255,60-64,Female,Married,8,Bachelor,,canada ,15,Two,Two,One,14,Personal Choice;Significant Other�s Opinion;Time/Help Availability;Personal Health;Employment Status;Relationship Status (or lack thereof);Income;Religion,Catholic
19,35-39,Female,Married,9,High School Diploma,"$75,000 � $99,999",Canadian ,15,Two,Two,One,15,Income;Religion;Personal Choice;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion;,Christian
49,30-34,Male,Married,8,Bachelor,"$250,000 � $299,999",Canada ,15,Two,Zero,One,15,Personal Choice;Income;Religion;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion;,Sikh
81,35-39,Male,Married,15,Bachelor,"$150,000 � $199,999",Egypt,15,Two,One,One,15,Relationship Status (or lack thereof);Significant Other�s Opinion;Employment Status;Income;Religion;Personal Health;Personal Choice;Time/Help Availability;,Christian
84,50-54,Female,Married,1,Bachelor,"$150,000 � $199,999",Canadian,15,Four,Two,One,15,Personal Choice;Relationship Status (or lack thereof);Significant Other�s Opinion;Personal Health;Income;Time/Help Availability;Employment Status;Religion;,Agnostic
149,19-24,Male,Single,5,Bachelor,"$200,000 � $249,999",Canada,15,Two,Zero,One,15,Relationship Status (or lack thereof);Significant Other�s Opinion;Time/Help Availability;Personal Choice;Income;Personal Health;Employment Status;Religion,Catholic
166,40-44,Female,Married,1,Bachelor,"$150,000 � $199,999",Canadian,15,Three,Two,One,15,Income;Time/Help Availability;Employment Status;Relationship Status (or lack thereof);Personal Health;Significant Other�s Opinion;Personal Choice;Religion,Atheist
185,40-44,Male,Married,14,Bachelor,"$100,000 � $149,999",India ,15,Two,Two,One,15,Income;Personal Choice;Personal Health;Time/Help Availability;Employment Status;Religion;Relationship Status (or lack thereof);Significant Other�s Opinion,Hindu
208,19-24,Female,In a relationship,15,Bachelor,"Under $50,000",korean,15,Two,Zero,One,15,Relationship Status (or lack thereof);Significant Other�s Opinion;Income;Religion;Employment Status;Personal Choice;Time/Help Availability;Personal Health,Christian
239,60-64,Female,Married,3,High School Diploma,,Canadian ,15,Two,Two,One,15,Personal Choice;Relationship Status (or lack thereof);Significant Other�s Opinion;Employment Status;Income;Personal Health;Time/Help Availability;Religion,None
257,45-49,Male,Married,14,Bachelor,"$75,000 � $99,999",indian ,15,Two,Two,One,15,,Hindu
263,35-39,Male,Married,10,Bachelor,"$250,000 � $299,999",Canada,15,Two,Two,One,15,Income;Personal Choice;Personal Health;Relationship Status (or lack thereof);Employment Status;Time/Help Availability;Significant Other�s Opinion;Religion,Christian
88,35-39,Male,Married,15,High School Diploma,"$100,000 � $149,999",,15,Two,Two,One,2,Personal Choice;Religion;Relationship Status (or lack thereof);Income;Personal Health;Time/Help Availability;Employment Status;Significant Other�s Opinion;,
191,50-54,Male,Married,1,Bachelor,"$150,000 � $199,999",Canada,15,Two,One,One,7,Income;Personal Choice;Significant Other�s Opinion;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Personal Health;Religion,Agnostic
225,30-34,Female,Married,2,Bachelor,"$150,000 � $199,999",Canadian,15,Two,Three,One,7,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Income;Employment Status;Personal Health;Time/Help Availability;Religion,Agnostic
65,19-24,Female,engaged,1,High School Diploma,"Under $50,000",Canada,15,Two,Zero,One,8,Income;Employment Status;Personal Choice;Time/Help Availability;Relationship Status (or lack thereof);Personal Health;Significant Other�s Opinion;Religion;,Agnostic
99,30-34,Male,Common-law,3,Trades: Red Seal,"$150,000 � $199,999",Canadian ,15,Three,One,One,8,Income;Employment Status;Relationship Status (or lack thereof);Personal Health;Personal Choice;Significant Other�s Opinion;Time/Help Availability;Religion;,Christian
151,60-64,Female,Married,3,Bachelor,,Scotland,15,Two,Two,One,8,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Health;Employment Status;Religion;Income;Time/Help Availability,Agnostic
207,70+,Male,Married,7,Trades: Apprentice,"$50,000 � $74,999",Canada,15,Two,Two,One,8,Personal Health;Significant Other�s Opinion;Personal Choice;Relationship Status (or lack thereof);Employment Status;Income;Time/Help Availability;Religion,None
244,60-64,Male,Married,15,Master,"$50,000 � $74,999",Korea/Korean,15,Three,Two,Seven or more,10,Personal Choice;Personal Health;Relationship Status (or lack thereof);Religion;Time/Help Availability;Income;Employment Status;Significant Other�s Opinion,Christian
229,65-69,Male,Married,3,Master,"$100,000 � $149,999",Canadian ,15,Two,One,Seven or more,7,Relationship Status (or lack thereof);Significant Other�s Opinion;Employment Status;Income;Personal Choice;Time/Help Availability;Personal Health;Religion,Catholic
169,65-69,Female,Married,15,Bachelor,"Under $50,000",Assyrian/canadian,15,Four,Four,Six,14,Religion;Relationship Status (or lack thereof);Personal Health;Time/Help Availability;Income;Employment Status;Personal Choice;Significant Other�s Opinion,Christian
79,25-29,Female,Married,5,Master,"$50,000 � $74,999","Austria, Romania, Philippines, Canada",15,Two,Zero,Three,10,Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Significant Other�s Opinion;Personal Choice;Personal Health;Income;Religion;,Agnostic
157,25-29,Female,Married,15,Bachelor,"Under $50,000",Ghanaian,15,Four,Two,Three,10,Income;Time/Help Availability;Employment Status;Personal Health;Relationship Status (or lack thereof);Significant Other�s Opinion;Personal Choice;Religion,Christian
164,35-39,Female,Married,1,Bachelor,"$75,000 � $99,999",Canada,15,Four,Four,Three,10,Employment Status;Relationship Status (or lack thereof);Significant Other�s Opinion;Income;Time/Help Availability;Personal Health;Religion;Personal Choice,None
199,50-54,Female,Common-law,1,High School Diploma,"$50,000 � $74,999",Canada ,15,Three,Three,Three,10,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Income;Personal Health;Religion;Employment Status;Time/Help Availability,Agnostic
22,55-59,Male,Married,3,Bachelor,"$100,000 � $149,999",Canada,15,Four,Two,Three,11,Personal Choice;Employment Status;Relationship Status (or lack thereof);Income;Significant Other�s Opinion;Religion;Time/Help Availability;Personal Health;,Hindu
267,35-39,Male,Married,13,Bachelor,"$100,000 � $149,999",Canada,15,Four,Three,Three,11,Religion;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion;Employment Status;Income;Personal Choice,Christian
13,45-49,Female,Married,14,PhD,"$100,000 � $149,999",Korean,15,Three,One,Three,13,Personal Choice;Personal Health;Income;Employment Status;Religion;Relationship Status (or lack thereof);Time/Help Availability;Significant Other�s Opinion;,Christian
259,50-54,Female,Married,9,Bachelor,,South Korea,15,Two,Two,Three,13,Religion;Relationship Status (or lack thereof);Personal Choice;Personal Health;Significant Other�s Opinion;Income;Employment Status;Time/Help Availability,Christian
161,35-39,Female,Married,3,Master,"$100,000 � $149,999",Argentina ,15,Three,Three,Three,15,Personal Choice;Personal Health;Significant Other�s Opinion;Employment Status;Income;Time/Help Availability;Religion;Relationship Status (or lack thereof),Catholic
171,30-34,Female,Married,8,Bachelor,"$150,000 � $199,999",Canadian ,15,Two,Two,Three,15,Personal Choice;Income;Significant Other�s Opinion;Personal Health;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Religion,Christian
242,30-34,Female,Married,4,High School Diploma,"Under $50,000",Canada ,15,Four,Three,Three,15,Income;Significant Other�s Opinion;Personal Choice;Time/Help Availability;Personal Health;Employment Status;Religion;Relationship Status (or lack thereof),Christian
111,40-44,Female,Married,4,Master,"$100,000 � $149,999",Iranian,15,Two,One,Three,7,Relationship Status (or lack thereof);Personal Health;Personal Choice;Time/Help Availability;Income;Employment Status;Significant Other�s Opinion;Religion,Muslim/Islam
46,30-34,Male,Married,1,High School Diploma,"$150,000 � $199,999",Canada,15,Three,Three,Three,8,Personal Choice;Time/Help Availability;Income;Significant Other�s Opinion;Relationship Status (or lack thereof);Employment Status;Personal Health;Religion;,Agnostic
148,65-69,Male,Married,1,Trades: Red Seal,"$200,000 � $249,999",Canadian,15,Four,Two,Three,8,Income;Religion;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion;Personal Choice,
215,30-34,Female,Common-law,3,High School Diploma,"$150,000 � $199,999",Canada,15,Three,Three,Three,9,Personal Choice;Significant Other�s Opinion;Personal Health;Relationship Status (or lack thereof);Income;Time/Help Availability;Employment Status;Religion,Atheist
83,0-18,Male,Single,9,High School Diploma,"Above $300,000",South African  ,15,Three,Zero,Two,1,Income;Time/Help Availability;Employment Status;Relationship Status (or lack thereof);Personal Health;Religion;Significant Other�s Opinion;Personal Choice;,Christian
217,35-39,Female,Married,1,Master,"$200,000 � $249,999",Canada/Canadian,15,Two,Two,Two,1,Income;Personal Choice;Time/Help Availability;Relationship Status (or lack thereof);Personal Health;Employment Status;Religion;Significant Other�s Opinion,Atheist
14,60-64,Female,Married,2,High School Diploma,"$75,000 � $99,999",Canada,15,Two,Two,Two,10,Income;Religion;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Personal Choice;Significant Other�s Opinion;,None
21,35-39,Female,Separated,1,High School Diploma,"Under $50,000",Canada ,15,Four,Two,Two,10,Relationship Status (or lack thereof);Significant Other�s Opinion;Personal Choice;Personal Health;Income;Employment Status;Time/Help Availability;Religion;,
94,30-34,Male,Single,12,Bachelor,"$100,000 � $149,999",Canadian,15,Two,Zero,Two,10,Personal Choice;Significant Other�s Opinion;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Religion;Personal Health;,Christian
102,19-24,Male,Single,4,Trades: Apprentice,"Under $50,000",Canada,15,Four,Zero,Two,10,Personal Choice;Significant Other�s Opinion;Income;Time/Help Availability;Personal Health;Relationship Status (or lack thereof);Employment Status;Religion,Christian
153,30-34,Female,Married,1,Bachelor,"$150,000 � $199,999",Canadian,15,Two,Zero,Two,10,Income;Personal Choice;Employment Status;Time/Help Availability;Personal Health;Significant Other�s Opinion;Religion;Relationship Status (or lack thereof),
213,40-44,Female,Common-law,1,High School Diploma,"$250,000 � $299,999",Canada,15,One,One,Two,10,Relationship Status (or lack thereof);Employment Status;Income;Significant Other�s Opinion;Time/Help Availability;Personal Choice;Personal Health;Religion,
231,50-54,Male,Married,10,Bachelor,"$150,000 � $199,999",Pakistan ,15,Two,Two,Two,10,Relationship Status (or lack thereof);Significant Other�s Opinion;Religion;Income;Personal Health;Time/Help Availability;Personal Choice;Employment Status,Muslim/Islam
254,30-34,Male,Single,10,High School Diploma,"$100,000 � $149,999",Canadian,15,Three,Zero,Two,10,,Atheist
258,55-59,Male,Common-law,1,Bachelor,"$100,000 � $149,999",Canadian,15,Two,Two,Two,10,Significant Other�s Opinion;Employment Status;Relationship Status (or lack thereof);Personal Choice;Personal Health;Time/Help Availability;Income;Religion,Atheist
26,35-39,Female,Married,1,Bachelor,"Above $300,000",Canadian ,15,Two,Two,Two,11,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Health;Income;Employment Status;Time/Help Availability;Religion;,None
24,50-54,Female,Married,14,Bachelor,"$200,000 � $249,999",Canadian ,15,Four,Four,Two,12,Personal Choice;Relationship Status (or lack thereof);Income;Religion;Personal Health;Time/Help Availability;Employment Status;Significant Other�s Opinion;,Christian
98,25-29,Male,Common-law,13,Bachelor,"$150,000 � $199,999",Canadian,15,Four,Zero,Two,12,Relationship Status (or lack thereof);Income;Time/Help Availability;Significant Other�s Opinion;Employment Status;Personal Health;Religion;Personal Choice;,Christian
184,55-59,Female,Married,7,High School Diploma,"Under $50,000",Canada,15,Three,Three,Two,12,Personal Choice;Personal Health;Significant Other�s Opinion;Relationship Status (or lack thereof);Employment Status;Income;Time/Help Availability;Religion,Agnostic
218,40-44,Male,Married,15,Master,"$50,000 � $74,999",China,15,Four,Three,Two,12,Income;Personal Health;Relationship Status (or lack thereof);Religion;Employment Status;Time/Help Availability;Personal Choice;Significant Other�s Opinion,Christian
271,45-49,Female,Widow,12,Bachelor,"Under $50,000",Indian/Canadian,15,Two,One,Two,12,Income;Relationship Status (or lack thereof);Employment Status;Personal Choice;Time/Help Availability;Significant Other�s Opinion;Religion;Personal Health,Other (specify: Humanism)
202,25-29,Female,Single,11,High School Diploma,"Under $50,000",Indian,15,Three,Zero,Two,14,Religion;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Personal Choice;Significant Other�s Opinion,Sikh
214,35-39,Female,Common-law,3,Bachelor,"$200,000 � $249,999",Canadian ,15,Three,Two,Two,14,Relationship Status (or lack thereof);Significant Other�s Opinion;Personal Choice;Personal Health;Income;Employment Status;Time/Help Availability;Religion,Christian
224,65-69,Male,Married,1,Trades: Apprentice,"$75,000 � $99,999",Canadian,15,Two,Two,Two,14,Significant Other�s Opinion;Personal Choice;Income;Personal Health;Relationship Status (or lack thereof);Religion;Employment Status;Time/Help Availability,
10,40-44,Female,Married,1,High School Diploma,"$200,000 � $249,999",Canadian ,15,Four,Four,Two,15,Personal Choice;Significant Other�s Opinion;Personal Health;Time/Help Availability;Income;Employment Status;Religion;Relationship Status (or lack thereof);,
40,60-64,Male,Married,1,Master,"$100,000 � $149,999",Canadian ,15,Two,Two,Two,15,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Health;Income;Employment Status;Time/Help Availability;Religion;,Catholic
53,30-34,Female,Married,5,Bachelor,"Above $300,000",Canada ,15,Three,Two,Two,15,Income;Personal Health;Time/Help Availability;Relationship Status (or lack thereof);Significant Other�s Opinion;Employment Status;Religion;Personal Choice;,Christian
59,50-54,Female,In a relationship,5,Bachelor,"$100,000 � $149,999",Canadian ,15,Two,Two,Two,15,Relationship Status (or lack thereof);Income;Personal Health;Significant Other�s Opinion;Personal Choice;Employment Status;Time/Help Availability;Religion;,Catholic
74,70+,Female,Married,10,High School Diploma,,Canadian,15,Two,Two,Two,15,Income;Religion;Employment Status;Personal Choice;Personal Health;Time/Help Availability;Significant Other�s Opinion;Relationship Status (or lack thereof);,Christian
80,45-49,Female,Married,10,Bachelor,"$250,000 � $299,999",Canada,15,Two,One,Two,15,Time/Help Availability;Personal Health;Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Religion;Income;Employment Status;,Christian
85,35-39,Male,Married,1,Bachelor,"$200,000 � $249,999",Canadian ,15,Two,Two,Two,15,Relationship Status (or lack thereof);Significant Other�s Opinion;Employment Status;Income;Personal Choice;Personal Health;Time/Help Availability;Religion;,Atheist
97,19-24,Female,In a relationship,13,High School Diploma,"$250,000 � $299,999",Canadian ,15,Three,Zero,Two,15,Income;Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Employment Status;Religion;Significant Other�s Opinion;,Buddhist
101,50-54,Female,Married,13,Bachelor,"Above $300,000",Canadian ,15,Four,Three,Two,15,Relationship Status (or lack thereof);Time/Help Availability;Employment Status;Significant Other�s Opinion;Income;Personal Choice;Personal Health;Religion,Agnostic
135,25-29,Male,In a relationship,13,Bachelor,"Under $50,000",South  Asian,15,Two,Zero,Two,15,Income;Personal Choice;Relationship Status (or lack thereof);Employment Status;Personal Health;Time/Help Availability;Religion;Significant Other�s Opinion,Sikh
143,30-34,Female,In a relationship,3,Bachelor,"$75,000 � $99,999",Canadian,15,Three,Zero,Two,15,Personal Choice;Significant Other�s Opinion;Income;Employment Status;Time/Help Availability;Personal Health;Religion;Relationship Status (or lack thereof),Hindu
146,60-64,Female,Common-law,10,High School Diploma,"$50,000 � $74,999",Canada,15,Two,Two,Two,15,Personal Choice;Personal Health;Employment Status;Income;Significant Other�s Opinion;Relationship Status (or lack thereof);Time/Help Availability;Religion,Catholic
150,30-34,Male,Married,15,High School Diploma,"$150,000 � $199,999",Canadian ,15,Two,Two,Two,15,Income;Employment Status;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion;Religion,Christian
159,45-49,Female,Married,8,Bachelor,"$100,000 � $149,999",Canadian ,15,Two,Two,Two,15,Personal Choice;Personal Health;Time/Help Availability;Income;Employment Status;Relationship Status (or lack thereof);Religion;Significant Other�s Opinion,Muslim/Islam
176,45-49,Female,Married,4,High School Diploma,"Above $300,000",Canada,15,Two,Two,Two,15,Income;Religion;Employment Status;Personal Choice;Time/Help Availability;Relationship Status (or lack thereof);Personal Health;Significant Other�s Opinion,Sikh
210,35-39,Female,Married,1,Bachelor,"$150,000 � $199,999",Greece,15,Three,Three,Two,15,Personal Choice;Time/Help Availability;Significant Other�s Opinion;Relationship Status (or lack thereof);Employment Status;Personal Health;Income;Religion,Atheist
216,30-34,Female,Married,15,High School Diploma,"$50,000 � $74,999",Canada/Canadian,15,Three,Two,Two,15,Time/Help Availability;Significant Other�s Opinion;Income;Personal Choice;Employment Status;Personal Health;Religion;Relationship Status (or lack thereof),Christian
238,45-49,Female,Married,3,Bachelor,"$150,000 � $199,999",Canada ,15,Two,Two,Two,15,Personal Health;Relationship Status (or lack thereof);Personal Choice;Significant Other�s Opinion;Income;Employment Status;Time/Help Availability;Religion,Sikh
264,45-49,Female,Common-law,1,High School Diploma,"$150,000 � $199,999",Canada/Canadian,15,Two,Two,Two,15,Income;Employment Status;Relationship Status (or lack thereof);Personal Choice;Personal Health;Time/Help Availability;Significant Other�s Opinion;Religion,Atheist
23,35-39,Female,Married,9,High School Diploma,"$150,000 � $199,999",Canadian ,15,Two,One,Two,3,Personal Health;Income;Personal Choice;Relationship Status (or lack thereof);Employment Status;Time/Help Availability;Significant Other�s Opinion;Religion;,Christian
181,40-44,Female,Married,1,Bachelor,"Above $300,000",Canada,15,Two,Two,Two,7,Personal Choice;Significant Other�s Opinion;Personal Health;Relationship Status (or lack thereof);Time/Help Availability;Income;Employment Status;Religion,
209,35-39,Male,Married,10,Bachelor,"$150,000 � $199,999",Canada,15,Two,Two,Two,7,Personal Choice;Significant Other�s Opinion;Time/Help Availability;Personal Health;Relationship Status (or lack thereof);Income;Employment Status;Religion,Hindu
76,0-18,Female,Single,12,No High School Diploma,"Under $50,000",philippines,15,Two,Zero,Two,8,Personal Choice;Significant Other�s Opinion;Personal Health;Income;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Religion;,Christian
93,0-18,Male,In a relationship,1,No High School Diploma,"$150,000 � $199,999",Canadian,15,Two,Zero,Two,8,Religion;Employment Status;Relationship Status (or lack thereof);Personal Health;Income;Time/Help Availability;Personal Choice;Significant Other�s Opinion;,Atheist
167,50-54,Male,Common-law,1,Bachelor,"$150,000 � $199,999",Canada,15,Five,Two,Two,8,Personal Choice;Personal Health;Significant Other�s Opinion;Relationship Status (or lack thereof);Income;Time/Help Availability;Employment Status;Religion,Atheist
197,60-64,Male,Married,12,Bachelor,"$100,000 � $149,999",Canada,15,Two,Two,Two,8,Income;Relationship Status (or lack thereof);Personal Choice;Religion;Employment Status;Time/Help Availability;Personal Health;Significant Other�s Opinion,Christian
105,19-24,Female,In a relationship,15,Bachelor,"$75,000 � $99,999",Canada,15,Two,Zero,Two,9,Personal Health;Religion;Employment Status;Income;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Significant Other�s Opinion,Christian
228,0-18,Male,Single,13,No High School Diploma,"$150,000 � $199,999",canada/canadian,15,Three,Three,Two,9,Religion;Personal Choice;Relationship Status (or lack thereof);Employment Status;Income;Time/Help Availability;Personal Health;Significant Other�s Opinion,Christian
33,19-24,Male,Single,14,Bachelor,"Under $50,000",Indian ,15,Two,Zero,Zero,10,Time/Help Availability;Income;Religion;Personal Choice;Employment Status;Relationship Status (or lack thereof);Personal Health;Significant Other�s Opinion;,Hindu
5,0-18,Female,Single,13,No High School Diploma,"Under $50,000",Korea/Korean,15,Three,Zero,Zero,13,Personal Choice;Religion;Personal Health;Employment Status;Income;Time/Help Availability;Relationship Status (or lack thereof);Significant Other�s Opinion;,Christian
31,25-29,Female,Single,10,High School Diploma,"Under $50,000",Canada,15,Two,Zero,Zero,13,Religion;Relationship Status (or lack thereof);Income;Time/Help Availability;Personal Choice;Employment Status;Personal Health;Significant Other�s Opinion;,Hindu
117,70+,Female,Married,14,Bachelor,"$75,000 � $99,999",,15,Two,Two,Zero,13,Personal Choice;Personal Health;Significant Other�s Opinion;Relationship Status (or lack thereof);Income;Religion;Employment Status;Time/Help Availability,Christian
222,35-39,Female,Married,1,High School Diploma,"Above $300,000",Canadian ,15,Two,Two,Zero,13,Personal Choice;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Health;Time/Help Availability;Income;Employment Status;Religion,
121,55-59,Male,Married,15,High School Diploma,"$100,000 � $149,999",Korea,15,Two,Two,Zero,7,Income;Relationship Status (or lack thereof);Religion;Personal Health;Time/Help Availability;Personal Choice;Significant Other�s Opinion;Employment Status,Christian
276,45-49,Female,Married,5,Master,"$150,000 � $199,999",Canada,15,Two,One,Three,15,Personal Choice;Significant Other�s Opinion;Income;Employment Status;Personal Health;Time/Help Availability;Relationship Status (or lack thereof);Religion,Christian
281,35-39,Male,Married,4,Bachelor,"$50,000 � $74,999",Korea/Korean,15,One,One,Two,7,Personal Health;Income;Employment Status;Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Significant Other�s Opinion;Religion,
284,0-18,Male,In a relationship,5,No High School Diploma,"Under $50,000",Canadian,15,Two,Two,Four,10,Personal Choice;Income;Religion;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion,Christian
287,45-49,Male,Married,1,Master,"$50,000 � $74,999",South Korea,15,One,One,Four,7,Personal Health;Personal Choice;Income;Time/Help Availability;Relationship Status (or lack thereof);Employment Status;Religion;Significant Other�s Opinion,Atheist
288,40-44,Male,Married,15,Trades: Apprentice,"$75,000 � $99,999",Korean ,15,Four,Four,Two,10,Personal Health;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Income;Religion;Employment Status;Significant Other�s Opinion,Christian
292,19-24,Male,In a relationship,15,Bachelor,"Above $300,000",Canada/Canadian,15,Four,Zero,One,10,Relationship Status (or lack thereof);Significant Other�s Opinion;Personal Choice;Time/Help Availability;Personal Health;Religion;Employment Status;Income,Christian
293,65-69,Female,Common-law,1,High School Diploma,,Canadian,15,Two,Zero,Zero,8,,Other (specify: Spirituality/Universalism)
294,40-44,Female,Married,15,Master,"$75,000 � $99,999",Korea/Korean,15,Three,Three,Two,15,Income;Religion;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Employment Status;Significant Other�s Opinion,Christian
295,40-44,Female,Married,1,Bachelor,"$150,000 � $199,999",,15,Four,Two,Two,1,Income;Personal Choice;Personal Health;Time/Help Availability;Relationship Status (or lack thereof);Employment Status;Significant Other�s Opinion;Religion,Atheist
296,55-59,Female,Divorced,1,Bachelor,"$150,000 � $199,999",Canadian,15,Two,One,One,15,,Spiritual
297,60-64,Male,Married,2,High School Diploma,"$50,000 � $74,999",Canadian,15,Three,One,Three,5,Income;Employment Status;Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Significant Other�s Opinion;Personal Health;Religion,None
300,65-69,Female,Married,11,Bachelor,"Under $50,000",Canadian,15,Two,Two,Three,1,Personal Health;Income;Religion;Employment Status;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Significant Other�s Opinion,None
301,70+,Female,Married,8,High School Diploma,"$50,000 � $74,999",Canada,15,Seven or more,Seven or more,Five,12,Relationship Status (or lack thereof);Religion;Personal Health;Personal Choice;Income;Employment Status;Time/Help Availability;Significant Other�s Opinion,Catholic
305,40-44,Female,Married,10,Bachelor,"$100,000 � $149,999",Canadian & Croation,15,Two,One,Two,15,Personal Choice;Relationship Status (or lack thereof);Personal Health;Employment Status;Income;Significant Other�s Opinion;Time/Help Availability;Religion,Catholic
308,60-64,Female,Single,15,Master,"Under $50,000",Brazil,15,Three,One,Zero,12,Income;Employment Status;Personal Health;Time/Help Availability;Personal Choice;Religion;Relationship Status (or lack thereof);Significant Other�s Opinion,Catholic
311,45-49,Male,Married,5,Bachelor,"$100,000 � $149,999",Korea,15,Four,Four,Two,8,Personal Health;Significant Other�s Opinion;Income;Time/Help Availability;Relationship Status (or lack thereof);Personal Choice;Employment Status;Religion,
312,25-29,Female,Married,6,Bachelor,"$100,000 � $149,999",Korean,15,Three,One,One,6,Relationship Status (or lack thereof);Time/Help Availability;Income;Significant Other�s Opinion;Personal Health;Personal Choice;Employment Status;Religion,Christian
313,45-49,Male,Married,12,Bachelor,"$100,000 � $149,999",Canada,15,Three,Three,Three,10,Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Choice;Personal Health;Religion;Time/Help Availability;Income;Employment Status,Christian
316,45-49,Female,Married,4,Bachelor,"$200,000 � $249,999",Canadian ,15,Three,Two,Two,15,Personal Choice;Relationship Status (or lack thereof);Income;Significant Other�s Opinion;Time/Help Availability;Personal Health;Employment Status;Religion,Sikh
317,70+,Male,Common-law,6,Trades: Journeyman,"$50,000 � $74,999",Canadian ,15,Three,Three,Three,10,Personal Health;Income;Employment Status;Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Religion;Significant Other�s Opinion,
322,25-29,Male,Single,15,Bachelor,"$50,000 � $74,999",Korean,15,Four,Zero,Three,10,Religion;Significant Other�s Opinion;Personal Choice;Personal Health;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability,Christian
326,30-34,Female,Married,9,Master,"$75,000 � $99,999",Canadian,15,Three,Two,Two,15,Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion;Income;Employment Status;Religion;Relationship Status (or lack thereof),Sikh
327,30-34,Female,Married,5,Master,"$50,000 � $74,999",Korean,15,Three,Zero,,15,Employment Status;Religion;Significant Other�s Opinion;Income;Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Personal Health,
329,45-49,Female,Single,1,High School Diploma,"Under $50,000",Canada,15,Two,Two,Two,15,Income;Personal Choice;Personal Health;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Significant Other�s Opinion;Religion,None
330,70+,Female,Married,15,High School Diploma,,Germany,15,Three,Three,Two,15,Personal Choice;Religion;Income;Significant Other�s Opinion;Personal Health;Time/Help Availability;Relationship Status (or lack thereof);Employment Status,Catholic
331,60-64,Male,Widow,5,Trades: Journeyman,"$50,000 � $74,999",Armenia,15,Two,Two,Four,15,Religion;Personal Choice;Significant Other�s Opinion;Personal Health;Time/Help Availability;Relationship Status (or lack thereof);Employment Status;Income,Christian
332,30-34,Male,Single,2,Bachelor,"$75,000 � $99,999",Canada,15,Two,Zero,One,15,Relationship Status (or lack thereof);Personal Choice;Personal Health;Income;Significant Other�s Opinion;Employment Status;Time/Help Availability;Religion,Christian
154,45-49,Female,Divorced,3,Master,"$250,000 � $299,999",Canada,2,Three,Seven or more,One,7,Personal Choice;Income;Time/Help Availability;Employment Status;Personal Health;Relationship Status (or lack thereof);Religion;Significant Other�s Opinion,
44,19-24,Female,In a relationship,1,Bachelor,"Under $50,000",Canadian,2,Zero,Zero,Three,15,Income;Employment Status;Personal Health;Time/Help Availability;Personal Choice;Relationship Status (or lack thereof);Significant Other�s Opinion;Religion;,Atheist
177,50-54,Female,Single,3,Master,"$100,000 � $149,999",Australia,2,One,Zero,Two,13,Income;Personal Health;Time/Help Availability;Relationship Status (or lack thereof);Religion;Employment Status;Personal Choice;Significant Other�s Opinion,Buddhist
144,40-44,Female,Married,1,Master,"$50,000 � $74,999",canada ,2,Zero,One,Zero,5,Income;Employment Status;Personal Health;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Significant Other�s Opinion;Religion,None
314,50-54,Male,Common-law,8,High School Diploma,"$75,000 � $99,999",Canada/german,2,Zero,Zero,One,9,Personal Choice;Income;Time/Help Availability;Significant Other�s Opinion;Personal Health;Relationship Status (or lack thereof);Employment Status;Religion,Spiritual
145,19-24,Female,Single,1,No High School Diploma,"$100,000 � $149,999",Canada,3,Two,Four,Four,3,Personal Health;Personal Choice;Income;Time/Help Availability;Religion;Employment Status;Relationship Status (or lack thereof);Significant Other�s Opinion,
206,55-59,Female,Single,13,Bachelor,"$50,000 � $74,999",Canada,3,Two,Zero,One,12,Religion;Income;Time/Help Availability;Significant Other�s Opinion;Employment Status;Personal Health;Personal Choice;Relationship Status (or lack thereof),Christian
261,19-24,Male,Single,10,Bachelor,,Canadian/Indian,3,One,Zero,One,8,,Hindu
114,0-18,Male,In a relationship,5,Master,"$100,000 � $149,999",Chinese ,3,Zero,Zero,Two,5,Personal Health;Income;Time/Help Availability;Personal Choice;Relationship Status (or lack thereof);Employment Status;Significant Other�s Opinion;Religion,Christian
57,0-18,Female,Single,7,No High School Diploma,"Under $50,000",Latin culture ,3,Four,Zero,Zero,3,Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Income;Employment Status;Significant Other�s Opinion;Religion;,Christian
73,0-18,Female,Single,7,High School Diploma,"$50,000 � $74,999",Canada,3,Zero,Zero,Zero,4,Personal Health;Income;Time/Help Availability;Religion;Personal Choice;Employment Status;Significant Other�s Opinion;Relationship Status (or lack thereof);,Christian
298,0-18,Male,Single,6,No High School Diploma,"$100,000 � $149,999",Canadian,3,Two,Zero,Zero,3,Personal Choice;Significant Other�s Opinion;Personal Health;Income;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Religion,Hindu
315,35-39,Male,Single,15,Bachelor,"Under $50,000",Canada/Canadian,3,Two,Zero,Three,1,Income;Religion;Personal Choice;Time/Help Availability;Employment Status;Relationship Status (or lack thereof);Personal Health;Significant Other�s Opinion,Christian
168,30-34,Female,Common-law,1,Trades: Journeyman,"$200,000 � $249,999",Canada,4,Two,Zero,One,15,Significant Other�s Opinion;Income;Employment Status;Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Religion,
52,19-24,Male,Single,1,Bachelor,"$150,000 � $199,999",Canada,4,Two,Zero,One,9,Income;Employment Status;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion;Religion;,Agnostic
75,50-54,Male,Married,2,Master,"$75,000 � $99,999",Korean ,4,Three,Three,Three,2,Income;Religion;Personal Choice;Employment Status;Significant Other�s Opinion;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;,Christian
203,30-34,Female,Married,5,Bachelor,"$150,000 � $199,999",Canada ,4,Two,One,Two,15,Personal Choice;Income;Religion;Personal Health;Time/Help Availability;Employment Status;Significant Other�s Opinion;Relationship Status (or lack thereof),Catholic
180,45-49,Female,Divorced,12,High School Diploma,"$50,000 � $74,999",Canadian,4,One,Zero,Two,7,Personal Choice;Employment Status;Religion;Income;Time/Help Availability;Relationship Status (or lack thereof);Significant Other�s Opinion;Personal Health,Jewish
95,0-18,Female,Single,10,No High School Diploma,,Canada/Canadian,4,Two,Zero,Two,9,Income;Personal Choice;Significant Other�s Opinion;Time/Help Availability;Personal Health;Relationship Status (or lack thereof);Religion;Employment Status;,Catholic
220,40-44,Female,Married,6,Trades: Red Seal,"$200,000 � $249,999",Canadian ,4,Two,Two,Zero,15,Income;Religion;Employment Status;Relationship Status (or lack thereof);Significant Other�s Opinion;Personal Choice;Time/Help Availability;Personal Health,Agnostic
51,0-18,Female,Single,8,No High School Diploma,"Under $50,000",,4,Four,Zero,Zero,7,Time/Help Availability;Personal Choice;Relationship Status (or lack thereof);Employment Status;Income;Significant Other�s Opinion;Personal Health;Religion;,Christian
306,19-24,Female,In a relationship,1,Bachelor,"$50,000 � $74,999",Korea,4,One,Zero,Zero,10,Personal Choice;Significant Other�s Opinion;Time/Help Availability;Income;Personal Health;Employment Status;Relationship Status (or lack thereof);Religion,Atheist
328,19-24,Female,In a relationship,1,High School Diploma,"$50,000 � $74,999",Canadian,4,Two,Zero,Two,11,Personal Choice;Significant Other�s Opinion;Income;Personal Health;Religion;Time/Help Availability;Employment Status;Relationship Status (or lack thereof),Atheist
106,30-34,Male,Common-law,10,Trades: Red Seal,"$100,000 � $149,999",Canadian,5,Three,Two,One,1,Significant Other�s Opinion;Income;Employment Status;Relationship Status (or lack thereof);Religion;Personal Choice;Personal Health;Time/Help Availability,Christian
274,50-54,Female,Married,5,Master,"$100,000 � $149,999",,5,Two,Three,One,2,,
11,0-18,Male,Single,4,No High School Diploma,"$75,000 � $99,999",Canada,5,One,Zero,One,3,Personal Choice;Relationship Status (or lack thereof);Income;Employment Status;Personal Health;Religion;Time/Help Availability;Significant Other�s Opinion;,Agnostic
139,0-18,Female,Married,1,No High School Diploma,"Under $50,000",Albania,5,One,Zero,One,3,Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Choice;Personal Health;Significant Other�s Opinion;Religion,
141,19-24,Female,Married,10,High School Diploma,"$100,000 � $149,999",Canadian,5,One,Zero,One,3,Income;Religion;Personal Choice;Time/Help Availability;Relationship Status (or lack thereof);Significant Other�s Opinion;Personal Health;Employment Status,Jewish
37,0-18,Female,Single,1,High School Diploma,"$100,000 � $149,999",Canadian,5,Zero,Zero,One,5,Personal Health;Personal Choice;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Significant Other�s Opinion;Religion;,
266,19-24,Male,Single,1,High School Diploma,"Under $50,000",Canadian ,5,One,Zero,One,7,Income;Employment Status;Significant Other�s Opinion;Personal Health;Time/Help Availability;Relationship Status (or lack thereof);Personal Choice;Religion,Atheist
38,0-18,Female,Single,2,High School Diploma,"$200,000 � $249,999",Canada,5,Two,Zero,One,8,Personal Health;Income;Employment Status;Time/Help Availability;Personal Choice;Relationship Status (or lack thereof);Significant Other�s Opinion;Religion;,Atheist
107,25-29,Female,Common-law,5,Bachelor,"$50,000 � $74,999",Canada,5,Two,Zero,Seven or more,12,Personal Choice;Significant Other�s Opinion;Personal Health;Income;Employment Status;Time/Help Availability;Relationship Status (or lack thereof);Religion,Buddhist
66,30-34,Female,In a relationship,1,Bachelor,"$75,000 � $99,999",Canada,5,Two,Zero,Two,10,Personal Choice;Significant Other�s Opinion;Income;Personal Health;Time/Help Availability;Employment Status;Relationship Status (or lack thereof);Religion;,Atheist
15,35-39,Male,Married,1,Bachelor,"$150,000 � $199,999",Canada,5,Two,One,Two,13,Significant Other�s Opinion;Income;Personal Choice;Time/Help Availability;Personal Health;Employment Status;Relationship Status (or lack thereof);Religion;,Agnostic
41,45-49,Female,Married,15,Trades: Apprentice,"Above $300,000",Canada,5,Two,Two,Two,14,Income;Religion;Relationship Status (or lack thereof);Time/Help Availability;Employment Status;Personal Choice;Personal Health;Significant Other�s Opinion;,Sikh
156,55-59,Female,Single,1,Master,"$50,000 � $74,999",European,5,One,Two,Two,3,Personal Choice;Income;Significant Other�s Opinion;Relationship Status (or lack thereof);Time/Help Availability;Employment Status;Religion;Personal Health,
71,30-34,Male,Married,1,High School Diploma,"$200,000 � $249,999",Canada,5,Zero,Two,Two,4,Significant Other�s Opinion;Personal Choice;Income;Time/Help Availability;Employment Status;Relationship Status (or lack thereof);Personal Health;Religion;,Atheist
235,0-18,Female,Single,10,No High School Diploma,"Under $50,000",Canada/Canadian ,5,One,Zero,Two,5,Personal Choice;Significant Other�s Opinion;Income;Relationship Status (or lack thereof);Personal Health;Religion;Employment Status;Time/Help Availability,Catholic
163,0-18,Female,Single,9,No High School Diploma,"Under $50,000",Canada ,5,One,One,Zero,4,Personal Choice;Personal Health;Income;Time/Help Availability;Employment Status;Religion;Relationship Status (or lack thereof);Significant Other�s Opinion,Sikh
42,30-34,Male,Married,1,Bachelor,"Above $300,000",Mexican,5,One,Zero,Zero,9,Employment Status;Income;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Religion;,Catholic
303,30-34,Female,Single,3,Bachelor,"Under $50,000",South Korea ,5,Zero,Zero,Zero,5,Income;Relationship Status (or lack thereof);Employment Status;Religion;Personal Choice;Personal Health;Time/Help Availability;Significant Other�s Opinion,None
8,0-18,Female,Single,10,No High School Diploma,"Under $50,000",American ,6,Two,Zero,One,15,Personal Health;Personal Choice;Income;Significant Other�s Opinion;Time/Help Availability;Employment Status;Relationship Status (or lack thereof);Religion;,Christian
124,0-18,Male,Single,3,No High School Diploma,"$150,000 � $199,999",Canadian,6,Two,Zero,One,6,Personal Choice;Significant Other�s Opinion;Personal Health;Income;Time/Help Availability;Relationship Status (or lack thereof);Employment Status;Religion,Agnostic
252,0-18,Female,Single,4,No High School Diploma,"$200,000 � $249,999",Chinese,6,Three,Zero,Two,13,Personal Choice;Income;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Religion;Significant Other�s Opinion,Spiritual
236,55-59,Female,Married,8,Master,"$100,000 � $149,999",Scottish,6,Two,Two,Two,15,Personal Choice;Significant Other�s Opinion;Personal Health;Employment Status;Relationship Status (or lack thereof);Income;Religion;Time/Help Availability,Christian
130,0-18,Female,Single,1,No High School Diploma,"$50,000 � $74,999",Canada,6,Two,Zero,Zero,5,Personal Health;Income;Personal Choice;Time/Help Availability;Employment Status;Significant Other�s Opinion;Relationship Status (or lack thereof);Religion,Atheist
286,0-18,Female,In a relationship,7,High School Diploma,"Under $50,000",Canadian/Italian,6,Two,Zero,Two,,Personal Choice;Income;Religion;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Significant Other�s Opinion,Catholic
307,0-18,Female,In a relationship,5,No High School Diploma,"Under $50,000",Phillipines ,6,Two,Zero,One,8,,Catholic
310,45-49,Male,Married,8,Bachelor,"$75,000 � $99,999",Canada/Canadian,6,Two,One,Three,6,Income;Religion;Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion;Relationship Status (or lack thereof);Employment Status,Christian
234,0-18,Male,Single,1,No High School Diploma,"$200,000 � $249,999",,7,Zero,Four,Four,15,Income;Employment Status;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Religion;Personal Health;Significant Other�s Opinion,
104,19-24,Female,Single,2,High School Diploma,"Under $50,000",Vanada,7,Two,Zero,One,11,Religion;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Employment Status;Significant Other�s Opinion;Personal Health;Income,
270,70+,Male,Married,12,Master,"$75,000 � $99,999",Canadian,7,One,One,One,11,Income;Personal Health;Relationship Status (or lack thereof);Religion;Personal Choice;Time/Help Availability;Significant Other�s Opinion;Employment Status,Buddhist
125,0-18,Male,Single,1,No High School Diploma,"$150,000 � $199,999",Canadian,7,One,Zero,One,6,Personal Choice;Time/Help Availability;Employment Status;Personal Health;Income;Relationship Status (or lack thereof);Significant Other�s Opinion;Religion,Atheist
39,0-18,Female,Single,1,High School Diploma,"$100,000 � $149,999",canada,7,Two,Zero,Two,1,Income;Relationship Status (or lack thereof);Employment Status;Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion;Religion;,Atheist
133,19-24,Male,Single,4,High School Diploma,"$50,000 � $74,999",America/American,7,Two,Zero,Two,10,Relationship Status (or lack thereof);Significant Other�s Opinion;Time/Help Availability;Income;Employment Status;Personal Choice;Personal Health;Religion,Atheist
82,25-29,Female,Single,7,Master,"Under $50,000",Pakistan ,7,Two,Zero,Two,15,Personal Choice;Personal Health;Income;Time/Help Availability;Employment Status;Significant Other�s Opinion;Relationship Status (or lack thereof);Religion;,Muslim/Islam
140,0-18,Male,Married,5,High School Diploma,"Under $50,000",Canada,7,Two,Zero,Two,3,Income;Relationship Status (or lack thereof);Employment Status;Time/Help Availability;Significant Other�s Opinion;Personal Choice;Personal Health;Religion,Christian
7,0-18,Female,Single,3,No High School Diploma,,Korean,7,Two,Zero,Two,6,Income;Employment Status;Relationship Status (or lack thereof);Personal Health;Personal Choice;Time/Help Availability;Significant Other�s Opinion;Religion;,
278,30-34,Female,Common-law,1,Bachelor,"Under $50,000",Canada,7,Two,Zero,One,6,Religion;Income;Employment Status;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion,Agnostic
285,70+,Female,Single,2,Master,"$50,000 � $74,999",Canadian American ,7,Five,Two,One,5,,Spiritual
289,0-18,Female,Single,5,No High School Diploma,"$150,000 � $199,999",India,7,Two,Zero,Zero,7,Income;Employment Status;Significant Other�s Opinion;Time/Help Availability;Personal Choice;Relationship Status (or lack thereof);Personal Health;Religion,Hindu
221,19-24,Male,Single,15,High School Diploma,"$50,000 � $74,999",Filipino Canadian,8,Two,Zero,One,1,Religion;Employment Status;Relationship Status (or lack thereof);Income;Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion,Catholic
127,0-18,Male,Single,8,No High School Diploma,"$250,000 � $299,999",The Philippines,8,Two,Zero,One,10,Income;Religion;Employment Status;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion,Catholic
253,25-29,Female,Single,1,High School Diploma,"$50,000 � $74,999",Vietnamese/Canadian ,8,Two,Zero,One,15,Personal Health;Income;Personal Choice;Employment Status;Relationship Status (or lack thereof);Time/Help Availability;Significant Other�s Opinion;Religion,
233,0-18,Plastic bag,Married,1,PhD,"Above $300,000",Zanbian,8,Six,Six,Seven or more,11,Employment Status;Personal Choice;Income;Religion;Time/Help Availability;Relationship Status (or lack thereof);Personal Health;Significant Other�s Opinion,
17,25-29,Male,Single,12,Bachelor,"Under $50,000",Filipino,8,Three,Zero,Three,10,Personal Choice;Income;Employment Status;Significant Other�s Opinion;Relationship Status (or lack thereof);Religion;Personal Health;Time/Help Availability;,Christian
243,50-54,Female,Married,10,Master,"$50,000 � $74,999",,8,Three,Two,Three,12,Personal Choice;Relationship Status (or lack thereof);Personal Health;Time/Help Availability;Employment Status;Income;Religion;Significant Other�s Opinion,Christian
268,40-44,Female,Married,1,High School Diploma,"$75,000 � $99,999",canadian,8,,Two,Two,10,,Atheist
16,19-24,Male,Single,13,Bachelor,"$50,000 � $74,999",Korean,8,Two,Zero,Two,8,Personal Choice;Income;Time/Help Availability;Employment Status;Relationship Status (or lack thereof);Personal Health;Significant Other�s Opinion;Religion;,Christian
174,19-24,Male,In a relationship,1,High School Diploma,"$50,000 � $74,999",Canada,8,Two,Zero,Two,9,Income;Significant Other�s Opinion;Relationship Status (or lack thereof);Personal Health;Personal Choice;Time/Help Availability;Employment Status;Religion,Atheist
277,30-34,Female,Single,1,Bachelor,"Under $50,000",Korea/Korean,8,One,Zero,One,7,Income;Relationship Status (or lack thereof);Personal Health;Employment Status;Time/Help Availability;Personal Choice;Significant Other�s Opinion;Religion,Atheist
280,40-44,Female,Married,8,High School Diploma,"$100,000 � $149,999",Canada/ Canadian,8,Two,Two,Three,15,Personal Choice;Relationship Status (or lack thereof);Employment Status;Income;Time/Help Availability;Personal Health;Significant Other�s Opinion;Religion,Agnostic
189,45-49,Female,Married,11,High School Diploma,,,9,Two,Two,One,10,Time/Help Availability;Income;Personal Health;Religion;Employment Status;Personal Choice;Relationship Status (or lack thereof);Significant Other�s Opinion,Catholic
248,25-29,Female,In a relationship,6,Master,"$50,000 � $74,999",Canadian,9,Two,Zero,One,10,Personal Choice;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Employment Status;Income;Significant Other�s Opinion;Religion,
250,0-18,Female,Single,9,No High School Diploma,"$50,000 � $74,999",Indian/canadian,9,Three,One,One,10,,Hindu
262,25-29,Male,Married,5,Master,"$250,000 � $299,999",Canadian,9,Two,Zero,One,13,Income;Significant Other�s Opinion;Relationship Status (or lack thereof);Time/Help Availability;Personal Health;Personal Choice;Employment Status;Religion,Hindu
2,0-18,Female,Single,10,No High School Diploma,"$75,000 � $99,999",Canada/Chinese,9,Two,Zero,One,5,Personal Health;Relationship Status (or lack thereof);Personal Choice;Income;Employment Status;Religion;Time/Help Availability;Significant Other�s Opinion;,Christian
126,0-18,Male,Single,1,No High School Diploma,"$50,000 � $74,999",Canadian metis ,9,Two,Zero,One,5,Personal Choice;Time/Help Availability;Personal Health;Relationship Status (or lack thereof);Significant Other�s Opinion;Income;Religion;Employment Status,None
182,25-29,Female,Single,1,Bachelor,"$100,000 � $149,999",Canadian ,9,Two,Zero,One,5,Income;Relationship Status (or lack thereof);Significant Other�s Opinion;Employment Status;Time/Help Availability;Personal Choice;Personal Health;Religion,
28,19-24,Male,In a relationship,8,Trades: Apprentice,"Above $300,000",Candain,9,Three,Zero,Two,15,Significant Other�s Opinion;Personal Choice;Personal Health;Relationship Status (or lack thereof);Income;Time/Help Availability;Employment Status;Religion;,Christian
68,30-34,Male,Married,3,Master,"$150,000 � $199,999",Canada,9,Three,Three,Two,7,Relationship Status (or lack thereof);Income;Personal Choice;Time/Help Availability;Employment Status;Significant Other�s Opinion;Personal Health;Religion;,Christian
246,0-18,Female,Single,5,No High School Diploma,"Under $50,000",Canadian,9,Two,Zero,Zero,13,Personal Choice;Significant Other�s Opinion;Income;Employment Status;Personal Health;Time/Help Availability;Relationship Status (or lack thereof);Religion,Agnostic
279,25-29,Male,Single,1,Bachelor,"$50,000 � $74,999",Canada/Korean,9,Two,Zero,Zero,1,Significant Other�s Opinion;Religion;Relationship Status (or lack thereof);Time/Help Availability;Personal Choice;Personal Health;Employment Status;Income,Atheist
290,0-18,Male,Single,10,No High School Diploma,"Under $50,000",India,9,One,Zero,Three,10,Religion;Income;Relationship Status (or lack thereof);Employment Status;Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion,Catholic
323,35-39,Female,Married,1,Bachelor,"Above $300,000",Korean,9,One,Zero,One,15,Personal Choice;Personal Health;Income;Relationship Status (or lack thereof);Time/Help Availability;Employment Status;Significant Other�s Opinion;Religion,Agnostic
320,0-18,Male,Single,1,No High School Diploma,"$50,000 � $74,999",Canada,,,,,,Income;Religion;Employment Status;Relationship Status (or lack thereof);Personal Choice;Time/Help Availability;Personal Health;Significant Other�s Opinion,None`;

        // Parse CSV
        const lines = csvText.split('\n');
        const headers = parseCSVLine(lines[0]);
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = parseCSVLine(lines[i]);
            const rowData = {};
            
            headers.forEach((header, index) => {
                rowData[header] = values[index] || '';
            });
            
            surveyData.push(rowData);
        }
        
        console.log("Loaded data:", surveyData);
        
        // Initialize the dashboard with the loaded data
        filteredData = [...surveyData];
        initializeDashboard();
        
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('datasetInfo').innerHTML = '<div class="alert alert-danger">Error loading data: ' + error.message + '</div>';
    }
}

// Parse a CSV line correctly handling quotes
function parseCSVLine(line) {
    const result = [];
    let currentValue = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"' && !inQuotes) {
            inQuotes = true;
        } else if (char === '"' && inQuotes) {
            // Check if this is a double quote inside quotes
            if (i + 1 < line.length && line[i + 1] === '"') {
                currentValue += '"';
                i++; // Skip the next quote
            } else {
                inQuotes = false;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(currentValue.trim());
            currentValue = "";
        } else {
            currentValue += char;
        }
    }
    
    result.push(currentValue.trim());
    return result;
}

// Initialize the dashboard with the loaded data
function initializeDashboard() {
    // Populate filter options
    populateFilterOptions();
    
    // Populate dropdown options for chart axes and grouping
    populateChartOptions();
    
    // Initialize the data table
    updateDataTable();
    
    // Initialize correlation dropdowns
    populateCorrelationOptions();
    
    // Display dataset info
    updateDatasetInfo();
    
    // Initialize the main chart with default settings
    updateChart();
}

// Populate filter options from the dataset
function populateFilterOptions() {
    // Helper function to get unique values from dataset
    function getUniqueValues(field) {
        const values = new Set();
        surveyData.forEach(item => {
            if (item[field] && item[field].trim() !== '') {
                values.add(item[field]);
            }
        });
        return Array.from(values).sort();
    }
    
    // Age filter
    const ageOptions = getUniqueValues('What is your age?');
    populateSelectOptions('ageFilter', ageOptions);
    
    // Gender filter
    const genderOptions = getUniqueValues('What is your gender?');
    populateSelectOptions('genderFilter', genderOptions);
    
    // Relationship status filter
    const relationshipOptions = getUniqueValues('What best describes your relationship status?');
    populateSelectOptions('relationshipFilter', relationshipOptions);
    
    // Education filter
    const educationOptions = getUniqueValues('What is your highest level of education?');
    populateSelectOptions('educationFilter', educationOptions);
    
    // Income filter
    const incomeOptions = getUniqueValues('What is your gross annual household income?');
    populateSelectOptions('incomeFilter', incomeOptions);
    
    // Religion filter
    const religionOptions = getUniqueValues('Standardized_Religion');
    populateSelectOptions('religionFilter', religionOptions);
}

// Populate chart options from the dataset columns
function populateChartOptions() {
    if (surveyData.length === 0) return;
    
    const columns = Object.keys(surveyData[0]);
    const select1 = document.getElementById('xAxisSelect');
    const select2 = document.getElementById('yAxisSelect');
    const groupBySelect = document.getElementById('groupBySelect');
    
    // Clear existing options
    select1.innerHTML = '';
    select2.innerHTML = '';
    groupBySelect.innerHTML = '<option value="">None</option>';
    
    // Add options for each column
    columns.forEach(column => {
        if (column === 'Id') return; // Skip the Id column
        
        const option1 = document.createElement('option');
        option1.value = column;
        option1.textContent = column;
        select1.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = column;
        option2.textContent = column;
        select2.appendChild(option2);
        
        const option3 = document.createElement('option');
        option3.value = column;
        option3.textContent = column;
        groupBySelect.appendChild(option3);
    });
    
    // Set default selections
    select1.value = 'What is your age?';
    select2.value = 'On a scale of 1-15, 1 being not religious at all, and 15 being very religious, please identify how religious you are:';
}

// Populate correlation options
function populateCorrelationOptions() {
    if (surveyData.length === 0) return;
    
    const numericalColumns = Object.keys(surveyData[0]).filter(column => {
        // Try to convert a few values to check if the column is numerical
        const sampleSize = Math.min(surveyData.length, 10);
        let numericCount = 0;
        
        for (let i = 0; i < sampleSize; i++) {
            const value = surveyData[i][column];
            if (value && !isNaN(Number(value))) {
                numericCount++;
            }
        }
        
        // If more than half the samples are numeric, consider it a numeric column
        return numericCount > sampleSize / 2;
    });
    
    const select1 = document.getElementById('correlationVar1');
    const select2 = document.getElementById('correlationVar2');
    
    // Clear existing options
    select1.innerHTML = '';
    select2.innerHTML = '';
    
    // Add options for each numerical column
    numericalColumns.forEach(column => {
        const option1 = document.createElement('option');
        option1.value = column;
        option1.textContent = column;
        select1.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = column;
        option2.textContent = column;
        select2.appendChild(option2);
    });
    
    // Set default selections if options exist
    if (numericalColumns.length >= 2) {
        select1.value = numericalColumns[0];
        select2.value = numericalColumns[1];
    }
}

// Helper function to populate a select element with options
function populateSelectOptions(selectId, options) {
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
}

// Apply filters to the dataset
function applyFilters() {
    // Get selected filter values
    const ageFilter = getSelectedValues('ageFilter');
    const genderFilter = getSelectedValues('genderFilter');
    const relationshipFilter = getSelectedValues('relationshipFilter');
    const educationFilter = getSelectedValues('educationFilter');
    const incomeFilter = getSelectedValues('incomeFilter');
    const religionFilter = getSelectedValues('religionFilter');
    
    // Apply filters
    filteredData = surveyData.filter(item => {
        return (ageFilter.length === 0 || ageFilter.includes(item['What is your age?'])) &&
               (genderFilter.length === 0 || genderFilter.includes(item['What is your gender?'])) &&
               (relationshipFilter.length === 0 || relationshipFilter.includes(item['What best describes your relationship status?'])) &&
               (educationFilter.length === 0 || educationFilter.includes(item['What is your highest level of education?'])) &&
               (incomeFilter.length === 0 || incomeFilter.includes(item['What is your gross annual household income?'])) &&
               (religionFilter.length === 0 || religionFilter.includes(item['Standardized_Religion']));
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Update the dashboard
    updateDataTable();
    updateDatasetInfo();
    updateChart();
}

// Reset all filters
function resetFilters() {
    const selectElements = [
        'ageFilter', 'genderFilter', 'relationshipFilter', 
        'educationFilter', 'incomeFilter', 'religionFilter'
    ];
    
    selectElements.forEach(selectId => {
        const select = document.getElementById(selectId);
        Array.from(select.options).forEach(option => {
            option.selected = false;
        });
    });
    
    filteredData = [...surveyData];
    currentPage = 1;
    
    updateDataTable();
    updateDatasetInfo();
    updateChart();
}

// Helper function to get selected values from a multi-select element
function getSelectedValues(selectId) {
    const select = document.getElementById(selectId);
    return Array.from(select.selectedOptions).map(option => option.value);
}

// Update the data table with the current filtered data
function updateDataTable() {
    const table = document.getElementById('dataTable');
    
    if (filteredData.length === 0) {
        table.innerHTML = '<tr><td colspan="100%" class="text-center">No data matches the current filters</td></tr>';
        document.getElementById('tablePagination').innerHTML = '';
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
    const currentPageData = filteredData.slice(startIndex, endIndex);
    
    // Generate table headers
    const headers = Object.keys(filteredData[0]);
    let headerRow = '<thead><tr>';
    headers.forEach(header => {
        headerRow += `<th>${header}</th>`;
    });
    headerRow += '</tr></thead>';
    
    // Generate table rows
    let tableRows = '<tbody>';
    currentPageData.forEach(row => {
        tableRows += '<tr>';
        headers.forEach(header => {
            tableRows += `<td>${row[header] || ''}</td>`;
        });
        tableRows += '</tr>';
    });
    tableRows += '</tbody>';
    
    // Update table content
    table.innerHTML = headerRow + tableRows;
    
    // Update pagination
    updatePagination(totalPages);
}

// Update pagination controls
function updatePagination(totalPages) {
    const pagination = document.getElementById('tablePagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
    </li>`;
    
    // Page numbers
    const maxDisplayedPages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    const endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
    }
    
    // Next button
    paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
    </li>`;
    
    pagination.innerHTML = paginationHTML;
    
    // Add event listeners to pagination links
    const pageLinks = pagination.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const newPage = parseInt(this.getAttribute('data-page'));
            
            if (newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                updateDataTable();
            }
        });
    });
}

// Update dataset info with statistics
function updateDatasetInfo() {
    const infoElement = document.getElementById('datasetInfo');
    
    const totalRecords = surveyData.length;
    const filteredRecords = filteredData.length;
    
    let infoHTML = `<p><strong>Total Records:</strong> ${totalRecords}</p>`;
    infoHTML += `<p><strong>Filtered Records:</strong> ${filteredRecords}</p>`;
    
    // Add more statistics if needed
    if (filteredRecords > 0) {
        // Calculate some basic stats
        const ageGroups = {};
        const genders = {};
        const religions = {};
        
        filteredData.forEach(item => {
            // Count age groups
            const age = item['What is your age?'];
            if (age) {
                ageGroups[age] = (ageGroups[age] || 0) + 1;
            }
            
            // Count genders
            const gender = item['What is your gender?'];
            if (gender) {
                genders[gender] = (genders[gender] || 0) + 1;
            }
            
            // Count religions
            const religion = item['Standardized_Religion'];
            if (religion) {
                religions[religion] = (religions[religion] || 0) + 1;
            }
        });
        
        // Get the most common values
        const mostCommonAge = Object.entries(ageGroups).sort((a, b) => b[1] - a[1])[0];
        const mostCommonGender = Object.entries(genders).sort((a, b) => b[1] - a[1])[0];
        const mostCommonReligion = Object.entries(religions).sort((a, b) => b[1] - a[1])[0];
        
        if (mostCommonAge) {
            infoHTML += `<p><strong>Most Common Age Group:</strong> ${mostCommonAge[0]} (${mostCommonAge[1]} records)</p>`;
        }
        
        if (mostCommonGender) {
            infoHTML += `<p><strong>Most Common Gender:</strong> ${mostCommonGender[0]} (${mostCommonGender[1]} records)</p>`;
        }
        
        if (mostCommonReligion) {
            infoHTML += `<p><strong>Most Common Religion:</strong> ${mostCommonReligion[0] || 'Not specified'} (${mostCommonReligion[1]} records)</p>`;
        }
    }
    
    infoElement.innerHTML = infoHTML;
}

// Update the main chart based on user selections
function updateChart() {
    const chartType = document.getElementById('chartType').value;
    const xAxisField = document.getElementById('xAxisSelect').value;
    const yAxisField = document.getElementById('yAxisSelect').value;
    const groupByField = document.getElementById('groupBySelect').value;
    
    // Update chart title
    document.getElementById('chartTitle').textContent = `${yAxisField} by ${xAxisField}${groupByField ? ' grouped by ' + groupByField : ''}`;
    
    // Prepare data for the chart
    const chartData = prepareChartData(xAxisField, yAxisField, groupByField);
    
    // Create or update the chart
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (mainChart) {
        mainChart.destroy();
    }
    
    // Create new chart
    mainChart = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yAxisField
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: xAxisField
                    }
                }
            }
        }
    });
}

// Prepare data for the chart based on selected fields
function prepareChartData(xAxisField, yAxisField, groupByField) {
    // For categorical x-axis (most common case)
    const isXAxisNumeric = !isNaN(Number(filteredData[0]?.[xAxisField]));
    const isYAxisNumeric = !isNaN(Number(filteredData[0]?.[yAxisField]));
    
    // If no data is available
    if (filteredData.length === 0) {
        return {
            labels: [],
            datasets: [{
                label: 'No Data',
                data: [],
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }]
        };
    }
    
    // Handle different data preparation based on field types
    if (!isXAxisNumeric && isYAxisNumeric) {
        // Categorical X, Numeric Y (most common case)
        return prepareCategoricalNumericData(xAxisField, yAxisField, groupByField);
    } else if (isXAxisNumeric && isYAxisNumeric) {
        // Numeric X, Numeric Y (scatter plot case)
        return prepareNumericNumericData(xAxisField, yAxisField, groupByField);
    } else {
        // Other cases (categorical Y or both categorical)
        return prepareCategoricalData(xAxisField, yAxisField, groupByField);
    }
}

// Prepare data for categorical X and numeric Y
function prepareCategoricalNumericData(xAxisField, yAxisField, groupByField) {
    // Get unique categories for x-axis
    const categories = new Set();
    filteredData.forEach(item => {
        if (item[xAxisField]) {
            categories.add(item[xAxisField]);
        }
    });
    const xLabels = Array.from(categories).sort();
    
    // If no groupBy field is specified
    if (!groupByField) {
        // Calculate average Y value for each X category
        const yValues = xLabels.map(category => {
            const categoryItems = filteredData.filter(item => item[xAxisField] === category);
            const validValues = categoryItems
                .map(item => Number(item[yAxisField]))
                .filter(value => !isNaN(value));
            
            if (validValues.length === 0) return 0;
            return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
        });
        
        return {
            labels: xLabels,
            datasets: [{
                label: yAxisField,
                data: yValues,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
    } else {
        // With groupBy field, create multiple datasets
        const groupValues = new Set();
        filteredData.forEach(item => {
            if (item[groupByField]) {
                groupValues.add(item[groupByField]);
            }
        });
        const groups = Array.from(groupValues).sort();
        
        // Generate colors for each group
        const colors = generateColors(groups.length);
        
        // Create a dataset for each group
        const datasets = groups.map((group, index) => {
            const yValues = xLabels.map(category => {
                const groupItems = filteredData.filter(
                    item => item[xAxisField] === category && item[groupByField] === group
                );
                const validValues = groupItems
                    .map(item => Number(item[yAxisField]))
                    .filter(value => !isNaN(value));
                
                if (validValues.length === 0) return 0;
                return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
            });
            
            return {
                label: group,
                data: yValues,
                backgroundColor: colors[index].replace('1)', '0.5)'),
                borderColor: colors[index],
                borderWidth: 1
            };
        });
        
        return {
            labels: xLabels,
            datasets: datasets
        };
    }
}

// Prepare data for numeric X and numeric Y (scatter plot)
function prepareNumericNumericData(xAxisField, yAxisField, groupByField) {
    // If no groupBy field is specified
    if (!groupByField) {
        const data = filteredData.map(item => ({
            x: Number(item[xAxisField]),
            y: Number(item[yAxisField])
        })).filter(point => !isNaN(point.x) && !isNaN(point.y));
        
        return {
            datasets: [{
                label: `${yAxisField} vs ${xAxisField}`,
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
    } else {
        // With groupBy field, create multiple datasets
        const groupValues = new Set();
        filteredData.forEach(item => {
            if (item[groupByField]) {
                groupValues.add(item[groupByField]);
            }
        });
        const groups = Array.from(groupValues).sort();
        
        // Generate colors for each group
        const colors = generateColors(groups.length);
        
        // Create a dataset for each group
        const datasets = groups.map((group, index) => {
            const data = filteredData
                .filter(item => item[groupByField] === group)
                .map(item => ({
                    x: Number(item[xAxisField]),
                    y: Number(item[yAxisField])
                }))
                .filter(point => !isNaN(point.x) && !isNaN(point.y));
            
            return {
                label: group,
                data: data,
                backgroundColor: colors[index].replace('1)', '0.5)'),
                borderColor: colors[index],
                borderWidth: 1
            };
        });
        
        return {
            datasets: datasets
        };
    }
}

// Prepare data for categorical data
function prepareCategoricalData(xAxisField, yAxisField, groupByField) {
    // Get unique categories for x-axis
    const categories = new Set();
    filteredData.forEach(item => {
        if (item[xAxisField]) {
            categories.add(item[xAxisField]);
        }
    });
    const xLabels = Array.from(categories).sort();
    
    // Count occurrences for each category
    if (!groupByField) {
        const counts = xLabels.map(category => {
            return filteredData.filter(item => item[xAxisField] === category).length;
        });
        
        return {
            labels: xLabels,
            datasets: [{
                label: 'Count',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
    } else {
        // With groupBy field, create multiple datasets based on count
        const groupValues = new Set();
        filteredData.forEach(item => {
            if (item[groupByField]) {
                groupValues.add(item[groupByField]);
            }
        });
        const groups = Array.from(groupValues).sort();
        
        // Generate colors for each group
        const colors = generateColors(groups.length);
        
        // Create a dataset for each group
        const datasets = groups.map((group, index) => {
            const counts = xLabels.map(category => {
                return filteredData.filter(
                    item => item[xAxisField] === category && item[groupByField] === group
                ).length;
            });
            
            return {
                label: group,
                data: counts,
                backgroundColor: colors[index].replace('1)', '0.5)'),
                borderColor: colors[index],
                borderWidth: 1
            };
        });
        
        return {
            labels: xLabels,
            datasets: datasets
        };
    }
}

// Generate an array of colors
function generateColors(count) {
    const baseColors = [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)'
    ];
    
    // If we need more colors than the base set, generate them
    if (count <= baseColors.length) {
        return baseColors.slice(0, count);
    } else {
        const colors = [...baseColors];
        
        for (let i = baseColors.length; i < count; i++) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            colors.push(`rgba(${r}, ${g}, ${b}, 1)`);
        }
        
        return colors;
    }
}

// Calculate correlation between two numerical variables
function calculateCorrelation() {
    const var1 = document.getElementById('correlationVar1').value;
    const var2 = document.getElementById('correlationVar2').value;
    
    // Extract numerical values
    const pairs = filteredData
        .map(item => [Number(item[var1]), Number(item[var2])])
        .filter(pair => !isNaN(pair[0]) && !isNaN(pair[1]));
    
    if (pairs.length < 3) {
        document.getElementById('correlationResult').innerHTML = 
            '<div class="alert alert-warning">Insufficient data points for correlation (need at least 3).</div>';
        return;
    }
    
    // Calculate means
    const mean1 = pairs.reduce((sum, pair) => sum + pair[0], 0) / pairs.length;
    const mean2 = pairs.reduce((sum, pair) => sum + pair[1], 0) / pairs.length;
    
    // Calculate covariance and standard deviations
    let covariance = 0;
    let variance1 = 0;
    let variance2 = 0;
    
    pairs.forEach(pair => {
        const diff1 = pair[0] - mean1;
        const diff2 = pair[1] - mean2;
        
        covariance += diff1 * diff2;
        variance1 += diff1 * diff1;
        variance2 += diff2 * diff2;
    });
    
    covariance /= pairs.length;
    variance1 /= pairs.length;
    variance2 /= pairs.length;
    
    const stdDev1 = Math.sqrt(variance1);
    const stdDev2 = Math.sqrt(variance2);
    
    // Calculate Pearson correlation coefficient
    const correlation = covariance / (stdDev1 * stdDev2);
    
    // Determine correlation strength
    let strengthClass = '';
    let strengthText = '';
    
    if (Math.abs(correlation) >= 0.7) {
        strengthClass = 'correlation-strong';
        strengthText = correlation > 0 ? 'Strong positive' : 'Strong negative';
    } else if (Math.abs(correlation) >= 0.3) {
        strengthClass = 'correlation-moderate';
        strengthText = correlation > 0 ? 'Moderate positive' : 'Moderate negative';
    } else {
        strengthClass = 'correlation-weak';
        strengthText = correlation > 0 ? 'Weak positive' : 'Weak negative';
    }
    
    // Display the result
    document.getElementById('correlationResult').innerHTML = `
        <div class="${strengthClass} p-3 rounded">
            <h5>Correlation Result</h5>
            <p><strong>Pearson correlation coefficient:</strong> ${correlation.toFixed(4)}</p>
            <p><strong>Interpretation:</strong> ${strengthText} correlation</p>
            <p><strong>Sample size:</strong> ${pairs.length} data points</p>
        </div>
    `;
    
    // Also update the chart to show a scatter plot of these two variables
    document.getElementById('chartType').value = 'scatter';
    document.getElementById('xAxisSelect').value = var1;
    document.getElementById('yAxisSelect').value = var2;
    updateChart();
}

// Export filtered data to CSV
function exportFilteredDataToCSV() {
    if (filteredData.length === 0) {
        alert('No data to export');
        return;
    }
    
    const headers = Object.keys(filteredData[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    filteredData.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            // Escape quotes and wrap in quotes if the value contains a comma
            return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvContent += values.join(',') + '\n';
    });
    
    // Create a blob and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'filtered_survey_data.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}