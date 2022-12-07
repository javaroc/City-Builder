const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.connection.useDb('citybuilder');

const LookupBuilding = mongoose.model('BuildingType', {
    name: String,
    moneyCost: Number,
    populationCost: Number,
    income: Number
});

const BuiltBuilding = mongoose.model('BuildingCount', {
    name: String,
    count: Number
});

const Score = mongoose.model('Score', {
    name: String,
    score: Number
});

// Initialize lookup table
LookupBuilding.deleteMany({});
const factory = new LookupBuilding({
    name: 'factory',
    moneyCost: 300,
    populationCost: 5,
    income: 100
});
const house = new LookupBuilding({
    name: 'house',
    moneyCost: 200,
    populationCost: -5,
    income: 0
});
factory.save();
house.save();

//Initialize building count table
BuiltBuilding.deleteMany({});
const factoryCount = new BuiltBuilding({
    name: 'factory',
    count: 0
});
const houseCount = new BuiltBuilding({
    name: 'house',
    count: 0
});
factoryCount.save();
houseCount.save();


const DEFAULT_NAME = "New City";
let unemployed = 20;
let money = 500;
let cityName = DEFAULT_NAME;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.get('/citybuilder/gamestate', async (req, res) => {
    console.log("Handling GET /gamestate");
    //TODO MONGO
    let factoryCount = (await BuiltBuilding.findOne({ name: 'factory' }).select('count')).count;
    let houseCount = (await BuiltBuilding.findOne({ name: 'house' }).select('count')).count;
    let returnObject = {
        cityName: cityName,
        money: money,
        unemployed: unemployed,
        buildingCounts: {
            factoryCount: factoryCount,
            houseCount: houseCount
        }
    };
    console.log(returnObject);
    res.send(returnObject);
});

app.post('/citybuilder/name/:name', (req,res) =>{
    console.log("Handling POST /name");
    cityName = req.params.name;
    res.send({
        cityName: cityName
    });
});
app.post('/citybuilder/nextday', async (req,res) =>{
    console.log("Handling POST /nextday");
    money += 100; // Flat income
    // Add income for buildings
    let buildingCounts = await BuiltBuilding.find();
    console.log(buildingCounts.length);
    buildingCounts.forEach(async (row) => {
        // console.log("row:")
        // console.log(row);
        let incomePer = (await LookupBuilding.findOne({name: row.name}).select('income')).income;
        // console.log(incomePer)
        money += row.count * incomePer;
    });
    res.sendStatus(200);
});
app.post('/citybuilder/build/:buildingType', async (req, res) => {
    console.log("Handling POST /build");
    let buildingType = req.params.buildingType;
    let buildingProperties = await LookupBuilding.findOne({'name': buildingType});
    //take away money
    if (unemployed < buildingProperties.populationCost) {
        res.status(400)
        .send(`Insufficient population to build ${buildingType}`);
        return;
    }
    if (money < buildingProperties.moneyCost) {
        res.status(400)
        .send(`Insufficient funds to build ${buildingType}`);
        return;
    }
    unemployed -= buildingProperties.populationCost;
    money -= buildingProperties.moneyCost;
    
    let oldCount = (await BuiltBuilding.findOne({name: buildingType})).count;
    await BuiltBuilding.updateOne({name: req.params.buildingType}, {count: oldCount + 1});
    //res.send both vars
    res.sendStatus(200);
});
app.post('/citybuilder/endgame', async (req, res) => {
    //send city to mongo database;
    //reset currentcity to new
    const newScore = new Score({
        name: cityName,
        score: money
    });
    newScore.save();
    
    await BuiltBuilding.updateMany({}, { count: 0});
    
    unemployed = 0;
    money = 0;
    cityName = DEFAULT_NAME;
    res.sendStatus(200);
});
app.get('/citybuilder/scores', async (req, res) => {
    //call all cities in database 
    res.send(await Score.find());
});

app.listen(3005, () => console.log('Server listening on port 3005!'));