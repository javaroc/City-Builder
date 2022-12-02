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


const DEFAULT_NAME = "";
let unemployed = 0;
let money = 0;
let cityName = DEFAULT_NAME;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.get('/citybuilder/gamestate', (req, res) => {
    
    //TODO MONGO
    let factoryCount = BuiltBuilding.findOne({ name: 'factory' }).select('count');
    let houseCount = BuiltBuilding.findOne({ name: 'house' }).select('count');
    res.send ({
        cityName: cityName,
        money: money,
        unemployed: unemployed,
        buildingCounts: {
            factoryCount: factoryCount,
            houseCount: houseCount
        }
    });
});

app.post('/citybuilder/name/:name', (req,res) =>{
    cityName = req.params.name;
    res.send({
        cityName: cityName
    });
});
app.post('/citybuilder/nextday', (req,res) =>{
    this.setState({money: this.state.money + 100});
    this.setState({day: this.state.day + 1});
    money += 100; // Flat income
    // Add income for buildings
    let buildingCounts = BuiltBuilding.find();
    buildingCounts.forEach((row) => {
        let incomePer = LookupBuilding.findOne({name: row.name}).select('income');
        money += row.count * incomePer;
    });
    res.sendStatus(200);
});
app.post('/citybuilder/build/:buildingType', (req, res) => {
    let buildingType = buildingType;
    let buildingProperties = LookupBuilding.findOne({'name': buildingType});
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
    
    let oldCount = BuiltBuilding.findOne({name: buildingType}).select('count');
    BuiltBuilding.updateOne({name: req.params.buildingType}, {count: oldCount + 1});
    //res.send both vars
    res.sendStatus(200);
});
app.post('citybuilder/endgame', (req, res) => {
    //send city to mongo database;
    //reset currentcity to new
    const newScore = new Score({
        name: cityName,
        score: money
    });
    newScore.save();
    
    unemployed = 0;
    money = 0;
    cityName = DEFAULT_NAME;
    BuiltBuilding.updateMany({}, { count: 0});
    
    res.sendStatus(200);
});
app.get('/citybuilder/scores', (req, res) => {
    //call all cities in database 
    res.send(Score.find());
});

app.listen(3000, () => console.log('Server listening on port 3000!'));