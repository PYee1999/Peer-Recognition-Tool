const Employee = require('./models/employee.model.js');
const Company = require("./models/company.model.js");
const Recognition = require("./models/recognition.model.js");
const MonthlyAward = require("./models/monthly-award.model.js");
const scheduler = require("node-schedule");

// const testRule = new scheduler.RecurrenceRule();
// testRule.second = [new scheduler.Range(0, 59)];
// // const testJobInterval = "/1 * * * * *";
// const testJob = scheduler.scheduleJob(testRule, testJobFunction);

// function testJobFunction(){
//   console.log("Tick");
// }

const rockstarRule = new scheduler.RecurrenceRule();
// rockstarRule.second = 0;
// rockstarRule.minute = 0;
rockstarRule.minute = [new scheduler.Range(0, 59)];
// rockstarRule.hour = 0;
// rockstarRule.date = 1;
rockstarRule.month = [new scheduler.Range(0, 11)];

async function saveAwardWinners() {
    const companies = await Company.find({});
    companies.forEach(saveAwardWinnersOfCompany);
    // companies.forEach(company => {
    //     const companyID = company.companyId;
    //     const recognitions = await Recognition.find({companyID: companyID});

    //     for(const recognition in recognitions){
    //         console.log(recognition);
    //         console.log("hi");
    //     }
    // });
    // companies.forEach(saveAwardWinnersOfCompany);
}

async function saveAwardWinnersOfCompany(company) {
    const companyID = company.companyId;
    const recognitions = await Recognition.find({ companyID: companyID });

    saveRockstarWinnersOfCompany(company);
}

// async function saveAwardWinnersOfCompany(company) {
//     saveRockstarWinnersOfCompany(company);
// }

async function saveRockstarWinnersOfCompany(company) {
    const companyID = company.companyId;
    const recognitions = await Recognition.find({ companyID: companyID });
    // const rockstarHistogram = new Map();
    const coreValueHistograms = new Map();
    var maxNumRecognitions = 0;

    // recognitions.forEach(recognition => {
    //     const receiverID = recognition.receiverID;
    //     const coreValues = recognition.values;

    //     if (rockstarHistogram.has(receiverID)) {
    //         const curNumRecognitions = rockstarHistogram.get(receiverID);
    //         const newNumRecognitions = curNumRecognitions + 1;
    //         rockstarHistogram.set(receiverID, newNumRecognitions);
    //     } else {
    //         rockstarHistogram.set(receiverID, 1);
    //     }

    //     const numRecognitions = rockstarHistogram.get(receiverID);

    //     if (numRecognitions > maxNumRecognitions) {
    //         maxNumRecognitions = numRecognitions;
    //     }
    // });

    const rockstarCalculation = makeHistogramAndMetadata(recognitions, rockstarTest);
    maxNumRecognitions = rockstarCalculation.maxNumRecognitions;
    const rockstarHistogram = rockstarCalculation.histogram;

    console.log(rockstarHistogram);

    rockstarHistogram.entries().forEach(([receiverID, numRecognitions]) => {
        if (numRecognitions == maxNumRecognitions) {
            const awardWinner = await Employee.findOne({
                companyId: companyID,
                employeeId: receiverID
            });

            const newRockstarAward = new MonthlyAward({
                awardName: "Rockstar of the Month",
                companyID: companyID,
                employeeID: awardWinner.companyId,

                employeeName: awardWinner.firstName +
                    " " +
                    awardWinner.lastName,

                dateGiven: new Date(),
                numRecognitions: numRecognitions,
                value: ""
            });

            newRockstarAward.save();
        }
    });
}

function makeHistogramAndMetadata(recognitions, test) {
    const histogram = new Map();
    var maxNumRecognitions = 0;

    for (const recognition in recognitions) {
        console.log(recognition);
        const receiverID = recognition.receiverID;

        if (test(recognition) == true) {
            incrementHistogram(histogram, receiverID);
        }

        const numRecognitions = histogram.get(receiverID);

        if (numRecognitions > maxNumRecognitions) {
            maxNumRecognitions = numRecognitions;
        }
    }

    return {
        histogram: histogram,
        maxNumRecognitions: maxNumRecognitions
    };
}

function incrementHistogram(histogram, key) {
    if (histogram.has(key)) {
        const curValue = histogram.get(key);
        const newValue = curValue + 1;
        histogram.set(key, newValue);
    } else {
        histogram.set(key, 1);
    }
}

function rockstarTest(recognition) {
    return true;
}

module.exports = saveAwardWinners;